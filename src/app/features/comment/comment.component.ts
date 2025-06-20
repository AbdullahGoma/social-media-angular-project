import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../../shared/models/comment';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LikeService } from '../../core/services/like.service';
import { ModalService } from '../../core/services/modal.service';
import { ModalType } from '../../shared/models/modal-type';

@Component({
  selector: 'app-comment',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './comment.component.html',
  styleUrl: './comment.component.css',
})
export class CommentComponent {
  @Input() comment!: Comment;
  @Input() isReply = false;
  @Input() isActive = false;
  @Output() replyClicked = new EventEmitter<string>();

  constructor(
    private likeService: LikeService,
    private modalService: ModalService
  ) {}

  onReplyClick() {
    this.replyClicked.emit(this.comment.id);
  }

  toggleLike(): void {
    this.likeService.toggleCommentLike(this.comment.id);
    // Update local state
    this.comment.likes += this.comment.isLiked ? -1 : 1;
    this.comment.isLiked = !this.comment.isLiked;
  }

  openLikes(): void {
    this.modalService.openModal(ModalType.LikesModal, {
      id: this.comment.id,
      type: 'comment',
    });
  }
}
