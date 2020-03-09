/* eslint-disable no-unused-vars */
class AuthInputValidator implements IAuthInputValidator {
  isValidSignUpInput(input: ISignUpInput): Promise<boolean> {
    return Promise.resolve(true);
  }
  isValidActivateUserInput(token: string): Promise<boolean> {
    return Promise.resolve(true);
  }
  isValidLoginInput(input: ILoginInput): Promise<boolean> {
    return Promise.resolve(true);
  }
}

const authInputValidator = new AuthInputValidator();

export default authInputValidator;
