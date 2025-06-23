import { Component, inject, signal } from '@angular/core';
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../../../../core/services/post.service';
import { LikesModalComponent } from '../likes-modal/likes-modal.component';
import { CommentService } from '../../../../../core/services/comment.service';
import { LikeService } from '../../../../../core/services/like.service';
import { Comment } from '../../../../models/comment';
import { CommentComponent } from '../../../../../features/comment/comment.component';

@Component({
  selector: 'app-post-details-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LikesModalComponent, CommentComponent],
  templateUrl: './post-details-modal.component.html',
  styleUrls: ['./post-details-modal.component.css'],
})
export class PostDetailsModalComponent {
  private modalService = inject(ModalService);
  private postService = inject(PostService);
  private commentService = inject(CommentService);
  protected likeService = inject(LikeService);

  post = this.postService.selectedPost;
  comments = this.commentService.selectedComments();
  newCommentSignal = signal('');

  replyingToId: string | null = null;
  replyingToUsername: string | null = null;
  isModalOpen = this.modalService.isModalOpen(ModalType.PostDetails);


  closeModal() {
    this.modalService.closeModal(ModalType.PostDetails);
    this.postService.clearSelectedPost();
    this.commentService.clearComments();
  }

  onReplyClicked(commentId: string) {
    if (this.replyingToId === commentId) {
      this.replyingToId = null;
      this.replyingToUsername = null;
    } else {
      const comment = this.findCommentById(this.comments() || [], commentId);
      if (comment) {
        this.replyingToId = commentId;
        this.replyingToUsername = comment.author.name;
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
    if (this.newCommentSignal().trim() && currentPost) {
      this.commentService
        .addComment(currentPost.id, this.newCommentSignal(), this.replyingToId)
        .subscribe({
          next: (createdComment) => {
            // Only increment after successful creation
            this.postService.incrementCommentCount(currentPost.id);
            // this.cdr.detectChanges();
            this.commentService.refreshComments();
            this.newCommentSignal.set('');
            this.replyingToId = null;
            this.replyingToUsername = null;
          },
          error: (err) => {
            console.error('Failed to add comment', err);
          },
        });
    }
  }

  cancelReply() {
    this.replyingToId = null;
    this.replyingToUsername = null;
  }

  isCommentActive(commentId: string): boolean {
    return this.replyingToId === commentId;
  }

  onEnter(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    this.addComment();
  }

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }

  // FIXED: Simplified likes modal opening
  openLikesModal() {
    const currentPost = this.post();
    if (currentPost) {
      this.modalService.openModal(ModalType.LikesModal, {
        id: currentPost.id,
        type: 'post',
      });
    }
  }

  togglePostLike(): void {
    if (this.post()) {
      this.likeService.togglePostLike(this.post()!.id);
      this.postService.toggleLike(this.post()!.id);
    }
  }

  toggleCommentLike(commentId: string): void {
    this.likeService.toggleCommentLike(commentId);
    this.comments.update((comments) => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            likes: comment.likes + (comment.isLiked ? -1 : 1),
            isLiked: !comment.isLiked,
          };
        }
        if (comment.replies) {
          comment.replies = comment.replies.map((reply) => {
            if (reply.id === commentId) {
              return {
                ...reply,
                likes: reply.likes + (reply.isLiked ? -1 : 1),
                isLiked: !reply.isLiked,
              };
            }
            return reply;
          });
        }
        return comment;
      });
    });
  }

  openCommentLikes(commentId: string): void {
    this.modalService.openModal(ModalType.LikesModal, {
      id: commentId,
      type: 'comment',
    });
  }
}
