class AuthInputValidator implements IAuthInputValidator {
  isValidSignUpInput(input: ISignUpInput): Promise<boolean> {
    console.log(input);
    return Promise.resolve(true);
  }
  isValidActivateUserInput(token: string): Promise<boolean> {
    console.log(token);
    return Promise.resolve(true);
  }
  isValidLoginInput(input: ILoginInput): Promise<boolean> {
    console.log(input);
    return Promise.resolve(true);
  }
}

const authInputValidator = new AuthInputValidator();

export default authInputValidator;
