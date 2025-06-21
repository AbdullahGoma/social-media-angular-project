import { Component, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';
import { ModalType } from '../../../shared/models/modal-type';
import { AddPostModalComponent } from '../../../shared/components/modals/timeline/add-post-modal/add-post-modal.component';
import { PostService } from '../../../core/services/post.service';
import { ImagePreviewModalComponent } from '../../../shared/components/modals/settings/image-preview-modal/image-preview-modal.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { PostDetailsModalComponent } from "../../../shared/components/modals/timeline/post-details-modal/post-details-modal.component";
import { StoriesComponent } from "../../stories/stories.component";
import { StoryViewerModalComponent } from "../../../shared/components/modals/timeline/story-viewer-modal/story-viewer-modal.component";
import { StoryTypeModalComponent } from "../../../shared/components/modals/timeline/story-type-modal/story-type-modal.component";
import { TextEditorModalComponent } from "../../../shared/components/modals/timeline/text-editor-modal/text-editor-modal.component";

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [
    AddPostModalComponent,
    ImagePreviewModalComponent,
    PostDetailsModalComponent,
    StoriesComponent,
    StoryViewerModalComponent,
    StoryTypeModalComponent,
    TextEditorModalComponent
],
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.css',
})
export class TimelinePageComponent {
  private postService = inject(PostService);
  private modalService = inject(ModalService);

  posts = toSignal(this.postService.posts$, { initialValue: [] });

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

  openPostDetails(postId: string) {
    this.postService.selectPost(postId);
    this.modalService.openModal(ModalType.PostDetails, postId); // Pass postId as data
  }

  /**
   * Toggle like on a post
   * @param postId The ID of the post to like/unlike
   */
  togglePostLike(postId: string): void {
    this.postService.toggleLike(postId);
  }
}
