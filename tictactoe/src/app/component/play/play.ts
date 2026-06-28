import { Component, computed, inject, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Game } from '../../services/game';

@Component({
  selector: 'app-play',
  imports: [NgClass],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play {


  //Injecting the game service
  private game = inject(Game)

  //reading the values from the service
  board = this.game.board
  size = this.game.size
  gameStarted = this.game.gameStarted
  winner = this.game.winner
  isDraw = this.game.isDraw
  isComputerThinking = this.game.isComputerThinking


  //Now we call the game through the service
  chooseSymbol(symbol: 'X' | 'O') { this.game.chooseSymbol(symbol) }
  play(index: number) { this.game.play(index) }
  reset() { this.game.reset() }


}



