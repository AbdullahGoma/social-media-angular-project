import { computed, Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Comment } from '../../shared/models/comment';
import { delay, tap } from 'rxjs/operators';
import { LocalStorageService } from './localtorage.service';
import { LikeService } from './like.service';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private readonly STORAGE_KEY = 'social-app-comments';
  private commentsSignal = signal<Comment[]>([]);
  private currentPostId = signal<string | null>(null);

  selectedComments = computed(() => {
    const currentPostId = this.currentPostId();
    if (!currentPostId) return [];
    return this.commentsSignal().filter((c) => c.postId === currentPostId);
  });

  constructor(
    private localStorage: LocalStorageService,
    private likeService: LikeService
  ) {
    this.loadInitialComments();
  }

  /**
   * Load comments for a specific post
   * @param postId The ID of the post to load comments for
   */
  private loadInitialComments() {
    const savedComments = this.localStorage.getItem<Comment[]>(
      this.STORAGE_KEY
    );

    if (savedComments && savedComments.length > 0) {
      const validComments = savedComments.filter(
        (comment) => comment && comment.postId && comment.id
      );
      this.commentsSignal.set(validComments);
    } else {
      const mockComments = this.allComments();
      this.commentsSignal.set(mockComments);
      this.localStorage.setItem(this.STORAGE_KEY, mockComments);
    }
  }

  private saveCommentsToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.commentsSignal());
  }

  loadComments(postId: string): Observable<Comment[]> {
    this.currentPostId.set(postId);

    // Always get fresh from localStorage to avoid staleness
    const allComments =
      this.localStorage.getItem<Comment[]>(this.STORAGE_KEY) || [];
    this.commentsSignal.set(allComments); // Keep signal in sync

    const postComments = allComments.filter((c) => c.postId === postId);

    // Load likes
    postComments.forEach((comment) => {
      this.likeService.loadCommentLikes(comment.id);
      // Sync the like state
      comment.isLiked = this.likeService.isCommentLikedByUser(comment.id);

      // Handle replies
      comment.replies?.forEach((reply) => {
        this.likeService.loadCommentLikes(reply.id);
        reply.isLiked = this.likeService.isCommentLikedByUser(reply.id);
      });
    });

    return of(postComments);
  }

  /**
   * Add a new comment or reply
   * @param postId The ID of the post being commented on
   * @param content The comment text
   * @param parentId The ID of the parent comment (for replies)
   */
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
      tap(() => {
        if (parentId) {
          this.addReplyToComment(parentId, newComment);
        } else {
          this.addTopLevelComment(newComment);
        }
        this.saveCommentsToStorage();
      })
    );
  }

  refreshComments() {
    if (this.currentPostId()) {
      const postId = this.currentPostId()!;
      const postComments = this.commentsSignal().filter(
        (c) => c.postId === postId
      );
      this.commentsSignal.set([...this.commentsSignal()]); // Trigger change detection
    }
  }

  updateComment(
    commentId: string,
    updateFn: (comment: Comment) => Comment
  ): void {
    this.commentsSignal.update((comments) => {
      return comments.map((comment) => {
        // Update the main comment if it matches
        if (comment.id === commentId) {
          return updateFn(comment);
        }

        // Check and update replies if they exist
        if (comment.replies) {
          const updatedReplies = comment.replies.map((reply) =>
            reply.id === commentId ? updateFn(reply) : reply
          );
          return { ...comment, replies: updatedReplies };
        }

        return comment;
      });
    });

    this.saveCommentsToStorage();
  }

  /**
   * Toggle like on a comment
   * @param commentId The ID of the comment to like/unlike
   */
  toggleCommentLike(commentId: string): void {
    const comments = [...this.commentsSignal()];
    const comment = this.findCommentById(comments, commentId);

    if (comment) {
      // Update like count and state
      comment.likes = comment.likes || 0;
      comment.likes += comment.isLiked ? -1 : 1;
      comment.isLiked = !comment.isLiked;

      // Update like service
      this.likeService.toggleCommentLike(commentId);

      this.commentsSignal.set(comments);
      this.saveCommentsToStorage();
    }
  }

  /**
   * Clear all comments from state
   */
  clearComments() {
    this.commentsSignal.set([]);
    this.currentPostId.set(null);
    this.likeService.clearLikes();
  }

  private transformComments(comments: Comment[]): Comment[] {
    // Convert flat comments array to nested structure if needed
    return comments;
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

  private addTopLevelComment(comment: Comment) {
    this.commentsSignal.update((comments) => [
      comment,
      ...comments.filter((c) => c.id !== comment.id),
    ]);
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

  private allComments(): Comment[] {
    return [
      {
        id: '1',
        postId: '1',
        author: {
          name: 'Alex Johnson',
          avatar: 'assets/images/avatar1.jpg',
        },
        content: 'This looks amazing! Where was this taken?',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        likes: 1, // Matches the 1 like in generateMockCommentLikes for comment 1
        isLiked: false,
        replies: [
          {
            id: '2',
            postId: '1',
            author: {
              name: 'Sarah Miller',
              avatar: 'assets/images/avatar2.jpg',
            },
            content: "I think it's the Blue Ridge Mountains",
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            likes: 1, // Matches the 1 like in generateMockCommentLikes for comment 2
            parentId: '1',
            isLiked: false,
          },
          {
            id: '3',
            postId: '1',
            author: {
              name: 'Mike Chen',
              avatar: 'assets/images/avatar3.jpg',
            },
            content: "Actually, I believe it's the Rockies",
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            likes: 0,
            parentId: '1',
            isLiked: false,
          },
        ],
      },
      {
        id: '4',
        postId: '2',
        author: {
          name: 'Emily Wilson',
          avatar: 'assets/images/avatar4.jpg',
        },
        content: 'The colors in that sunset photo are incredible!',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        likes: 0,
        isLiked: false,
      },
      {
        id: '5',
        postId: '3',
        author: {
          name: 'David Smith',
          avatar: 'assets/images/avatar5.jpg',
        },
        content: 'Has anyone been here recently? How were the crowds?',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        likes: 0,
        isLiked: false,
        replies: [
          {
            id: '6',
            postId: '3',
            author: {
              name: 'Lisa Wong',
              avatar: 'assets/images/avatar6.jpg',
            },
            content: 'Went last week, it was pretty quiet!',
            timestamp: new Date(Date.now() - 4800000).toISOString(),
            likes: 0,
            parentId: '5',
            isLiked: false,
          },
        ],
      },
    ];
  }
}
