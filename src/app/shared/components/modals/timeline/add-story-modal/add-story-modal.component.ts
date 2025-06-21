import { Component, inject } from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';

@Component({
  selector: 'app-add-story-modal',
  standalone: true,
  templateUrl: './add-story-modal.component.html',
  styleUrls: ['./add-story-modal.component.css'],
})
export class AddStoryModalComponent {
  private modalService = inject(ModalService);

  openStoryTypeModal() {
    this.modalService.openModal(ModalType.StoryType);
  }

  close() {
    this.modalService.closeModal(ModalType.AddStory);
  }
}
