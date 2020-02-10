export class FakeUser implements User {
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}

export class LoginValidatorMock implements LoginInputValidator {
  isValidEmail(email: string): boolean {
    return !email.includes("bad");
  }
  isValidPassword(password: string): boolean {
    return !password.includes("bad");
  }
}

export class UserGateWayMockThatWorks implements UserDBGateway {
  private db: { [key: string]: string } = {};
  getUserByEmailAndPassword(email: string, password: string): Promise<User> {
    if (this.db[email] && this.db[email] == password) {
      return Promise.resolve(new FakeUser(`${email}-${password}`));
    } else throw new Error("wrong password");
  }
  async addUser(email: string, password: string): Promise<User> {
    this.db[email] = password;
    return new FakeUser(`${email}-${password}`);
  }
}

export class BrokenUserGateWayMock implements UserDBGateway {
  addUser(email: string, password: string): Promise<User> {
    throw new Error(`${email}-${password}`);
  }

  getUserByEmailAndPassword(email: string, password: string): Promise<User> {
    throw new Error(`${email}-${password}`);
  }
}

export class TodoDBMock implements TodoDBGateway {
  static id = 0;
  todos: {
    [userId: string]: {
      [todoId: string]: Todo;
    };
  } = {};

  async add(todo: TodoData): Promise<Todo> {
    let id = ++TodoDBMock.id;
    if (!this.todos[todo.userId]) this.todos[todo.userId] = {};
    this.todos[todo.userId][id] = { id: TodoDBMock.id + "", ...todo };
    return this.todos[todo.userId][id];
  }
  updateTodo(
    userTodoId: UserTodoId,
    dataToUpdate: TodoUpdateData
  ): Promise<Todo> {
    return Promise.resolve(
      (this.todos[userTodoId.userId][userTodoId.todoId] = {
        ...this.todos[userTodoId.userId][userTodoId.todoId],
        ...dataToUpdate,
      })
    );
  }
  getTodosByUserId(userId: string): Promise<Todo[]> {
    if (!this.todos[userId]) {
      return Promise.resolve([]);
    } else
      return Promise.resolve(
        Object.keys(this.todos[userId] || {}).map(
          (key) => this.todos[userId][key]
        )
      );
  }
}
