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

    test("Broken User Gateway should throw an error", () => {
      authInteractor.setUserGateway(new UserGatewayMockThatBreaks());
      assertAsyncFuncToReject(
        authInteractor.signup("good@email.com", "goodPasswerod")
      );
    });
  });

  describe("SignUp Flow: valid cases", () => {
    test("valid input should return new UserID", async () => {
      authInteractor.setUserGateway(new UserGateWayMockThatSucceeds());
      let userID = await authInteractor.signup(
        "good@email.com",
        "good_password"
      );

      expect(userID).toBeInstanceOf(UserID);
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

class UserGateWayMockThatSucceeds implements UserDBGateway {
  async addUser(email: string, password: string): Promise<UserID> {
    return new UserID(`${email}-${password}`);
  }
}

class UserGatewayMockThatBreaks implements UserDBGateway {
  async addUser(email: string, password: string): Promise<UserID> {
    throw new Error(`${email}-${password}`);
  }
}

function assertAsyncFuncToReject(funcToCall: Promise<any>) {
  expect(funcToCall).rejects.toBeInstanceOf(Error);
}
