import { computed, Injectable, signal } from '@angular/core';
import { Favorite } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})

export class FavoriteService {
  private favorites = signal<Favorite[]>([]);
  private searchTerm = signal<string>('');
  public currentPage = signal<number>(1);
  private itemsPerPage = 6; // Adjust based on your layout

  // Computed values
  filteredFavorites = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.favorites();

    return this.favorites().filter(
      (fav) =>
        fav.author.name.toLowerCase().includes(term) ||
        fav.type.toLowerCase().includes(term) ||
        fav.content?.toLowerCase().includes(term)
    );
  });

  paginatedFavorites = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    return this.filteredFavorites().slice(
      startIndex,
      startIndex + this.itemsPerPage
    );
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredFavorites().length / this.itemsPerPage)
  );

  constructor() {
    // Load initial data - in a real app, this would come from an API
    this.loadFavorites();
  }

  private loadFavorites() {
    // Mock data - replace with actual API call
    const mockFavorites: Favorite[] = [
      {
        id: '1',
        type: 'photo',
        author: {
          name: 'Jane Doe',
          avatar: 'assets/pic.jpg',
          link: '#',
        },
        date: '2 days ago',
        imageUrl: 'assets/pic.jpg',
      },
      // Add more mock favorites as needed
    ];
    this.favorites.set(mockFavorites);
  }

  addFavorite(favorite: Favorite) {
    this.favorites.update((favs) => [...favs, favorite]);
  }

  removeFavorite(id: string) {
    this.favorites.update((favs) => favs.filter((f) => f.id !== id));
  }

  setSearchTerm(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1); // Reset to first page when searching
  }

  setPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update((p) => p + 1);
    }
  }

  prevPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update((p) => p - 1);
    }
  }
}
