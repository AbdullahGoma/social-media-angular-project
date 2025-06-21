import { Component, EventEmitter, inject, Output } from '@angular/core';
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
  @Output() typeSelected = new EventEmitter<'image' | 'text' | 'image-text'>();

  isModalOpen = this.modalService.isModalOpen(ModalType.StoryType);

  selectType(type: 'image' | 'text' | 'image-text') {
    // Store the selected type in modal data
    this.modalService.setModalData(ModalType.StoryType, { type });

    if (type === 'text') {
      this.modalService.openModal(ModalType.TextEditor, { type });
      this.close();
    } else {
      // Emit the type to parent component
      this.typeSelected.emit(type);
      this.close();
    }
  }

  close() {
    this.modalService.closeModal(ModalType.StoryType);
  }
}
