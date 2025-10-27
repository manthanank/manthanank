import { Injectable, signal, computed, effect } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';

export interface OttRelease {
  title: string;
  platform: string;
  genre: string;
  release_date: string;
}

export interface FilterOptions {
  platforms: string[];
  genres: string[];
  dateRange: {
    start: string;
    end: string;
  } | null;
  searchTerm: string;
}

export interface OttResponse {
  timeframe: string;
  total: number;
  count: number;
  offset?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  releases: OttRelease[];
}

@Injectable({
  providedIn: 'root',
})
export class Ott {
  private apiUrl = environment.apiUrl;

  // Signal for the selected timeframe
  private timeframe = signal<'week' | 'month'>('week');

  // Signals for state management
  releases = signal<OttRelease[]>([]);
  releaseCount = signal<number>(0);
  totalCount = signal<number>(0);
  offset = signal<number>(0);
  limit = signal<number>(20);
  sortBy = signal<'release_date' | 'title' | 'platform' | 'genre'>('release_date');
  order = signal<'asc' | 'desc'>('asc');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Filter signals
  filters = signal<FilterOptions>({
    platforms: [],
    genres: [],
    dateRange: null,
    searchTerm: ''
  });
  allReleases = signal<OttRelease[]>([]);

  // Computed signal for the current timeframe (read-only access)
  currentTimeframe = computed(() => this.timeframe());

  // Computed signals for filter options
  availablePlatforms = computed(() => {
    const platforms = new Set(this.allReleases().map(release => release.platform));
    return Array.from(platforms).sort();
  });

  availableGenres = computed(() => {
    const genres = new Set(this.allReleases().map(release => release.genre));
    return Array.from(genres).sort();
  });

  // Check if any filters are active
  hasActiveFilters = computed(() => {
    const currentFilters = this.filters();
    return (
      currentFilters.platforms.length > 0 ||
      currentFilters.genres.length > 0 ||
      currentFilters.dateRange !== null ||
      currentFilters.searchTerm.trim() !== ''
    );
  });

  // Computed signal for filtered and sorted releases
  filteredReleases = computed(() => {
    const allReleases = this.allReleases();
    const currentFilters = this.filters();
    const currentSortBy = this.sortBy();
    const currentOrder = this.order();

    let filtered = [...allReleases];

    // Filter by platforms
    if (currentFilters.platforms.length > 0) {
      filtered = filtered.filter(release =>
        currentFilters.platforms.includes(release.platform)
      );
    }

    // Filter by genres
    if (currentFilters.genres.length > 0) {
      filtered = filtered.filter(release =>
        currentFilters.genres.includes(release.genre)
      );
    }

    // Filter by date range
    if (currentFilters.dateRange) {
      const startDate = new Date(currentFilters.dateRange.start);
      const endDate = new Date(currentFilters.dateRange.end);
      filtered = filtered.filter(release => {
        const releaseDate = new Date(release.release_date);
        return releaseDate >= startDate && releaseDate <= endDate;
      });
    }

    // Filter by search term
    if (currentFilters.searchTerm.trim()) {
      const searchTerm = currentFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(release =>
        release.title.toLowerCase().includes(searchTerm) ||
        release.platform.toLowerCase().includes(searchTerm) ||
        release.genre.toLowerCase().includes(searchTerm)
      );
    }

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: any = a[currentSortBy];
      let bValue: any = b[currentSortBy];

      // Handle date sorting
      if (currentSortBy === 'release_date') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        // Handle string sorting (case-insensitive)
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }

      if (aValue < bValue) return currentOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return currentOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  });

  // Computed signal for paginated releases (for display)
  paginatedReleases = computed(() => {
    const filtered = this.filteredReleases();
    const currentOffset = this.offset();
    const currentLimit = this.limit();

    // If filters are active, do client-side pagination
    if (this.hasActiveFilters()) {
      return filtered.slice(currentOffset, currentOffset + currentLimit);
    }

    // If no filters, return server-paginated results
    return this.releases();
  });

  constructor(private http: HttpClient) {
    // Effect to automatically fetch data when timeframe changes
    effect(() => {
      const currentTimeframe = this.timeframe();
      this.fetchReleases(currentTimeframe);
    });
  }

  private fetchReleases(timeframe: 'week' | 'month', append: boolean = false): void {
    this.isLoading.set(true);
    this.error.set(null);

    const params = new URLSearchParams({
      timeframe,
      limit: String(this.limit()),
      offset: String(this.offset()),
      sortBy: this.sortBy(),
      order: this.order(),
    });

    this.http.get<OttResponse>(
      `${this.apiUrl}/releases?${params.toString()}`
    ).pipe(
      catchError((error) => {
        this.error.set('Failed to fetch releases');
        this.isLoading.set(false);

        return of({ timeframe, total: 0, count: 0, releases: [], offset: this.offset(), limit: this.limit(), sortBy: this.sortBy(), order: this.order() });
      })
    ).subscribe((response) => {
      if (append) {
        this.releases.set([...this.releases(), ...response.releases]);
        this.allReleases.set([...this.allReleases(), ...response.releases]);
      } else {
        this.releases.set(response.releases);
        this.allReleases.set(response.releases);
      }
      this.releaseCount.set(response.count);
      this.totalCount.set(response.total || 0);
      if (typeof response.offset === 'number') this.offset.set(response.offset);
      if (typeof response.limit === 'number') this.limit.set(response.limit);
      this.isLoading.set(false);
      this.error.set(null);
    });
  }

  // Method to change timeframe (reactive)
  setTimeframe(timeframe: 'week' | 'month'): void {
    this.offset.set(0);
    this.timeframe.set(timeframe);
    // Note: fetchReleases is automatically called by the effect() in constructor
  }

  // Legacy method for backward compatibility (if needed)
  getReleases(timeframe: 'week' | 'month'): Observable<OttResponse> {
    this.isLoading.set(true);
    this.error.set(null);

    const params = new URLSearchParams({
      timeframe,
      limit: String(this.limit()),
      offset: String(this.offset()),
      sortBy: this.sortBy(),
      order: this.order(),
    });

    return this.http.get<OttResponse>(
      `${this.apiUrl}/releases?${params.toString()}`
    ).pipe(
      catchError((error) => {
        this.error.set('Failed to fetch releases');
        this.isLoading.set(false);

        return of({ timeframe, total: 0, count: 0, releases: [], offset: this.offset(), limit: this.limit(), sortBy: this.sortBy(), order: this.order() });
      })
    );
  }

  loadMore(): void {
    this.offset.set(this.offset() + this.limit());
    this.fetchReleases(this.timeframe(), true);
  }

  setSort(sortBy: 'release_date' | 'title' | 'platform' | 'genre', order: 'asc' | 'desc' = 'asc'): void {
    this.sortBy.set(sortBy);
    this.order.set(order);
    // No need to fetch from API since sorting is now handled client-side
    // The filteredReleases computed signal will automatically update
  }

  // Filter methods
  setFilters(filters: Partial<FilterOptions>): void {
    this.filters.update(current => ({ ...current, ...filters }));
  }

  setPlatformFilter(platforms: string[]): void {
    this.filters.update(current => ({ ...current, platforms }));
  }

  setGenreFilter(genres: string[]): void {
    this.filters.update(current => ({ ...current, genres }));
  }

  setDateRangeFilter(start: string, end: string): void {
    this.filters.update(current => ({
      ...current,
      dateRange: { start, end }
    }));
  }

  setSearchTerm(searchTerm: string): void {
    this.filters.update(current => ({ ...current, searchTerm }));
  }

  clearFilters(): void {
    this.filters.set({
      platforms: [],
      genres: [],
      dateRange: null,
      searchTerm: ''
    });
  }

  clearAllData(): void {
    this.releases.set([]);
    this.allReleases.set([]);
    this.offset.set(0);
    this.clearFilters();
  }

  // Limit and pagination methods
  setLimit(newLimit: number): void {
    this.limit.set(newLimit);
    this.offset.set(0); // Reset to first page when changing limit

    // If no filters are active, fetch from server
    if (!this.hasActiveFilters()) {
      this.fetchReleases(this.timeframe(), false);
    }
  }

  goToPage(page: number): void {
    const newOffset = (page - 1) * this.limit();
    this.offset.set(newOffset);

    // If no filters are active, fetch from server
    if (!this.hasActiveFilters()) {
      this.fetchReleases(this.timeframe(), false);
    }
  }

  getCurrentPage(): number {
    return Math.floor(this.offset() / this.limit()) + 1;
  }

  getTotalPages(): number {
    // Always use server total count for now
    return Math.ceil(this.totalCount() / this.limit());
  }

  getDisplayCount(): number {
    // Always return the total count from server for now
    return this.totalCount();
  }

  hasNextPage(): boolean {
    // If filters are active, check filtered results
    if (this.hasActiveFilters()) {
      return this.offset() + this.limit() < this.filteredReleases().length;
    }
    // Otherwise check server pagination
    return this.offset() + this.limit() < this.totalCount();
  }

  hasPreviousPage(): boolean {
    return this.offset() > 0;
  }
}
