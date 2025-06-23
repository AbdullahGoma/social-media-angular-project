import { inject, Injectable, signal } from '@angular/core';
import { Favorite } from '../../shared/models/user';
import { LocalStorageService } from './localtorage.service';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'social-app-user-favorites';
  private localStorage = inject(LocalStorageService);

  private favoritesSignal = signal<Favorite[]>([]);
  favorites = this.favoritesSignal.asReadonly();

  constructor() {
    this.loadInitialFavorites();
  }

  private loadInitialFavorites() {
    const savedFavorites = this.localStorage.getItem<Favorite[]>(
      this.STORAGE_KEY
    );
    if (savedFavorites) {
      this.favoritesSignal.set(savedFavorites);
    } else {
      const defaultFavorites = this.generateDefaultFavorites();
      this.favoritesSignal.set(defaultFavorites);
      this.saveFavoritesToStorage();
    }
  }

  private saveFavoritesToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.favoritesSignal());
  }

  private generateDefaultFavorites(): Favorite[] {
    return [
      {
        userId: '1',
        type: 'post',
        itemId: '1',
        addedAt: new Date(),
      },
    ];
  }

  addFavorite(favorite: Omit<Favorite, 'addedAt'>) {
    if (
      this.favoritesSignal().some(
        (f) => f.type === favorite.type && f.itemId === favorite.itemId
      )
    )
      return;

    const newFavorite: Favorite = {
      ...favorite,
      addedAt: new Date(),
    };
    this.favoritesSignal.update((favorites) => [...favorites, newFavorite]);
    this.saveFavoritesToStorage();
  }

  removeFavorite(favorite: Omit<Favorite, 'addedAt'>) {
    this.favoritesSignal.update((favorites) =>
      favorites.filter(
        (f) => !(f.type === favorite.type && f.itemId === favorite.itemId)
      )
    );
    this.saveFavoritesToStorage();
  }

  isFavorite(favorite: Omit<Favorite, 'addedAt'>): boolean {
    return this.favoritesSignal().some(
      (f) => f.type === favorite.type && f.itemId === favorite.itemId
    );
  }
}
