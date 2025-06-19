import { Component, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';
import { ModalType } from '../../../shared/models/modal-type';
import { AddPostModalComponent } from "../../../shared/components/modals/timeline/add-post-modal/add-post-modal.component";

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [AddPostModalComponent],
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.css',
})
export class TimelinePageComponent {
  private modalService = inject(ModalService);

  openPostModal() {
    this.modalService.openModal(ModalType.AddPost);
  }
}
