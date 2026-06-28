import { Component, computed, signal } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-play',
  imports: [NgClass],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play {



  // Creating signals, for board, player & computer 
  board = signal<string[]>(Array(9).fill(''))
  currentPlayer = signal<'X' | 'O'>('X')
  isComputerThinking= signal<boolean>(false)


  winner = computed<string | null>(() => {

    //reading the board
    const board = this.board()

    const win = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ]

    //Finding the winning line, and return it 
    const winningLine = win.find(([a, b, c]) =>
      board[a] !== '' && board[a] === board[b] && board[a] === board[c]
    );
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
      copy[index] = this.currentPlayer()
      return copy
    })
    //Change the player
    this.currentPlayer.set(this.currentPlayer() === 'X' ? 'O' : 'X')

    //Computer play, with timeout (fake thinking)
    if(this.winner()===null){

      this.isComputerThinking.set(true);
      setTimeout(() => {
        this.computerPlay()
        this.isComputerThinking.set(false)
      }, 500);
    }


  }

  //Get only empty cells for the computer
  emptyCells = computed(() =>
    this.board()
      .map((value, index) => value === '' ? index : -1)
      .filter(index => index !== -1)
  )
  

  //The computer play

  computerPlay(){
    const cells = this.emptyCells();
    if (cells.length === 0) return;
    const random = Math.floor(Math.random() * cells.length)
    const chosenCell = cells[random]
    this.board.update(currentBoard => {
      //create new array, so the signal detect it
      const copy = [...currentBoard]
      copy[chosenCell] = this.currentPlayer()
      return copy
    })

     //Change the player (Actuel 2 player, instead of vs computer )
    if(this.winner() ===null){
    this.currentPlayer.set(this.currentPlayer() === 'X' ? 'O' : 'X')

    }

  }
  


}



