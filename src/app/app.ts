import { Component, signal, inject } from '@angular/core';
import { Home } from './pages/home/home';
import { Theme } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [Home],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ott-releases');

  constructor() {
    // Initialize theme service to set up dark mode
    inject(Theme);
  }
}
