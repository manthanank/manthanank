import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Ott } from '../../services/ott';
import { Track } from '../../services/track';
import { Header } from '../../components/header/header';
import { ReleaseCard } from '../../components/release-card/release-card';
import { Filters } from '../../components/filters/filters';
import { NgClass } from '@angular/common';
import { Visit } from '../../models/visit.model';

@Component({
  selector: 'app-home',
  imports: [Header, ReleaseCard, Filters, FormsModule, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  private ott = inject(Ott);
  private track = inject(Track);

  // Use signals from the service
  releases = this.ott.releases;
  filteredReleases = this.ott.filteredReleases;
  paginatedReleases = this.ott.paginatedReleases;
  releaseCount = this.ott.releaseCount;
  isLoading = this.ott.isLoading;
  error = this.ott.error;
  currentTimeframe = this.ott.currentTimeframe;
  totalCount = this.ott.totalCount;
  limit = this.ott.limit;
  offset = this.ott.offset;

  // Visitor count signals
  visitorCount = signal<number>(0);
  visitorCountLoading = signal<boolean>(false);
  visitorCountError = signal<string | null>(null);

  // Local UI state for sorting controls
  sortBy: 'release_date' | 'title' | 'platform' | 'genre' = 'release_date';
  order: 'asc' | 'desc' = 'asc';

  ngOnInit() {
    // The service automatically fetches data when initialized
    // No need for manual data fetching
    this.loadVisitorCount();
  }

  loadVisitorCount() {
    this.visitorCountLoading.set(true);
    this.visitorCountError.set(null);

    this.track.trackProjectVisit('ott-releases').subscribe({
      next: (visit: Visit) => {
        this.visitorCount.set(visit.uniqueVisitors);
        this.visitorCountLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load visitor count:', error);
        this.visitorCountError.set('Failed to load visitor count');
        this.visitorCountLoading.set(false);
      }
    });
  }

  changeTimeframe(tf: 'week' | 'month') {
    // Simply call the service method - signals will update automatically
    this.ott.setTimeframe(tf);
  }

  loadMore() {
    this.ott.loadMore();
  }

  applySort() {
    this.ott.setSort(this.sortBy, this.order);
  }

  // Limit and pagination methods
  changeLimit(newLimit: number) {
    this.ott.setLimit(newLimit);
  }

  onLimitChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    const newLimit = parseInt(target.value, 10);
    this.changeLimit(newLimit);
  }

  goToPage(page: number) {
    this.ott.goToPage(page);
  }

  getCurrentPage(): number {
    return this.ott.getCurrentPage();
  }

  getTotalPages(): number {
    return this.ott.getTotalPages();
  }

  getDisplayCount(): number {
    return this.ott.getDisplayCount();
  }

  hasNextPage(): boolean {
    return this.ott.hasNextPage();
  }

  hasPreviousPage(): boolean {
    return this.ott.hasPreviousPage();
  }

  // Helper methods for template
  Math = Math;
}
