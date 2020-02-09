import AuthInteractor, {
  InvalidInputError,
  GatewayError,
  SignUpError,
  LoginError,
} from "./AuthInteractor";

import {
  UserGateWayMockThatWorks,
  BrokenUserGateWayMock,
  FakeUser,
  LoginValidatorMock,
} from "./__mocks__";

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
      test("should throw an error when email/password is not provided", async () => {
        expect.assertions(2);

        await assertAsyncFuncToReject(
          authInteractor.signup("", "pass"),
          InvalidInputError
        );
        await assertAsyncFuncToReject(
          authInteractor.signup("email", ""),
          InvalidInputError
        );
      });
      test("provided bad password, should throw an error", async () => {
        authInteractor.setValidator(new LoginValidatorMock());
        expect.assertions(1);

        await assertAsyncFuncToReject(
          authInteractor.signup("good@email.com", "bad_pass"),
          InvalidInputError
        );
      });

      test("provided with bad email, should throw an error", async () => {
        authInteractor.setValidator(new LoginValidatorMock());
        expect.assertions(2);

        await assertAsyncFuncToReject(
          authInteractor.signup("bad_email", "good_password"),
          InvalidInputError
        );
        await assertAsyncFuncToReject(
          authInteractor.signup("email_bad", "good_password"),
          InvalidInputError
        );
      });
    });

    describe("Invalid setup cases", () => {
      test("throws GatewayError when user db gateway not set", async () => {
        expect.assertions(1);

        await assertAsyncFuncToReject(
          authInteractor.signup("good@email.com", "good_pass"),
          GatewayError
        );
      });

      test("throws SignUpError when user db gateway connection is broken", async () => {
        expect.assertions(1);

        authInteractor.setUserGateway(new BrokenUserGateWayMock());

        await assertAsyncFuncToReject(
          authInteractor.signup("good@email.com", "good_pass"),
          SignUpError
        );
      });
    });
  });

  describe("SignUp Flow: valid cases", () => {
    test("valid input should return new UserID", async () => {
      expect.assertions(1);

      authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      let userID = await authInteractor.signup(
        "good@email.com",
        "good_password"
      );

      expect(userID).toBeInstanceOf(FakeUser);
    });
  });

  describe("Login Flow: error cases", () => {
    describe("Invalid input cases", () => {
      beforeEach(() => {
        authInteractor.setUserGateway(new UserGateWayMockThatWorks());
      });
      test("invalid input should throw an error", async () => {
        expect.assertions(2);

        await assertAsyncFuncToReject(
          authInteractor.login("", "alkd"),
          InvalidInputError
        );
        await assertAsyncFuncToReject(
          authInteractor.login("email@myemail.com", ""),
          InvalidInputError
        );
      });
    });

    describe("Invalid setup cases", () => {
      test("calling login without setting the user gateway should throw", async () => {
        expect.assertions(1);

        await assertAsyncFuncToReject(
          authInteractor.login("good@dmail.com", "password_good"),
          GatewayError
        );
      });
    });

    describe("Valid but wrong input cases", () => {
      test("non existing user cannot login", async () => {
        expect.assertions(1);

        authInteractor.setUserGateway(new UserGateWayMockThatWorks());
        await assertAsyncFuncToReject(
          authInteractor.login("unknown_email", "_password"),
          LoginError
        );
      });
      test("provided wrong password for existing user throws an error", async () => {
        expect.assertions(1);

        authInteractor.setUserGateway(new UserGateWayMockThatWorks());
        const email = "myemail@gmail.com";
        const password = "averygoodpassword";
        await authInteractor.signup(email, password);
        await assertAsyncFuncToReject(
          authInteractor.login(email, "wrong_password"),
          LoginError
        );
      });
    });
  });

  describe("Login Flow: valid cases", () => {
    test("new user logins with valid email and password", async () => {
      expect.assertions(1);

      authInteractor.setUserGateway(new UserGateWayMockThatWorks());

      const email = "email@gmail.com";
      const password = "my_good_password";
      await authInteractor.signup(email, password);

      let userID = await authInteractor.login(email, password);

      expect(userID.id).toBe(`${email}-${password}`);
    });
  });
});

async function assertAsyncFuncToReject(func: Promise<any>, ErrorClass: Error) {
  return expect(func).rejects.toThrow(ErrorClass.message);
}
