export const InvalidInputError = new Error("Invalid Input");

export const GatewayError = new Error("Gateway Error");

export const SignUpError = new Error("SignUp Failed");

export const LoginError = new Error("Login Failed");

export default class AuthInteractor {
  private inputValidator!: LoginInputValidator;
  private userDBGateway!: UserDBGateway;
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
    this.checkUserGatewayInit();
    this.validateInput(email, password);
    try {
      return await this.addUser(email, password);
    } catch (e) {
      throw SignUpError;
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
    this.checkUserGatewayInit();
    this.validateInput(email, password);
    try {
      return await this.getUser(email, password);
    } catch (e) {
      throw LoginError;
    }
  }

  private checkUserGatewayInit() {
    if (!this.userDBGateway) throw GatewayError;
  }

  private getUser(email: string, password: string): Promise<User> {
    return this.userDBGateway.getUserByEmailAndPassword(email, password);
  }

  private async addUser(email: string, password: string) {
    return await this.userDBGateway.addUser(email, password);
  }

  private validateInput(email: string, password: string) {
    let isValid = true;
    if (!email.length || !password.length) {
      isValid = false;
    }
    if (this.inputValidator && !this.inputValidator.isValidEmail(email)) {
      isValid = false;
    }
    if (this.inputValidator && !this.inputValidator.isValidPassword(password)) {
      isValid = false;
    }

    if (!isValid) throw InvalidInputError;
  }

  setValidator(validator: LoginInputValidator) {
    this.inputValidator = validator;
  }

  setUserGateway(gateway: UserDBGateway) {
    this.userDBGateway = gateway;
  }
}
