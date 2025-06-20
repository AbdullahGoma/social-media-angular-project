import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Like } from '../../shared/models/like';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private likes = new BehaviorSubject<Like[]>([]);
  likes$ = this.likes.asObservable();

  loadLikes(postId: string) {
    const mockLikes: Like[] = [
      {
        id: '1',
        postId,
        userId: 'user1',
        userName: 'Sarah Miller',
        userAvatar: 'https://example.com/avatar1.jpg',
        timestamp: '2 hours ago',
      },
      {
        id: '2',
        postId,
        userId: 'user2',
        userName: 'Michael Chen',
        userAvatar: 'https://example.com/avatar2.jpg',
        timestamp: '4 hours ago',
      },
    ];
    this.likes.next(mockLikes);
  }

  toggleLike(postId: string) {
    // Implement like toggle logic
    console.log(`Toggling like for post ${postId}`);
  }

  toggleCommentLike(commentId: string) {
    // Implement comment like toggle logic
    console.log(`Toggling like for comment ${commentId}`);
  }

  clearLikes() {
    this.likes.next([]);
  }
}
