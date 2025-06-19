import { Component, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';
import { ModalType } from '../../../shared/models/modal-type';
import { AddPostModalComponent } from '../../../shared/components/modals/timeline/add-post-modal/add-post-modal.component';
import { PostService } from '../../../core/services/post.service';
import { ImagePreviewModalComponent } from "../../../shared/components/modals/settings/image-preview-modal/image-preview-modal.component";

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [AddPostModalComponent, ImagePreviewModalComponent],
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.css',
})
export class TimelinePageComponent {
  private postService = inject(PostService);
  private modalService = inject(ModalService);

  posts = this.postService.posts$;

  openPostModal() {
    this.modalService.openModal(ModalType.AddPost);
  }

  toggleExpand(postId: string) {
    this.postService.toggleExpand(postId);
  }

  shouldShowSeeMore(content: string): boolean {
    const approxCharsPerLine = 100; // Approximate characters per line

    // Simple character count estimation
    return content.length > approxCharsPerLine * 3;
  }

  getImageGridClass(images?: string[]): string {
    if (!images) return '';
    const count = images.length;
    if (count === 1) return 'single-image';
    if (count === 2) return 'two-images';
    if (count === 3) return 'three-images';
    return 'four-images';
  }

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }
}
