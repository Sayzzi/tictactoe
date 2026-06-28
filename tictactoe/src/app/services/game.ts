import { computed, Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Game {

  //private writable state, only service can change it 
  private _size = signal(3);
  private _board = signal<string[]>(this.emptyBoard());
  private _humanSymbol = signal<'X' | 'O' | null>(null);
  private _gameStarted = signal<boolean>(false);
  private _isComputerThinking = signal<boolean>(false);

  // read only, for the component
  readonly size = this._size.asReadonly();
  readonly board = this._board.asReadonly();
  readonly humanSymbol = this._humanSymbol.asReadonly();
  readonly gameStarted = this._gameStarted.asReadonly();
  readonly isComputerThinking = this._isComputerThinking.asReadonly();

  // helper
  private emptyBoard(): string[] {
    return Array(this._size() * this._size()).fill('');
  }

  //Computed, derived state & readonly
  //computer symbol
  readonly computerSymbol = computed<'X' | 'O' | null>(() => {
    const human = this._humanSymbol();
    if (human === null) return null;
    return human === 'X' ? 'O' : 'X';
  });

  //Get only empty cells for the computer
  readonly emptyCells = computed(() =>
    this._board()
      .map((value, index) => value === '' ? index : -1)
      .filter(index => index !== -1)
  );

  //Winning condition
  readonly winner = computed<string | null>(() => {
    const board = this._board();
    const lines = this.getWinningLines(this._size());
    const winningLine = lines.find(line => {
      const first = board[line[0]];
      return first !== '' && line.every(i => board[i] === first);
    });
    return winningLine ? board[winningLine[0]] : null;
  });

  //Game draw
  readonly isDraw = computed<boolean>(() =>
    this.emptyCells().length === 0 && this.winner() === null
  );


  // Methods

  chooseSymbol(symbol: 'X' | 'O') {
    this._humanSymbol.set(symbol);
    this._gameStarted.set(true);
    // //X always start in tic tac toe
    if (this.computerSymbol() === 'X') this.triggerComputer();
  }


  play(index: number) {
    if (this._board()[index] !== '' || this.winner() !== null || this._isComputerThinking()) {
      return;
    }
    this._board.update(cells => {
      //We create a new array called "copy", so the signal sees the change
      const copy = [...cells];
      copy[index] = this._humanSymbol()!;
      return copy;
    });
    this.triggerComputer();
  }


  //The computer play
  computerPlay() {
    const cells = this.emptyCells();
    if (cells.length === 0) return;
    const random = Math.floor(Math.random() * cells.length);
    const chosenCell = cells[random];
    this._board.update(currentBoard => {
      const copy = [...currentBoard];
      copy[chosenCell] = this.computerSymbol()!;
      return copy;
    });
  }

  //Replay the game
  reset() {
    this._board.set(this.emptyBoard());
    this._gameStarted.set(false);
    this._isComputerThinking.set(false);
    this._humanSymbol.set(null);
  }


  //Calculating winning lines from size value
  getWinningLines(size: number): number[][] {
    const lines: number[][] = [];
    //rows
    for (let r = 0; r < size; r++) {
      const row: number[] = [];
      for (let c = 0; c < size; c++) {
        row.push(r * size + c);
      }
      lines.push(row);
    }
    //columns
    for (let c = 0; c < size; c++) {
      const row: number[] = [];
      for (let r = 0; r < size; r++) {
        row.push(r * size + c);
      }
      lines.push(row);
    }

    // main diagonal
    const mainDiagonal: number[] = [];
    for (let r = 0; r < size; r++) {
      mainDiagonal.push(r * size + r);
    }
    lines.push(mainDiagonal);

    //anti diagonal
    const antiDiagonal: number[] = [];
    for (let r = 0; r < size; r++) {
      antiDiagonal.push(r * size + (size - 1 - r));
    }
    lines.push(antiDiagonal);

    return lines;
  }
  //Computer play
  private triggerComputer() {
    if (this.winner() !== null) return;
    this._isComputerThinking.set(true);
    setTimeout(() => {
      this.computerPlay();
      this._isComputerThinking.set(false);
    }, 500);
  }

}
