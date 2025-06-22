import { Component, input } from '@angular/core';
import { Post } from '../../models/post';
import { PostService } from '../../../core/services/post.service';
import { ModalService } from '../../../core/services/modal.service';
import { ModalType } from '../../models/modal-type';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.css',
})
export class PostsListComponent {
  posts = input<Post[]>();

  constructor(
    private postService: PostService,
    private modalService: ModalService
  ) {}

  toggleExpand(postId: string) {
    this.postService.toggleExpand(postId);
  }

  shouldShowSeeMore(content: string): boolean {
    const approxCharsPerLine = 100;
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
    this.modalService.openModal(ModalType.PostDetails, postId);
  }

  togglePostLike(postId: string): void {
    this.postService.toggleLike(postId);
  }
}
