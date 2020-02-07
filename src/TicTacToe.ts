export enum PlayerChar {
  "X" = "X",
  "O" = "O",
}

export type GameBoard = [
  [PlayerChar | null, PlayerChar | null, PlayerChar | null],
  [PlayerChar | null, PlayerChar | null, PlayerChar | null],
  [PlayerChar | null, PlayerChar | null, PlayerChar | null]
];

export class TicTacToe {
  private movesCount = 0;
  private players: [PlayerChar.X, PlayerChar.O] = [PlayerChar.X, PlayerChar.O];
  private board: GameBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  reset() {
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

    if (this.board[x - 1][y - 1]) {
      throw new Error(`(${x}, ${y}) is already filled`);
    }
  }

  private markFilled(x: number, y: number) {
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

  getWinner() {
    if (this.movesCount < 5) return null;

    let lastPlayer = this.getLastPlayer();

    if (this.hasWonDiagonally(lastPlayer)) return lastPlayer;

    if (this.hasWonInStraightLines(lastPlayer)) return lastPlayer;
    else return null;
  }

  private getLastPlayer() {
    return this.players[(this.movesCount - 1) % 2];
  }

  private hasWonInStraightLines(lastPlayer: PlayerChar) {
    let hasWon = false;
    for (let x = 0; x < 3; x++) {
      if (
        (this.board[x][0] == lastPlayer &&
          this.board[x][1] == lastPlayer &&
          this.board[x][2] == lastPlayer) ||
        (this.board[0][x] == lastPlayer &&
          this.board[1][x] == lastPlayer &&
          this.board[2][x] == lastPlayer)
      ) {
        hasWon = true;
        break;
      }
    }
    return hasWon;
  }

  private hasWonDiagonally(lastPlayer: PlayerChar) {
    return (
      (this.board[1][1] == lastPlayer &&
        this.board[0][0] == lastPlayer &&
        this.board[2][2] == lastPlayer) ||
      (this.board[0][2] == lastPlayer && this.board[2][0] == lastPlayer)
    );
  }
}
