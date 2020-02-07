class TicTacToe {
  private filledPosition: { [key: string]: boolean } = {};

  private checkMove(x: number, y: number) {
    if (x < 1 || x > 3) {
      throw new Error("x position is out of bounds.");
    }

    if (y < 1 || y > 3) {
      throw new Error("y position is out of bounds.");
    }

    if (this.filledPosition[`${x}-${y}`]) {
      throw new Error(`(${x}, ${y}) is already filled`);
    }
  }

  private markFilled(x: number, y: number) {
    this.filledPosition[`${x}-${y}`] = true;
  }

  play(this: TicTacToe, x: number, y: number) {
    this.checkMove(x, y);
    this.markFilled(x, y);
  }
}

describe("TicTacToe", () => {
  let ticTacToe: TicTacToe;

  beforeEach(() => {
    ticTacToe = new TicTacToe();
  });
  test("should be able to instantiate", () => {
    expect(ticTacToe).toBeInstanceOf(TicTacToe);
  });

  test("invalid x position should throw an error", () => {
    // Why use .bind()?, because we don't want to call
    // the function that throws an error ourself, we want jest to call
    // it and handle the exception.

    expect(ticTacToe.play.bind(ticTacToe, 0, 1)).toThrow();
    expect(ticTacToe.play.bind(ticTacToe, -1, 1)).toThrow();
    expect(ticTacToe.play.bind(ticTacToe, 4, 1)).toThrow();

    expect(ticTacToe.play.bind(ticTacToe, 1, 1)).not.toThrow();
    expect(ticTacToe.play.bind(ticTacToe, 2, 1)).not.toThrow();
    expect(ticTacToe.play.bind(ticTacToe, 3, 1)).not.toThrow();
  });

  test("invalid y position should throw an error", () => {
    expect(ticTacToe.play.bind(ticTacToe, 1, -1)).toThrow();
    expect(ticTacToe.play.bind(ticTacToe, 1, 0)).toThrow();
    expect(ticTacToe.play.bind(ticTacToe, 1, 4)).toThrow();

    expect(ticTacToe.play.bind(ticTacToe, 1, 1)).not.toThrow();
    expect(ticTacToe.play.bind(ticTacToe, 2, 2)).not.toThrow();
    expect(ticTacToe.play.bind(ticTacToe, 3, 3)).not.toThrow();
  });

  test("should not be able to play on already occupied position", () => {
    ticTacToe.play(1, 1);
    expect(ticTacToe.play.bind(ticTacToe, 1, 1)).toThrow();

    ticTacToe.play(1, 2);
    expect(ticTacToe.play.bind(ticTacToe, 1, 2)).toThrow();

    ticTacToe.play(1, 3);
    expect(ticTacToe.play.bind(ticTacToe, 1, 3)).toThrow();

    ticTacToe.play(2, 2);
    expect(ticTacToe.play.bind(ticTacToe, 2, 2)).toThrow();
  });
});
