enum PlayerChar {
  "X" = "X",
  "O" = "O",
}

type GameBoard = [
  [PlayerChar | null, PlayerChar | null, PlayerChar | null],
  [PlayerChar | null, PlayerChar | null, PlayerChar | null],
  [PlayerChar | null, PlayerChar | null, PlayerChar | null]
];

class TicTacToe {
  private filledPosition: { [key: string]: boolean } = {};
  private movesCount = 0;
  private players: [PlayerChar.X, PlayerChar.O] = [PlayerChar.X, PlayerChar.O];
  private board: GameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  reset() {
    this.filledPosition = {};
    this.movesCount = 0;
    this.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }

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
    this.board[x - 1][y - 1] = this.getCurrentPlayer();
    this.movesCount++;
  }

  play(this: TicTacToe, x: number, y: number) {
    this.checkMove(x, y);
    this.markFilled(x, y);
  }

  getTotalMoves() {
    return this.movesCount;
  }

  getCurrentPlayer() {
    return this.players[this.movesCount % 2];
  }

  getBoardMap() {
    return this.board;
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

  test("should be able to track number of total moves", () => {
    ticTacToe.play(1, 1);
    expect(ticTacToe.getTotalMoves()).toBe(1);

    ticTacToe.play(1, 2);
    expect(ticTacToe.getTotalMoves()).toBe(2);

    ticTacToe.play(1, 3);
    ticTacToe.play(3, 2);
    ticTacToe.play(2, 2);
    expect(ticTacToe.getTotalMoves()).toBe(5);
  });

  test("`X` should be the first player, `O` should be second player", () => {
    expect(ticTacToe.getCurrentPlayer()).toBe(PlayerChar.X);
    ticTacToe.play(1, 1);
    expect(ticTacToe.getCurrentPlayer()).toBe(PlayerChar.O);
    ticTacToe.play(1, 2);
    expect(ticTacToe.getCurrentPlayer()).toBe(PlayerChar.X);
    ticTacToe.play(2, 1);
    expect(ticTacToe.getCurrentPlayer()).toBe(PlayerChar.O);
  });

  test(`should have correct game board representation and state`, () => {
    expect(ticTacToe.getBoardMap()).toEqual([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);

    ticTacToe.play(1, 1);
    expect(ticTacToe.getBoardMap()).toEqual([
      ["X", null, null],
      [null, null, null],
      [null, null, null],
    ]);

    ticTacToe.play(1, 2);
    expect(ticTacToe.getBoardMap()).toEqual([
      ["X", "O", null],
      [null, null, null],
      [null, null, null],
    ]);

    ticTacToe.play(3, 3);
    expect(ticTacToe.getBoardMap()).toEqual([
      ["X", "O", null],
      [null, null, null],
      [null, null, "X"],
    ]);

    ticTacToe.play(2, 2);
    expect(ticTacToe.getBoardMap()).toEqual([
      ["X", "O", null],
      [null, "O", null],
      [null, null, "X"],
    ]);

    ticTacToe.play(3, 2);
    expect(ticTacToe.getBoardMap()).toEqual([
      ["X", "O", null],
      [null, "O", null],
      [null, "X", "X"],
    ]);

    ticTacToe.play(3, 1);
    expect(ticTacToe.getBoardMap()).toEqual([
      ["X", "O", null],
      [null, "O", null],
      ["O", "X", "X"],
    ]);

    expect(ticTacToe.play.bind(ticTacToe, 3, 1)).toThrow();

    ticTacToe.reset();

    expect(ticTacToe.getBoardMap()).toEqual([
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ]);

    expect(ticTacToe.getTotalMoves()).toBe(0);
    expect(ticTacToe.getCurrentPlayer()).toBe(PlayerChar.X);
  });
});
