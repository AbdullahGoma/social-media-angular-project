import { Component, inject, Input } from '@angular/core';
import { ModalType } from '../../models/modal-type';
import { ModalService } from '../../../core/services/modal.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-post-box',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './create-post-box.component.html',
  styleUrl: './create-post-box.component.css',
})
export class CreatePostBoxComponent {
  private modalService = inject(ModalService);
  @Input() userId: number = 1;
  @Input() type: 'timeline' | 'feed' = 'timeline';

  openAddPostModal() {
    this.modalService.openModal(ModalType.AddPost, {
      type: this.type,
      onSubmit: (postData: any) => this.handlePostSubmit(postData),
    });
  }

  private handlePostSubmit(postData: any) {
    // This will be handled by the AddPostModalComponent
  }
}
