import { Component, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-play',
  imports: [NgClass],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play {


  // Creating signals, for board, player,  computer
  size = signal(4)
  board = signal<string[]>(this.emptyBoard())
  isComputerThinking = signal<boolean>(false)
  gameStarted = signal<boolean>(false)



  //Symbol, computer symbol depends on the human one
  humanSymbol = signal<'X' | 'O' | null>(null)

  computerSymbol = computed<'X' | 'O' | null>(() => {
    const human = this.humanSymbol();
    if (human === null) return null;
    return human === 'X' ? 'O' : 'X';
  });

  chooseSymbol(symbol: 'X' | 'O') {
    this.humanSymbol.set(symbol)
    this.gameStarted.set(true)

    //X always start in tic tac toe
    if (this.computerSymbol() === 'X') this.triggerComputer();

  }


  //Game draw
  isDraw = computed<boolean>(() => {
    return this.emptyCells().length === 0 && this.winner() === null;
  });



  winner = computed<string | null>(() => {

    //reading the board & getting the winning lines
    const board = this.board()
    const lines = this.getWinningLines(this.size())

    //Finding the winning line, and return it 
    const winningLine = lines.find(line => {
      const first = board[line[0]];        // get the symbol
      return first !== '' && line.every(i => board[i] === first); //check if each lines, contain the same symbol
    });
    //Give us who win the game
    return winningLine ? board[winningLine[0]] : null;
  });


  play(index: number) {
    //Check if win or not empty cell
    if (this.board()[index] !== '' || this.winner() !== null || this.isComputerThinking()) {
      return
    }

    //Update the cell of the board
    this.board.update(cells => {
      //create new array, so the signal detect it
      const copy = [...cells]
      copy[index] = this.humanSymbol()!
      return copy
    })
    //Computer play, with timeout (fake thinking)
    this.triggerComputer();


  }

  //Get only empty cells for the computer
  emptyCells = computed(() =>
    this.board()
      .map((value, index) => value === '' ? index : -1)
      .filter(index => index !== -1)
  )

  //The computer play
  computerPlay() {
    const cells = this.emptyCells();
    if (cells.length === 0) return;
    const random = Math.floor(Math.random() * cells.length)
    const chosenCell = cells[random]
    this.board.update(currentBoard => {
      //create new array, so the signal detect it
      const copy = [...currentBoard]
      copy[chosenCell] = this.computerSymbol()!
      return copy
    })

  }

  //Replay the game
  reset() {
    this.board.set(this.emptyBoard());
    this.gameStarted.set(false)
    this.isComputerThinking.set(false)
    this.humanSymbol.set(null)

  }

  //Calculating winning lines
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



  // HELPERS

  //Computer play
  private triggerComputer() {
    if (this.winner() !== null) return;
    this.isComputerThinking.set(true);
    setTimeout(() => {
      this.computerPlay();
      this.isComputerThinking.set(false);
    }, 500);
  }

  //init the borad
  private emptyBoard() { return Array(this.size() * this.size()).fill(''); }


}



