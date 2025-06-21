import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';

@Component({
  selector: 'app-story-type-modal',
  standalone: true,
  templateUrl: './story-type-modal.component.html',
  styleUrls: ['./story-type-modal.component.css'],
})
export class StoryTypeModalComponent {
  private modalService = inject(ModalService);

  selectType(type: 'image' | 'text' | 'image-text') {
    if (type === 'text') {
      this.modalService.openModal(ModalType.TextEditor);
    } else {
      // Handle image or image-text
      document.getElementById('storyFileInput')?.click();
    }
    this.close();
  }

  close() {
    this.modalService.closeModal(ModalType.StoryType);
  }
}
