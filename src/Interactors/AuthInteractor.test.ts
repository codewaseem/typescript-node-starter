import AuthInteractor, {
  // eslint-disable-next-line no-unused-vars
  LoginInputValidator,
  // eslint-disable-next-line no-unused-vars
  UserDBGateway,
  UserID,
} from "./AuthInteractor";

describe("AuthInteractor", () => {
  let authInteractor: AuthInteractor;

  beforeEach(() => {
    authInteractor = new AuthInteractor();
  });

  describe("SignUp Flow: error cases", () => {
    test("should throw an error when email/password is not provided", () => {
      assertAsyncFuncToReject(authInteractor.signup("", "pass"));
      assertAsyncFuncToReject(authInteractor.signup("email", ""));
    });

    test("throws an error when user db gateway not set", () => {
      assertAsyncFuncToReject(
        authInteractor.signup("good@email.com", "good_pass")
      );
    });

    test("provided bad password, should throw an error", () => {
      authInteractor.setValidator(new LoginValidatorMock());
      assertAsyncFuncToReject(
        authInteractor.signup("good@email.com", "bad_pass")
      );
    });

    test("provided with bad email, should throw an error", () => {
      authInteractor.setValidator(new LoginValidatorMock());

      assertAsyncFuncToReject(
        authInteractor.signup("bad_email", "good_password")
      );
      assertAsyncFuncToReject(
        authInteractor.signup("email_bad", "good_password")
      );
    });
  });

  describe("SignUp Flow: valid cases", () => {
    test("valid input should return new UserID", async () => {
      authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      let userID = await authInteractor.signup(
        "good@email.com",
        "good_password"
      );

      expect(userID).toBeInstanceOf(UserID);
    });
  });

  describe("Login Flow: error cases", () => {
    test("invalid input should throw an error", () => {
      assertAsyncFuncToReject(authInteractor.login("", "alkd"));
      assertAsyncFuncToReject(authInteractor.login("email@myemail.com", ""));
    });

    test("calling login without setting the user gateway should throw", () => {
      assertAsyncFuncToReject(
        authInteractor.login("good@dmail.com", "password_good")
      );
    });
    test("non existing user cannot login", () => {
      authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      assertAsyncFuncToReject(
        authInteractor.login("unknown_email", "_password")
      );
    });
    test("provided wrong password for existing user throws an error", async () => {
      authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      const email = "myemail@gmail.com";
      const password = "averygoodpassword";
      await authInteractor.signup(email, password);

      assertAsyncFuncToReject(authInteractor.login(email, "wrong_password"));
    });
  });

  describe("Login Flow: valid cases", () => {
    test("new user logins with valid email and password", async () => {
      authInteractor.setUserGateway(new UserGateWayMockThatWorks());

      const email = "email@gmail.com";
      const password = "my_good_password";
      await authInteractor.signup(email, password);

      let userID = await authInteractor.login(email, password);

      expect(userID.id).toBe(`${email}-${password}`);
    });
  });
});

class LoginValidatorMock implements LoginInputValidator {
  isValidEmail(email: string): boolean {
    return !email.includes("bad");
  }
  isValidPassword(password: string): boolean {
    return !password.includes("bad");
  }
}

class UserGateWayMockThatWorks implements UserDBGateway {
  private db: { [key: string]: string } = {};
  getUserByEmailAndPassword(email: string, password: string): Promise<UserID> {
    if (this.db[email] && this.db[email] == password) {
      return Promise.resolve(new UserID(`${email}-${password}`));
    } else throw new Error("wrong password");
  }
  async addUser(email: string, password: string): Promise<UserID> {
    this.db[email] = password;
    return new UserID(`${email}-${password}`);
  }
}

function assertAsyncFuncToReject(funcToCall: Promise<any>) {
  expect(funcToCall).rejects.toBeInstanceOf(Error);
}
