import LoginInteractor, {
  // eslint-disable-next-line no-unused-vars
  LoginInputValidator,
  // eslint-disable-next-line no-unused-vars
  UserDBGateway,
  UserID,
} from "./LoginInteractor";

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
    return new UserID("1");
  }
}

class UserGatewayMockThatBreaks implements UserDBGateway {
  async addUser(email: string, password: string): Promise<UserID> {
    throw new Error();
  }
}

function assertAsyncFuncToReject(funcToCall: Promise<any>) {
  expect(funcToCall).rejects.toBeInstanceOf(Error);
}

describe("LoginInteractor", () => {
  let loginInteractor: LoginInteractor;

  beforeEach(() => {
    loginInteractor = new LoginInteractor();
  });

  test("should have email and password, else throw error", async () => {
    assertAsyncFuncToReject(loginInteractor.signup("", "pass"));
    assertAsyncFuncToReject(loginInteractor.signup("email", ""));
  });

  describe("LoginInteractor with LoginInputValidator", () => {
    test("should validate email input, if email is bad throws an error", async () => {
      loginInteractor.setValidator(new LoginValidatorMock());

      assertAsyncFuncToReject(
        loginInteractor.signup("bad_email", "good_password")
      );
      assertAsyncFuncToReject(
        loginInteractor.signup("email_bad", "good_password")
      );
    });

    test("should validate password, if password is bad throws an error", async () => {
      loginInteractor.setValidator(new LoginValidatorMock());
      assertAsyncFuncToReject(
        loginInteractor.signup("good@email.com", "bad_pass")
      );
    });
  });

  test("valid input should return new UserID", async () => {
    loginInteractor.setUserGateway(new UserGateWayMockThatSucceeds());
    let userID = await loginInteractor.signup(
      "good@email.com",
      "good_password"
    );

    expect(userID).toBeInstanceOf(UserID);
  });

  test("Broken User Gateway should throw an error", async () => {
    loginInteractor.setUserGateway(new UserGatewayMockThatBreaks());
    assertAsyncFuncToReject(
      loginInteractor.signup("good@email.com", "goodPasswerod")
    );
  });
});
