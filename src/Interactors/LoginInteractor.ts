export interface LoginInputValidator {
  isValidEmail(email: string): boolean;
  isValidPassword(password: string): boolean;
}

export class UserID {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export interface UserDBGateway {
  addUser(email: string, password: string): Promise<UserID>;
}

export default class LoginInteractor {
  private inputValidator: LoginInputValidator | undefined;
  private userDBGateway: UserDBGateway | undefined;
  constructor(validator?: LoginInputValidator, userDBGateway?: UserDBGateway) {
    this.inputValidator = validator;
    this.userDBGateway = userDBGateway;
  }

  async signup(email: string, password: string) {
    if (!email.length || !password.length) {
      throw new Error("Must provide email or password");
    }

    if (this.inputValidator && !this.inputValidator.isValidEmail(email)) {
      throw new Error("Email doesn't meet minimum criteria");
    }

    if (this.inputValidator && !this.inputValidator.isValidPassword(password)) {
      throw new Error("Password doesn't meet minimum criteria");
    }

    if (!this.userDBGateway) throw new Error("User DB gateway not set");
    try {
      let userID = await this.userDBGateway.addUser(email, password);
      return userID;
    } catch (e) {
      throw new Error("Something went wrong with user DB gateway");
    }
  }

  setValidator(validator: LoginInputValidator) {
    this.inputValidator = validator;
  }

  setUserGateway(gateway: UserDBGateway) {
    this.userDBGateway = gateway;
  }
}
