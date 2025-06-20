import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Comment } from '../../shared/models/comment';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private comments = new BehaviorSubject<Comment[]>([]);
  comments$ = this.comments.asObservable();

  loadComments(postId: string) {
    const mockComments: Comment[] = [
      {
        id: '1',
        postId,
        author: {
          name: 'Alex Johnson',
          avatar: 'https://example.com/avatar1.jpg',
        },
        content: 'This looks amazing! Where was this taken?',
        timestamp: '2 hours ago',
        likes: 3,
        replies: [
          {
            id: '2',
            postId,
            author: {
              name: 'Sarah Miller',
              avatar: 'https://example.com/avatar2.jpg',
            },
            content: "I think it's the Blue Ridge Mountains",
            timestamp: '1 hour ago',
            likes: 1,
          },
        ],
      },
    ];
    this.comments.next(mockComments);
  }

  addComment(postId: string, content: string) {
    const newComment: Comment = {
      id: Date.now().toString(),
      postId,
      author: {
        name: 'You',
        avatar: 'https://example.com/current-user.jpg',
      },
      content,
      timestamp: 'Just now',
      likes: 0,
    };
    this.comments.next([...this.comments.value, newComment]);
  }

  clearComments() {
    this.comments.next([]);
  }
}
