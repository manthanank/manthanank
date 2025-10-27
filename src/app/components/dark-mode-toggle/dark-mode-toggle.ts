import { Component, inject } from '@angular/core';
import { Theme } from '../../services/theme.service';

@Component({
  selector: 'app-dark-mode-toggle',
  imports: [],
  templateUrl: './dark-mode-toggle.html',
  styleUrl: './dark-mode-toggle.scss'
})
export class DarkModeToggle {
  protected readonly themeService = inject(Theme);
}
