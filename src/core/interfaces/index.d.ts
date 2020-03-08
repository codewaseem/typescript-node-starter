declare type Token = string;

declare interface ISignUpInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  client_redirect_url: string;
}

declare interface IActivateUserInput {
  token: string;
}

declare interface IUser {
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

declare interface ILoginInput {
  email: string;
  password: string;
}

declare interface IAuthInteractor {
  signUp(input: ISignUpInput): Promise<Token>;
  activateUser(input: IActivateUserInput): Promise<IUser>;
  loginWithEmailAndPassword(
    input: ILoginInput
  ): Promise<{ user: IUser; token: Token }>;
}
