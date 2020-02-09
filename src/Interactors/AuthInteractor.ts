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
  getUserByEmailAndPassword(email: string, password: string): Promise<UserID>;
}

export default class AuthInteractor {
  private inputValidator: LoginInputValidator | undefined;
  private userDBGateway: UserDBGateway | undefined;
  constructor(validator?: LoginInputValidator, userDBGateway?: UserDBGateway) {
    this.inputValidator = validator;
    this.userDBGateway = userDBGateway;
  }

  /**
   * new user sign up
   *
   * requires:
   *  - @method setUserGateway to have been called with valid user gateway implemenation.
   *  - email and password.
   *
   * optional:
   *  - If input validator has been set with @method setValidator then
   *    email and password should match criteria defined by that validator
   *
   * gaurentees: @Class UserID
   *
   * @param email
   * @param password
   */
  async signup(email: string, password: string) {
    this.validateInput(email, password);
    try {
      return await this.addUser(email, password);
    } catch (e) {
      throw new Error("Something went wrong with user DB gateway");
    }
  }

  /**
   * requires:
   *  - valid email and password. If input validator has been set then email and password
   *    should match those criteria.
   *
   * guarntees:
   *  - existing @Class UserID that matches the given email
   *
   * @param email
   * @param password
   */
  public async login(email: string, password: string) {
    this.validateInput(email, password);
    try {
      return await this.getUser(email, password);
    } catch (e) {
      throw new Error("Could not log you in.");
    }
  }

  getUser(email: string, password: string): Promise<UserID> {
    if (!this.userDBGateway) throw new Error("User DB gateway not set");
    return this.userDBGateway.getUserByEmailAndPassword(email, password);
  }

  private async addUser(email: string, password: string) {
    if (!this.userDBGateway) throw new Error("User DB gateway not set");
    return await this.userDBGateway.addUser(email, password);
  }

  private validateInput(email: string, password: string) {
    if (!email.length || !password.length) {
      throw new Error("Must provide email or password");
    }
    if (this.inputValidator && !this.inputValidator.isValidEmail(email)) {
      throw new Error("Email doesn't meet minimum criteria");
    }
    if (this.inputValidator && !this.inputValidator.isValidPassword(password)) {
      throw new Error("Password doesn't meet minimum criteria");
    }
  }

  setValidator(validator: LoginInputValidator) {
    this.inputValidator = validator;
  }

  setUserGateway(gateway: UserDBGateway) {
    this.userDBGateway = gateway;
  }
}
