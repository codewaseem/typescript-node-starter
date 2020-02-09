import { InvalidInputError } from "../Errors";

class TodoInteractor {
  async add(todo: Todo) {
    if (!todo.name.length || !todo.userId.length) {
      throw InvalidInputError;
    }
  }
}

describe("TodoInteractor", () => {
  test("can instantiate", () => {
    let todoInteractor = new TodoInteractor();
    expect(todoInteractor).toBeTruthy();
  });

  test("add() function should exists", () => {
    let todoInteractor = new TodoInteractor();
    expect(todoInteractor.add).toBeTruthy();
  });

  test("should throw an error when required inputs are not provided", async () => {
    let todoInteractor = new TodoInteractor();
    expect.assertions(1);

    await assertAsyncFuncToReject(
      todoInteractor.add({
        name: "",
        userId: "",
      } as Todo),
      InvalidInputError
    );
  });
});

export async function assertAsyncFuncToReject(
  func: Promise<any>,
  ErrorClass: Error
) {
  return expect(func).rejects.toThrow(ErrorClass.message);
}
