import { Component, inject } from '@angular/core';
import { ModalService } from '../../../core/services/modal.service';
import { ModalType } from '../../../shared/models/modal-type';
import { PostService } from '../../../core/services/post.service';
import { StoriesComponent } from '../../../shared/components/stories/stories.component';
import { StoryViewerModalComponent } from '../../../shared/components/modals/timeline/story-viewer-modal/story-viewer-modal.component';
import { CreatePostBoxComponent } from '../../../shared/components/create-post-box/create-post-box.component';
import { PostsListComponent } from '../../../shared/components/posts-list/posts-list.component';

@Component({
  selector: 'app-timeline-page',
  standalone: true,
  imports: [
    StoriesComponent,
    StoryViewerModalComponent,
    CreatePostBoxComponent,
    PostsListComponent,
  ],
  templateUrl: './timeline-page.component.html',
  styleUrl: './timeline-page.component.css',
})
export class TimelinePageComponent {
  private postService = inject(PostService);
  private modalService = inject(ModalService);

  posts = this.postService.timelinePosts;

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }
}
