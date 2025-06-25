import { Component, computed, inject } from '@angular/core';
import { FavoriteService } from '../../../../core/services/favorites.service';
import { ModalService } from '../../../../core/services/modal.service';
import { ModalType } from '../../../../shared/models/modal-type';
import { Favorite } from '../../../../shared/models/user';
import { FavoriteDetailModalComponent } from "../../../../shared/components/modals/profile/favorite-detail-modal/favorite-detail-modal.component";

@Component({
  selector: 'app-favs-tab',
  standalone: true,
  imports: [FavoriteDetailModalComponent],
  templateUrl: './favs-tab.component.html',
  styleUrl: './favs-tab.component.css',
})
export class FavsTabComponent {
  private favoriteService = inject(FavoriteService);
  private modalService = inject(ModalService);

  // Expose signals from the service
  favorites = this.favoriteService.paginatedFavorites;
  searchTerm = this.favoriteService.setSearchTerm;
  currentPage = this.favoriteService.currentPage;
  totalPages = this.favoriteService.totalPages;

  // Computed count of favorites
  favoritesCount = computed(
    () => `${this.favoriteService.filteredFavorites().length} items`
  );

  openFavoriteDetail(favorite: Favorite) {
    this.modalService.openModal(ModalType.FavoriteDetail, favorite);
  }

  setPage(page: number) {
    this.favoriteService.setPage(page);
  }

  nextPage() {
    this.favoriteService.nextPage();
  }

  prevPage() {
    this.favoriteService.prevPage();
  }

  onSearchInput(event: Event) {
    const term = (event.target as HTMLInputElement).value;
    this.favoriteService.setSearchTerm(term);
  }

  downloadImage(imageUrl: string, event: Event) {
    event.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `favorite-${Date.now()}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  removeFavorite(id: string, event: Event) {
    event.stopPropagation();
    
    this.modalService.openModal(ModalType.Confiramation, {
      message: 'Are you sure you want to remove this favorite?',
      action: () => {
        this.favoriteService.removeFavorite(id);
      },
    });
  }
}
