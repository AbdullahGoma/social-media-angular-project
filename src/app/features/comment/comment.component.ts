import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Comment } from '../../shared/models/comment';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  @Input() isActive= false;
  @Output() replyClicked = new EventEmitter<string>();
  
  onReplyClick() {
    this.replyClicked.emit(this.comment.id);
  }
}
