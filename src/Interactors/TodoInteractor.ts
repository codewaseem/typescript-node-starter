import { InvalidInputError, GatewayError } from "../Errors";

export default class TodoInteractor {
  todoDBGateway!: TodoDBGateway;
  async add(todo: TodoData): Promise<Todo> {
    this.checkGatewaySetup();

    if (!todo.name.length || !todo.userId.length) {
      throw InvalidInputError;
    }
    return await this.todoDBGateway.add(todo);
  }

  async getUserTodos(userId: UserId) {
    this.checkGatewaySetup();
    if (!userId || !userId.length) throw InvalidInputError;

    return await this.todoDBGateway.getTodosByUserId(userId);
  }

  async updateTodo(
    oldTodo: { todoId: TodoId; userId: UserId },
    todoToUpdate: TodoUpdateData
  ): Promise<Todo> {
    this.checkGatewaySetup();
    this.validateUpdateData(todoToUpdate, oldTodo);
    return await this.todoDBGateway.updateTodo(oldTodo, todoToUpdate);
  }

  private validateUpdateData(
    todoToUpdate: TodoUpdateData,
    oldTodo: { todoId: string; userId: string }
  ) {
    if (!Object.keys(todoToUpdate).length || !oldTodo.todoId || !oldTodo.userId)
      throw InvalidInputError;
  }

  private checkGatewaySetup() {
    if (!this.todoDBGateway) throw GatewayError;
  }

  setTodoGateway(todoDBGateway: TodoDBGateway) {
    this.todoDBGateway = todoDBGateway;
  }
}
