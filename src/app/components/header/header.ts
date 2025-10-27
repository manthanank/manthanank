import { Component } from '@angular/core';
import { DarkModeToggle } from '../dark-mode-toggle/dark-mode-toggle';

@Component({
  selector: 'app-header',
  imports: [DarkModeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {}
