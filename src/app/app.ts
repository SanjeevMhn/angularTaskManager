import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Workboard } from "./components/workboard/workboard";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Workboard],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('task-manager');
}
