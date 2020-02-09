type UserId = string;
declare interface User {
  id: UserId;
}

declare interface Todo {
  name: string;
  userId: UserId;
  description?: string;
  remindAt?: Date;
  isDaily?: boolean;
  completedAt?: Date;
}

declare interface LoginInputValidator {
  isValidEmail(email: string): boolean;
  isValidPassword(password: string): boolean;
}

declare interface UserDBGateway {
  addUser(email: string, password: string): Promise<User>;
  getUserByEmailAndPassword(email: string, password: string): Promise<User>;
}
