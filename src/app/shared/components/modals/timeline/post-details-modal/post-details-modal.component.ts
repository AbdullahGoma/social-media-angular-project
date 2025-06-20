import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../../../core/services/post.service';
import { LikesModalComponent } from '../likes-modal/likes-modal.component';
import { CommentService } from '../../../../../core/services/comment.service';
import { LikeService } from '../../../../../core/services/like.service';
import { Observable } from 'rxjs';
import { Post } from '../../../../models/post';
import { Comment } from '../../../../models/comment';
import { CommentComponent } from '../../../../../features/comment/comment.component';
@Component({
  selector: 'app-post-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LikesModalComponent, CommentComponent],
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
  comments = signal<Comment[] | null>(null);
  newComment = '';

  replyingToId: string | null = null;
  replyingToUsername: string | null = null;

  private destroyReferance = inject(DestroyRef);

  isModalActive = computed(() => {
    return this.modalService
      .isModalOpen(ModalType.PostDetails)
      .subscribe((isOpen) => isOpen);
  });

  ngOnInit() {
    const subscription = this.post$.subscribe((post) => {
      this.post.set(post);

      if (post) {
        this.loadCommentsForPost(post.id);
      }
    });

    const subscriptionComments = this.comments$.subscribe((comments) => {
      this.comments.set(comments);
    });

    this.destroyReferance.onDestroy(() => {
      subscription.unsubscribe();
      subscriptionComments.unsubscribe();
    });
  }

  private loadCommentsForPost(postId: string) {
    this.commentService.loadComments(postId).subscribe({
      next: (comments) => {
        // Comments are already set in the service
      },
      error: (err) => {
        console.error('Failed to load comments:', err);
      },
    });
  }

  closeModal() {
    this.modalService.closeModal(ModalType.PostDetails);
    this.postService.clearSelectedPost();
    this.commentService.clearComments();
  }

  onReplyClicked(commentId: string) {
    if (this.replyingToId === commentId) {
      // Clicking reply again cancels the reply
      this.replyingToId = null;
      this.replyingToUsername = null;
    } else {
      // Find the comment to get the username
      const comment = this.findCommentById(this.comments() || [], commentId);
      if (comment) {
        this.replyingToId = commentId;
        this.replyingToUsername = comment.author.name;
        // Scroll to the comment input
        setTimeout(() => {
          const input = document.querySelector(
            '.comment-box__reply-input'
          ) as HTMLTextAreaElement;
          input?.focus();
        }, 100);
      }
    }
  }

  private findCommentById(
    comments: Comment[],
    id: string
  ): Comment | undefined {
    for (const comment of comments) {
      if (comment.id === id) return comment;
      if (comment.replies) {
        const found = this.findCommentById(comment.replies, id);
        if (found) return found;
      }
    }
    return undefined;
  }

  addComment() {
    const currentPost = this.postService.selectedPost();
    if (this.newComment.trim() && currentPost) {
      this.commentService
        .addComment(currentPost.id, this.newComment, this.replyingToId)
        .subscribe(() => {
          this.newComment = '';
          this.replyingToId = null;
          this.replyingToUsername = null;
        });
    }
  }

  cancelReply() {
    this.replyingToId = null;
    this.replyingToUsername = null;
  }

  // Helper method to check if a comment is active
  isCommentActive(commentId: string): boolean {
    return this.replyingToId === commentId;
  }

  openLikesModal() {
    const currentPost = this.postService.selectedPost();
    if (currentPost) {
      this.modalService.openModal(ModalType.LikesModal, currentPost.id);
    }
  }
}
