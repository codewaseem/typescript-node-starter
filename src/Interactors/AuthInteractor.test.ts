import AuthInteractor, {
  // eslint-disable-next-line no-unused-vars
  LoginInputValidator,
  // eslint-disable-next-line no-unused-vars
  UserDBGateway,
  UserID,
} from "./AuthInteractor";

describe("LoginInteractor", () => {
  let authInteractor: AuthInteractor;

  beforeEach(() => {
    authInteractor = new AuthInteractor();
  });

  test("should have email and password, else throw error", () => {
    assertAsyncFuncToReject(authInteractor.signup("", "pass"));
    assertAsyncFuncToReject(authInteractor.signup("email", ""));
  });

  describe("LoginInteractor with LoginInputValidator", () => {
    test("should validate email input, if email is bad throws an error", () => {
      authInteractor.setValidator(new LoginValidatorMock());

      assertAsyncFuncToReject(
        authInteractor.signup("bad_email", "good_password")
      );
      assertAsyncFuncToReject(
        authInteractor.signup("email_bad", "good_password")
      );
    });

    test("should validate password, if password is bad throws an error", () => {
      authInteractor.setValidator(new LoginValidatorMock());
      assertAsyncFuncToReject(
        authInteractor.signup("good@email.com", "bad_pass")
      );
    });
  });

  test("throws an error when user db gateway not set", () => {
    assertAsyncFuncToReject(
      authInteractor.signup("good@email.com", "good_pass")
    );
  });
  test("valid input should return new UserID", async () => {
    authInteractor.setUserGateway(new UserGateWayMockThatSucceeds());
    let userID = await authInteractor.signup("good@email.com", "good_password");

    expect(userID).toBeInstanceOf(UserID);
  });

  test("Broken User Gateway should throw an error", () => {
    authInteractor.setUserGateway(new UserGatewayMockThatBreaks());
    assertAsyncFuncToReject(
      authInteractor.signup("good@email.com", "goodPasswerod")
    );
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
