import AuthInteractor, {
  // eslint-disable-next-line no-unused-vars
  LoginInputValidator,
  // eslint-disable-next-line no-unused-vars
  UserDBGateway,
  User,
  InvalidInputError,
  GatewayError,
  SignUpError,
  LoginError,
} from "./AuthInteractor";

describe("AuthInteractor", () => {
  let authInteractor: AuthInteractor;

  beforeEach(() => {
    authInteractor = new AuthInteractor();
  });

  describe("SignUp Flow: error cases", () => {
    describe("Invalid input cases", () => {
      beforeEach(() => {
        authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      });
      test("should throw an error when email/password is not provided", () => {
        assertAsyncFuncToReject(
          authInteractor.signup("", "pass"),
          InvalidInputError
        );
        assertAsyncFuncToReject(
          authInteractor.signup("email", ""),
          InvalidInputError
        );
      });
      test("provided bad password, should throw an error", () => {
        authInteractor.setValidator(new LoginValidatorMock());
        assertAsyncFuncToReject(
          authInteractor.signup("good@email.com", "bad_pass"),
          InvalidInputError
        );
      });

      test("provided with bad email, should throw an error", () => {
        authInteractor.setValidator(new LoginValidatorMock());

        assertAsyncFuncToReject(
          authInteractor.signup("bad_email", "good_password"),
          InvalidInputError
        );
        assertAsyncFuncToReject(
          authInteractor.signup("email_bad", "good_password"),
          InvalidInputError
        );
      });
    });

    describe("Invalid setup cases", () => {
      test("throws GatewayError when user db gateway not set", () => {
        assertAsyncFuncToReject(
          authInteractor.signup("good@email.com", "good_pass"),
          GatewayError
        );
      });

      test("throws SignUpError when user db gateway connection is broken", () => {
        authInteractor.setUserGateway(new BrokenUserGateWayMock());
        assertAsyncFuncToReject(
          authInteractor.signup("good@email.com", "good_pass"),
          SignUpError
        );
      });
    });
  });

  describe("SignUp Flow: valid cases", () => {
    test("valid input should return new UserID", async () => {
      authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      let userID = await authInteractor.signup(
        "good@email.com",
        "good_password"
      );

      expect(userID).toBeInstanceOf(User);
    });
  });

  describe("Login Flow: error cases", () => {
    describe("Invalid input cases", () => {
      beforeEach(() => {
        authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      });
      test("invalid input should throw an error", () => {
        assertAsyncFuncToReject(
          authInteractor.login("", "alkd"),
          InvalidInputError
        );
        assertAsyncFuncToReject(
          authInteractor.login("email@myemail.com", ""),
          InvalidInputError
        );
      });
    });

    describe("Invalid setup cases", () => {
      test("calling login without setting the user gateway should throw", () => {
        assertAsyncFuncToReject(
          authInteractor.login("good@dmail.com", "password_good"),
          GatewayError
        );
      });
    });

    describe("Valid but wrong input cases", () => {
      test("non existing user cannot login", () => {
        authInteractor.setUserGateway(new UserGateWayMockThatWorks());
        assertAsyncFuncToReject(
          authInteractor.login("unknown_email", "_password"),
          LoginError
        );
      });
      test("provided wrong password for existing user throws an error", async () => {
        authInteractor.setUserGateway(new UserGateWayMockThatWorks());
        const email = "myemail@gmail.com";
        const password = "averygoodpassword";
        await authInteractor.signup(email, password);
        assertAsyncFuncToReject(
          authInteractor.login(email, "wrong_password"),
          LoginError
        );
      });
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
  getUserByEmailAndPassword(email: string, password: string): Promise<User> {
    if (this.db[email] && this.db[email] == password) {
      return Promise.resolve(new User(`${email}-${password}`));
    } else throw new Error("wrong password");
  }
  async addUser(email: string, password: string): Promise<User> {
    this.db[email] = password;
    return new User(`${email}-${password}`);
  }
}

class BrokenUserGateWayMock implements UserDBGateway {
  addUser(email: string, password: string): Promise<User> {
    throw new Error("Method not implemented.");
  }

  getUserByEmailAndPassword(email: string, password: string): Promise<User> {
    throw new Error("Method not implemented.");
  }
}

function assertAsyncFuncToReject(func: Promise<any>, ErrorClass: Error) {
  expect(func).rejects.toThrow(ErrorClass.message);
}
