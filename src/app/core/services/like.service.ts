import { Injectable, signal } from '@angular/core';
import { Like } from '../../shared/models/like';
import { toObservable } from '@angular/core/rxjs-interop';
import { LocalStorageService } from './localtorage.service';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  private readonly POST_LIKES_KEY = 'social-app-post-likes';
  private readonly COMMENT_LIKES_KEY = 'social-app-comment-likes';

  // Store ALL likes, not filtered ones
  private allPostLikes = signal<Like[]>([]);
  private allCommentLikes = signal<Like[]>([]);

  // Public signals for current filtered likes
  public readonly postLikes = signal<Like[]>([]);
  public readonly commentLikes = signal<Like[]>([]);

  constructor(private localStorage: LocalStorageService) {
    this.loadInitialLikes();
  }

  private loadInitialLikes() {
    const savedPostLikes = this.localStorage.getItem<Like[]>(
      this.POST_LIKES_KEY
    );
    const savedCommentLikes = this.localStorage.getItem<Like[]>(
      this.COMMENT_LIKES_KEY
    );

    // Load ALL likes into storage signals
    this.allPostLikes.set(savedPostLikes || this.generateMockPostLikes());
    this.allCommentLikes.set(
      savedCommentLikes || this.generateMockCommentLikes()
    );

    this.saveLikesToStorage();
  }

  private saveLikesToStorage() {
    this.localStorage.setItem(this.POST_LIKES_KEY, this.allPostLikes());
    this.localStorage.setItem(this.COMMENT_LIKES_KEY, this.allCommentLikes());
  }

  loadPostLikes(postId: string): void {
    const allLikes = this.allPostLikes();
    const postSpecificLikes = allLikes.filter((like) => like.postId === postId);
    this.postLikes.set(postSpecificLikes);
  }

  loadCommentLikes(commentId: string): void {
    const allLikes = this.allCommentLikes();
    const commentSpecificLikes = allLikes.filter(
      (like) => like.commentId === commentId
    );
    this.commentLikes.set(commentSpecificLikes);
  }

  togglePostLike(postId: string): void {
    const currentUserId = 'current-user-id';
    const allLikes = this.allPostLikes();

    const existingLikeIndex = allLikes.findIndex(
      (like) => like.postId === postId && like.userId === currentUserId
    );

    if (existingLikeIndex >= 0) {
      // Remove like
      const updatedLikes = [...allLikes];
      updatedLikes.splice(existingLikeIndex, 1);
      this.allPostLikes.set(updatedLikes);
    } else {
      // Add like
      const newLike: Like = {
        id: Date.now().toString(),
        postId,
        userId: currentUserId,
        userName: 'Current User',
        userAvatar: 'assets/images/default-avatar.png',
        timestamp: new Date().toISOString(),
      };
      this.allPostLikes.set([...allLikes, newLike]);
    }

    // Update filtered likes for current post
    this.loadPostLikes(postId);
    this.saveLikesToStorage();
  }

  toggleCommentLike(commentId: string): void {
    const currentUserId = 'current-user-id';
    const allLikes = this.allCommentLikes();

    const existingLikeIndex = allLikes.findIndex(
      (like) => like.commentId === commentId && like.userId === currentUserId
    );

    if (existingLikeIndex >= 0) {
      // Remove like
      const updatedLikes = [...allLikes];
      updatedLikes.splice(existingLikeIndex, 1);
      this.allCommentLikes.set(updatedLikes);
    } else {
      // Add like
      const newLike: Like = {
        id: Date.now().toString(),
        commentId,
        userId: currentUserId,
        userName: 'Current User',
        userAvatar: 'assets/images/default-avatar.png',
        timestamp: new Date().toISOString(),
      };
      this.allCommentLikes.set([...allLikes, newLike]);
    }

    // Update filtered likes for current comment
    this.loadCommentLikes(commentId);
    this.saveLikesToStorage();
  }

  clearLikes(): void {
    this.postLikes.set([]);
    this.commentLikes.set([]);
  }

  private generateMockPostLikes(): Like[] {
    return [
      {
        id: '1',
        postId: '1',
        userId: 'user1',
        userName: 'Sarah Miller',
        userAvatar: 'assets/images/avatar1.jpg',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: '2',
        postId: '1',
        userId: 'user2',
        userName: 'Michael Chen',
        userAvatar: 'assets/images/avatar2.jpg',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: '3',
        postId: '1',
        userId: 'user3',
        userName: 'Alex Johnson',
        userAvatar: 'assets/images/avatar3.jpg',
        timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      },
      {
        id: '4',
        postId: '1',
        userId: 'user4',
        userName: 'Emily Wilson',
        userAvatar: 'assets/images/avatar4.jpg',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
      {
        id: '5',
        postId: '1',
        userId: 'user5',
        userName: 'David Brown',
        userAvatar: 'assets/images/avatar5.jpg',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      },
      {
        id: '6',
        postId: '2',
        userId: 'user6',
        userName: 'Lisa Wong',
        userAvatar: 'assets/images/avatar6.jpg',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ];
  }

  private generateMockCommentLikes(): Like[] {
    return [
      {
        id: '7',
        commentId: '1',
        userId: 'user7',
        userName: 'Robert Taylor',
        userAvatar: 'assets/images/avatar7.jpg',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '8',
        commentId: '2',
        userId: 'user8',
        userName: 'Jennifer Lee',
        userAvatar: 'assets/images/avatar8.jpg',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ];
  }
}
