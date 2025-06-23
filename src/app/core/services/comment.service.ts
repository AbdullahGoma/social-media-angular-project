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
  private currentPostId: string | null = null;

  selectedComments = computed(() => this.commentsSignal);

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
    if (savedComments) {
      this.commentsSignal.set(savedComments);
    } else {
      // Initialize with some mock comments for demo
      const mockComments = this.generateMockComments('1');
      this.commentsSignal.set(mockComments);
      this.saveCommentsToStorage();
    }
  }

  private saveCommentsToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.commentsSignal());
  }

  loadComments(postId: string): Observable<Comment[]> {
    this.currentPostId = postId;

    // Always get fresh comments from storage
    const savedComments = this.localStorage.getItem<Comment[]>(
      this.STORAGE_KEY
    );
    const allComments = savedComments || this.generateMockComments(postId);

    const postComments = allComments.filter((c) => c.postId === postId);
    this.commentsSignal.set(postComments);

    // Load likes for each comment
    postComments.forEach((comment) => {
      this.likeService.loadCommentLikes(comment.id);
      if (comment.replies) {
        comment.replies.forEach((reply) => {
          this.likeService.loadCommentLikes(reply.id);
        });
      }
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

        // Explicitly update the comments for the current post
        if (this.currentPostId === postId) {
          const allComments = this.commentsSignal();
          const postComments = allComments.filter((c) => c.postId === postId);
          this.commentsSignal.set(postComments);
        }
      })
    );
  }

  refreshComments() {
    if (this.currentPostId) {
      this.loadComments(this.currentPostId).subscribe();
    }
  }

  /**
   * Toggle like on a comment
   * @param commentId The ID of the comment to like/unlike
   */
  toggleCommentLike(commentId: string): void {
    const comments = [...this.commentsSignal()];
    const comment = this.findCommentById(comments, commentId);

    if (comment) {
      comment.likes = comment.likes || 0;
      comment.likes += comment.isLiked ? -1 : 1;
      comment.isLiked = !comment.isLiked;

      // Update like service
      if (comment.isLiked) {
        this.likeService.toggleCommentLike(commentId);
      } else {
        this.likeService.toggleCommentLike(commentId);
      }

      this.commentsSignal.set(comments);
      this.saveCommentsToStorage();
    }
  }

  /**
   * Clear all comments from state
   */
  clearComments() {
    this.commentsSignal.set([]);
    this.currentPostId = null;
    this.likeService.clearLikes();
  }

  // Private helper methods

  private fetchCommentsFromAPI(postId: string): Observable<Comment[]> {
    // Simulate API call with delay
    return of(this.generateMockComments(postId)).pipe(delay(500));
  }

  private postCommentToAPI(
    postId: string,
    content: string,
    parentId: string | null
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

    return of(newComment).pipe(delay(300));
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

  private generateMockComments(postId: string): Comment[] {
    const baseComments = [
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
        isLiked: false,
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
            isLiked: false,
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
            isLiked: false,
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
        isLiked: false,
      },
      {
        id: '5',
        postId,
        author: {
          name: 'David Smith',
          avatar: 'assets/images/avatar5.jpg',
        },
        content: 'Has anyone been here recently? How were the crowds?',
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        likes: 2,
        isLiked: false,
        replies: [
          {
            id: '6',
            postId,
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

    return baseComments;
  }
}
