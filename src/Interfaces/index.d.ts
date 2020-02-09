declare interface User {
  id: string;
}

declare interface LoginInputValidator {
  isValidEmail(email: string): boolean;
  isValidPassword(password: string): boolean;
}

declare interface UserDBGateway {
  addUser(email: string, password: string): Promise<User>;
  getUserByEmailAndPassword(email: string, password: string): Promise<User>;
}
