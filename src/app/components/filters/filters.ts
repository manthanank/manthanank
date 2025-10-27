import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ott, FilterOptions } from '../../services/ott';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-filters',
  imports: [FormsModule, NgClass],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  ott = inject(Ott);

  // Signals from service
  filters = this.ott.filters;
  availablePlatforms = this.ott.availablePlatforms;
  availableGenres = this.ott.availableGenres;
  filteredReleases = this.ott.filteredReleases;
  paginatedReleases = this.ott.paginatedReleases;

  // Local state
  isExpanded = signal(false);
  searchTerm = signal('');

  // Filter methods
  togglePlatform(platform: string): void {
    const currentPlatforms = this.filters().platforms;
    const updatedPlatforms = currentPlatforms.includes(platform)
      ? currentPlatforms.filter(p => p !== platform)
      : [...currentPlatforms, platform];

    this.ott.setPlatformFilter(updatedPlatforms);
  }

  toggleGenre(genre: string): void {
    const currentGenres = this.filters().genres;
    const updatedGenres = currentGenres.includes(genre)
      ? currentGenres.filter(g => g !== genre)
      : [...currentGenres, genre];

    this.ott.setGenreFilter(updatedGenres);
  }

  onSearchChange(): void {
    this.ott.setSearchTerm(this.searchTerm());
  }

  setDateRange(start: string, end: string): void {
    if (start && end) {
      this.ott.setDateRangeFilter(start, end);
    } else {
      this.ott.setFilters({ dateRange: null });
    }
  }

  clearFilters(): void {
    this.ott.clearFilters();
    this.searchTerm.set('');
  }

  toggleExpanded(): void {
    this.isExpanded.update(expanded => !expanded);
  }

  getFilterCount(): number {
    const currentFilters = this.filters();
    let count = 0;

    if (currentFilters.platforms.length > 0) count++;
    if (currentFilters.genres.length > 0) count++;
    if (currentFilters.dateRange) count++;
    if (currentFilters.searchTerm.trim()) count++;

    return count;
  }
}
