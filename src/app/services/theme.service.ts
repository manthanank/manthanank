import { Injectable, signal, computed, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Theme {
  private readonly THEME_KEY = 'ott-releases-theme';

  // Signal to track dark mode state
  private readonly isDarkMode = signal<boolean>(this.getInitialTheme());

  // Computed property for the current theme
  readonly currentTheme = computed(() => this.isDarkMode() ? 'dark' : 'light');

  constructor() {
    // Effect to persist theme changes and update document class
    effect(() => {
      const isDark = this.isDarkMode();
      this.updateDocumentClass(isDark);
      this.persistTheme(isDark);
    });
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    this.isDarkMode.update(current => !current);
  }

  /**
   * Set specific theme
   */
  setTheme(isDark: boolean): void {
    this.isDarkMode.set(isDark);
  }

  /**
   * Get current dark mode state
   */
  getDarkMode(): boolean {
    return this.isDarkMode();
  }

  /**
   * Get initial theme from localStorage or system preference
   */
  private getInitialTheme(): boolean {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    if (savedTheme) {
      return savedTheme === 'dark';
    }

    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  /**
   * Update document class for theme
   */
  private updateDocumentClass(isDark: boolean): void {
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }

  /**
   * Persist theme to localStorage
   */
  private persistTheme(isDark: boolean): void {
    localStorage.setItem(this.THEME_KEY, isDark ? 'dark' : 'light');
  }
}

