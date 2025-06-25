import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../core/services/modal.service';
import { ModalType } from '../../../../shared/models/modal-type';

@Component({
  selector: 'app-photos-tab',
  standalone: true,
  imports: [],
  templateUrl: './photos-tab.component.html',
  styleUrl: './photos-tab.component.css',
})
export class PhotosTabComponent {
  private modalService = inject(ModalService);

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }
}
