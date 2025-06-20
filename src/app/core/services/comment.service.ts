// comment.service.ts
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment } from '../../shared/models/comment'; 
import { toObservable } from '@angular/core/rxjs-interop';
import { delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private commentsSignal = signal<Comment[]>([]);
  comments$ = toObservable(this.commentsSignal);

  // In a real app, call API here
  loadComments(postId: string): Observable<Comment[]> {
    // Simulate API call with delay
    return of(this.generateMockComments(postId)).pipe(
      delay(500),
      map((comments) => {
        this.commentsSignal.set(comments);
        return comments;
      })
    );
  }

  addComment(
    postId: string,
    content: string,
    parentId: string | null = null
  ): Observable<Comment> {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: {
        name: 'Current User',
        avatar: 'assets/images/default-avatar.png',
      },
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      parentId,
    };

    return of(newComment).pipe(
      delay(300),
      map((comment) => {
        if (parentId) {
          // Add as a reply
          this.addReplyToComment(parentId, comment);
        } else {
          // Add as a top-level comment
          this.commentsSignal.update((comments) => [comment, ...comments]);
        }
        return comment;
      })
    );
  }

  private addReplyToComment(parentId: string, reply: Comment) {
    const comments = [...this.commentsSignal()];
    const parentComment = this.findCommentById(comments, parentId);

    if (parentComment) {
      if (!parentComment.replies) {
        parentComment.replies = [];
      }
      parentComment.replies = [reply, ...parentComment.replies];
      this.commentsSignal.set(comments);
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

  private generateMockComments(postId: string): Comment[] {
    return [
      {
        id: '1',
        postId,
        author: {
          name: 'Alex Johnson',
          avatar: 'assets/images/avatar1.jpg',
        },
        content: 'This looks amazing! Where was this taken?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        likes: 3,
        replies: [
          {
            id: '2',
            postId,
            author: {
              name: 'Sarah Miller',
              avatar: 'assets/images/avatar2.jpg',
            },
            content: "I think it's the Blue Ridge Mountains",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            likes: 1,
            parentId: '1',
          },
          {
            id: '3',
            postId,
            author: {
              name: 'Mike Chen',
              avatar: 'assets/images/avatar3.jpg',
            },
            content: "Actually, I believe it's the Rockies",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            likes: 0,
            parentId: '1',
          },
        ],
      },
      {
        id: '4',
        postId,
        author: {
          name: 'Emily Wilson',
          avatar: 'assets/images/avatar4.jpg',
        },
        content: 'The colors in that sunset photo are incredible!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 5,
      },
    ];
  }

  clearComments() {
    this.commentsSignal.set([]);
  }
}
