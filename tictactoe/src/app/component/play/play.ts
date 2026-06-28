import { Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-play',
  imports: [],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play {


  // Creating signals, for board, player 
  board = signal<string[]>(Array(9).fill(''))
  currentPlayer = signal<'X' | 'O'>('X')


  winner = computed<string | null>(() => {

    //reading the board
    const board = this.board()

    const win = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ]

    //Finding the winning line, and return it 
    const winningLine = win.find(([a, b, c])=>
    board[a] !== '' && board[a] === board[b] && board[a] === board[c]
    );
    //Give us who win the game
    return winningLine ? board[winningLine[0]] : null;
  });

}



