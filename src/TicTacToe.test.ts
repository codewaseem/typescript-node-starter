import { PlayerChar, TicTacToe } from "./TicTacToe";
import { winCases } from "./testsData/moves";

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

  test(`can determine winner`, () => {
    expect(ticTacToe.getWinner()).toBeNull();

    Object.keys(winCases).map((winner) => {
      winCases[winner].forEach((winCase) => {
        ticTacToe.reset();
        winCase.forEach((move) => {
          ticTacToe.play(...move);
        });
        expect(ticTacToe.getWinner()).toBe(winner);
      });
    });
  });

  test.todo(`can determine draw`, () => {});
});
