declare type Token = string;

declare interface ISignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  client_redirect_url: string;
}

declare interface ISignUpOutput {
  done: boolean;
}

declare interface IUser {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

declare interface ILoginInput {
  email: string;
  password: string;
}

declare interface ILoginOutput {
  user: IUser;
  token: Token;
}

declare interface IAuthInteractor {
  signUp(input: ISignUpInput): Promise<Token>;
  activateUser(token: Token): Promise<IUser | null>;
  loginWithEmailAndPassword(input: ILoginInput): Promise<ILoginOutput | null>;
  getLoggedInUser(token: Token): Promise<IUser | null>;
}

declare interface IAuthNotify {
  notifySignUp(activateLink: string): Promise<void>;
}

declare interface IAuthDB {
  addUser(input: ISignUpInput): Promise<IUser>;
  loginUser(input: ILoginInput): Promise<IUser>;
  getUserByEmail(email: String): Promise<IUser | null>;
}

declare interface IAuthInputValidator {
  isValidSignUpInput(input: ISignUpInput): Promise<boolean>;
  isValidActivateUserInput(token: Token): Promise<boolean>;
  isValidLoginInput(input: ILoginInput): Promise<boolean>;
}
