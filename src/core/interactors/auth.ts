import tokenManager, { ExpireIn } from "../utils/token-manager";

enum TokenUseCase {
  "SignUp" = "SignUp",
  "LogIn" = "LogIn",
}

class AuthInteractor implements IAuthInteractor {
  private notifier: IAuthNotify;
  private dbGateway: IAuthDB;
  private inputValidator: IAuthInputValidator;

  constructor({
    notifier,
    dbGateway,
    inputValidator,
  }: {
    notifier: IAuthNotify;
    dbGateway: IAuthDB;
    inputValidator: IAuthInputValidator;
  }) {
    this.notifier = notifier;
    this.dbGateway = dbGateway;
    this.inputValidator = inputValidator;
  }

  async signUp(input: ISignUpInput): Promise<string> {
    if (await this.inputValidator.isValidSignUpInput(input)) {
      let token = tokenManager.generateToken(input, TokenUseCase.SignUp, {
        expiresIn: ExpireIn["15MIN"],
      });
      this.notifier.notifySignUp(input.client_redirect_url + token);
      return token;
    } else {
      return "";
    }
  }

  async activateUser(token: Token): Promise<IUser | null> {
    if (await this.inputValidator.isValidActivateUserInput(token)) {
      let userData = tokenManager.verifyToken(token, TokenUseCase.SignUp);
      if (!userData) return null;

      let oldUser = await this.dbGateway.getUserByEmail(
        (userData as IUser).email
      );
      if (oldUser) return null;
      return await this.dbGateway.addUser(userData);
    } else {
      return null;
    }
  }

  async loginWithEmailAndPassword(
    input: ILoginInput
  ): Promise<ILoginOutput | null> {
    if (this.inputValidator.isValidLoginInput(input)) {
      let user = await this.dbGateway.loginUser(input);
      let token = tokenManager.generateToken(user, TokenUseCase.LogIn, {
        expiresIn: ExpireIn["15DAYS"],
      });
      return {
        user,
        token,
      };
    } else {
      return null;
    }
  }

  async getLoggedInUser(token: Token) {
    let isLoggedIn: IUser | null = null;
    try {
      let user = tokenManager.verifyToken(token, TokenUseCase.LogIn) as IUser;
      if (user && user.email) return user;
      return null;
    } catch (e) {
      isLoggedIn = null;
    }
    return isLoggedIn;
  }
}

export default AuthInteractor;
