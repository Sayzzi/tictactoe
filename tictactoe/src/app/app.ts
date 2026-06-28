import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Play } from "./component/play/play";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Play],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tictactoe');
}
