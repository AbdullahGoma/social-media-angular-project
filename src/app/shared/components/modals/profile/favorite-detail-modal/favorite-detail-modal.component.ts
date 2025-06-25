import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { Favorite } from '../../../../models/user';

@Component({
  selector: 'app-favorite-detail-modal',
  standalone: true,
  imports: [],
  templateUrl: './favorite-detail-modal.component.html',
  styleUrl: './favorite-detail-modal.component.css',
})
export class FavoriteDetailModalComponent {
  private modalService = inject(ModalService);

  isModalOpen = this.modalService.isModalOpen(ModalType.FavoriteDetail);
  favorite = this.modalService.getModalData<Favorite>(ModalType.FavoriteDetail);

  closeModal() {
    this.modalService.closeModal(ModalType.FavoriteDetail);
  }

  downloadImage() {
    const fav = this.favorite();
    if (fav) {
      const link = document.createElement('a');
      link.href = fav.imageUrl;
      link.download = `favorite-${fav.id}-${Date.now()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
