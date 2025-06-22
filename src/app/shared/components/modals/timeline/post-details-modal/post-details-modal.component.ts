import { Component, DestroyRef, inject } from '@angular/core';
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
  commentsSignal = this.commentService.selectedComments;
  comments = this.commentService.selectedComments();
  newComment = '';

  replyingToId: string | null = null;
  replyingToUsername: string | null = null;

  private destroyRef = inject(DestroyRef);
  isModalOpen = this.modalService.isModalOpen(ModalType.PostDetails);

  private loadCommentsForPost(postId: string) {
    this.commentService.loadComments(postId).subscribe({
      next: (comments) => {
        // Comments are automatically updated via the comments$ subscription
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
      this.replyingToId = null;
      this.replyingToUsername = null;
    } else {
      const comment = this.findCommentById(this.comments || [], commentId);
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

  isCommentActive(commentId: string): boolean {
    return this.replyingToId === commentId;
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
    this.commentsSignal.update((comments) => {
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
