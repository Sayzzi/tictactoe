import { Component } from '@angular/core';
import { NgClass } from '@angular/common'; 

@Component({
  selector: 'app-play',
  imports: [NgClass],
  templateUrl: './play.html',
  styleUrl: './play.css',
})
export class Play {
  board: string[] = Array(9).fill('');

}



