type UserId = string;
type TodoId = string;

declare interface UserTodoId {
  todoId: TodoId;
  userId: UserId;
}

declare interface User {
  id: UserId;
}

declare interface TodoData {
  // id: TodoId;
  name: string;
  userId: UserId;
  description?: string;
  remindAt?: Date;
  isDaily?: boolean;
  completedAt?: Date;
}

declare interface TodoUpdateData {
  name?: string;
  description?: string;
  remindAt?: Date;
  isDaily?: boolean;
  completedAt?: Date;
}

declare interface Todo extends TodoData {
  id: TodoId;
}

declare interface LoginInputValidator {
  isValidEmail(email: string): boolean;
  isValidPassword(password: string): boolean;
}

declare interface UserDBGateway {
  addUser(email: string, password: string): Promise<User>;
  getUserByEmailAndPassword(email: string, password: string): Promise<User>;
}

declare interface TodoDBGateway {
  add(todo: TodoData): Promise<Todo>;
  getTodosByUserId(userId: UserId): Promise<Todo[]>;
  updateTodo(
    userTodoId: UserTodoId,
    dataToUpdate: TodoUpdateData
  ): Promise<Todo>;
}
