import { InvalidInputError, GatewayError } from "../Errors";
import { TodoDBMock } from "./__mocks__";

class TodoInteractor {
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

  private checkGatewaySetup() {
    if (!this.todoDBGateway) throw GatewayError;
  }

  setTodoGateway(todoDBGateway: TodoDBGateway) {
    this.todoDBGateway = todoDBGateway;
  }
}

describe("TodoInteractor", () => {
  let todoInteractor: TodoInteractor;
  beforeEach(() => {
    todoInteractor = new TodoInteractor();
  });

  describe("When gateway is not set", () => {
    test("calling add should throw an error", async () => {
      expect.assertions(1);
      await assertAsyncFuncToReject(
        todoInteractor.add({
          name: "some",
          userId: "216",
        }),
        GatewayError
      );
    });

    test("calling getUserTodos should throw an error", async () => {
      expect.assertions(1);
      await assertAsyncFuncToReject(
        todoInteractor.getUserTodos("userId"),
        GatewayError
      );
    });
  });

  describe("TodoWithValidSetup", () => {
    beforeEach(() => {
      todoInteractor.setTodoGateway(new TodoDBMock());
    });

    test("adding todo with invalid inputs should throw error", async () => {
      expect.assertions(3);

      await assertAsyncFuncToReject(
        todoInteractor.add({
          name: "",
          userId: "",
        }),
        InvalidInputError
      );

      await assertAsyncFuncToReject(
        todoInteractor.add({
          name: "Some",
          userId: "",
        }),
        InvalidInputError
      );

      await assertAsyncFuncToReject(
        todoInteractor.add({
          name: "",
          userId: "userId",
        }),
        InvalidInputError
      );
    });

    test("when required inputs are provided the todo should be added and return it", async () => {
      let addedTodo = await todoInteractor.add({
        name: "Todo",
        userId: "123",
      });

      expect(addedTodo.id).toBe(1 + "");
      expect(addedTodo.name).toBe("Todo");
    });

    test("calling todo with empty user id should throw invalidinput error", async () => {
      expect.assertions(1);

      await assertAsyncFuncToReject(
        todoInteractor.getUserTodos(""),
        InvalidInputError
      );
    });

    test("get todos should return empty [], if user has no todos", () => {
      expect(todoInteractor.getUserTodos("12")).resolves.toMatchObject([]);
    });
    test("should be able to get todos by it's user id", async () => {
      let todoData: TodoData = {
        name: "new todo",
        userId: "12345",
      };

      let todoData2: TodoData = {
        name: "next todo",
        userId: "12345",
      };

      await todoInteractor.add(todoData);
      await todoInteractor.add(todoData2);

      await expect(
        todoInteractor.getUserTodos(todoData.userId)
      ).resolves.toMatchObject([todoData, todoData2]);
    });
  });
});

export async function assertAsyncFuncToReject(
  func: Promise<any>,
  ErrorClass: Error
) {
  return expect(func).rejects.toThrow(ErrorClass.message);
}
