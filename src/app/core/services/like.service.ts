import { Injectable, signal } from '@angular/core';
import { Like } from '../../shared/models/like';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class LikeService {
  // Using signals for state management
  public readonly postLikes = signal<Like[]>([]);
  public readonly commentLikes = signal<Like[]>([]);
  private currentPostId = signal<string | null>(null);
  private currentCommentId = signal<string | null>(null);

  // Expose as observables
  postLikes$ = toObservable(this.postLikes);
  commentLikes$ = toObservable(this.commentLikes);

  /**
   * Load likes for a post
   * @param postId The ID of the post to load likes for
   */
  loadPostLikes(postId: string): void {
    this.currentPostId.set(postId);
    // In a real app, replace with API call
    const mockLikes = this.generateMockPostLikes(postId);
    this.postLikes.set(mockLikes);
  }

  /**
   * Load likes for a comment
   * @param commentId The ID of the comment to load likes for
   */
  loadCommentLikes(commentId: string): void {
    this.currentCommentId.set(commentId);
    // In a real app, replace with API call
    const mockLikes = this.generateMockCommentLikes(commentId);
    this.commentLikes.set(mockLikes);
  }

  /**
   * Toggle like on a post
   * @param postId The ID of the post to like/unlike
   */
  togglePostLike(postId: string): void {
    // In a real app, replace with API call
    const currentUserId = 'current-user-id'; // Replace with actual user ID
    const currentLikes = this.postLikes();

    const existingLikeIndex = currentLikes.findIndex(
      (like) => like.postId === postId && like.userId === currentUserId
    );

    if (existingLikeIndex >= 0) {
      // Unlike
      const updatedLikes = [...currentLikes];
      updatedLikes.splice(existingLikeIndex, 1);
      this.postLikes.set(updatedLikes);
    } else {
      // Like
      const newLike: Like = {
        id: Date.now().toString(),
        postId,
        userId: currentUserId,
        userName: 'Current User',
        userAvatar: 'assets/images/default-avatar.png',
        timestamp: new Date().toISOString(),
      };
      this.postLikes.set([...currentLikes, newLike]);
    }
  }

  /**
   * Toggle like on a comment
   * @param commentId The ID of the comment to like/unlike
   */
  toggleCommentLike(commentId: string): void {
    // In a real app, replace with API call
    const currentUserId = 'current-user-id'; // Replace with actual user ID
    const currentLikes = this.commentLikes();

    const existingLikeIndex = currentLikes.findIndex(
      (like) => like.commentId === commentId && like.userId === currentUserId
    );

    if (existingLikeIndex >= 0) {
      // Unlike
      const updatedLikes = [...currentLikes];
      updatedLikes.splice(existingLikeIndex, 1);
      this.commentLikes.set(updatedLikes);
    } else {
      // Like
      const newLike: Like = {
        id: Date.now().toString(),
        commentId,
        userId: currentUserId,
        userName: 'Current User',
        userAvatar: 'assets/images/default-avatar.png',
        timestamp: new Date().toISOString(),
      };
      this.commentLikes.set([...currentLikes, newLike]);
    }
  }

  /**
   * Clear all likes from state
   */
  clearLikes(): void {
    this.postLikes.set([]);
    this.commentLikes.set([]);
    this.currentPostId.set(null);
    this.currentCommentId.set(null);
  }

  // Private helper methods
  private generateMockPostLikes(postId: string): Like[] {
    return [
      {
        id: '1',
        postId,
        userId: 'user1',
        userName: 'Sarah Miller',
        userAvatar: 'assets/images/avatar1.jpg',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
      {
        id: '2',
        postId,
        userId: 'user2',
        userName: 'Michael Chen',
        userAvatar: 'assets/images/avatar2.jpg',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
    ];
  }

  private generateMockCommentLikes(commentId: string): Like[] {
    return [
      {
        id: '3',
        commentId,
        userId: 'user3',
        userName: 'Alex Johnson',
        userAvatar: 'assets/images/avatar3.jpg',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '4',
        commentId,
        userId: 'user4',
        userName: 'Emily Wilson',
        userAvatar: 'assets/images/avatar4.jpg',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      },
    ];
  }
}
