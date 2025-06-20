import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../../../core/services/post.service';
import { LikesModalComponent } from '../likes-modal/likes-modal.component';
import { CommentService } from '../../../../../core/services/comment.service';
import { LikeService } from '../../../../../core/services/like.service';
import { Observable } from 'rxjs';
import { Post } from '../../../../models/post';

@Component({
  selector: 'app-post-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LikesModalComponent, AsyncPipe],
  templateUrl: './post-details-modal.component.html',
  styleUrls: ['./post-details-modal.component.css'],
})
export class PostDetailsModalComponent implements OnInit {
  private modalService = inject(ModalService);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  protected likeService = inject(LikeService);
  post$: Observable<Post | null> = this.postService.selectedPost$;
  post = signal<Post | null>(null);

  comments$ = this.commentService.comments$;
  newComment = '';

  private destroyReferance = inject(DestroyRef);

  isModalActive = computed(() => {
    return this.modalService
      .isModalOpen(ModalType.PostDetails)
      .subscribe((isOpen) => isOpen);
  });

  ngOnInit() {
    const subscription = this.post$.subscribe((post) => {
      this.post.set(post);
    });

    this.destroyReferance.onDestroy(() => subscription.unsubscribe());
  }

  closeModal() {
    this.modalService.closeModal(ModalType.PostDetails);
    this.postService.clearSelectedPost();
    this.commentService.clearComments();
  }

  addComment() {
    const currentPost = this.postService.selectedPost();
    if (this.newComment.trim() && currentPost) {
      this.commentService.addComment(currentPost.id, this.newComment);
      this.newComment = '';
    }
  }

  openLikesModal() {
    const currentPost = this.postService.selectedPost();
    if (currentPost) {
      this.modalService.openModal(ModalType.LikesModal, currentPost.id);
    }
  }
}
