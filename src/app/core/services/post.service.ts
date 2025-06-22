import { computed, Injectable, signal } from '@angular/core';
import { Post } from '../../shared/models/post';
import { LocalStorageService } from './localtorage.service';
import { CommentService } from './comment.service';
import { LikeService } from './like.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly STORAGE_KEY = 'social-app-posts';

  // Signals for state management
  private allPostsSignal = signal<Post[]>([]);
  private selectedPostSignal = signal<Post | null>(null);

  // Computed signals for different post types
  readonly timelinePosts = computed(() => this.allPostsSignal());

  readonly feedPosts = computed(() =>
    this.allPostsSignal().filter((post) => post.type === 'feed')
  );

  public selectedPost = this.selectedPostSignal;

  constructor(
    private localStorage: LocalStorageService,
    private commentService: CommentService,
    private likeService: LikeService
  ) {
    const initialPosts = this.initializePosts();
    this.allPostsSignal.set(initialPosts);
  }

  private initializePosts(): Post[] {
    const savedPosts = this.localStorage.getItem<Post[]>(this.STORAGE_KEY);
    if (savedPosts) return savedPosts;

    const defaultPosts = this.getDefaultPosts();
    this.localStorage.setItem(this.STORAGE_KEY, defaultPosts);
    return defaultPosts;
  }

  private getDefaultPosts(): Post[] {
    return [
      {
        id: '1',
        type: 'feed',
        author: {
          name: 'Abdullah Gomaa',
          avatar:
            'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg',
        },
        content:
          "Check out these amazing moments from my weekend trip! The scenery was breathtaking and the company was even better. Can't wait to go back again soon! #NatureLover #WeekendGetaway",
        images: [
          'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        feeling: { emoji: '😊', label: 'Happy' },
        status: { emoji: '📺', label: 'Watching' },
        date: '2:30 PM • Today',
        likes: 42,
        comments: 13,
        shares: 7,
        isLiked: false,
        isExpanded: false,
      },
      {
        id: '2',
        type: 'timeline',
        author: {
          name: 'John Doe',
          avatar: 'https://example.com/avatar3.jpg',
        },
        content:
          'Just finished reading an amazing book! Highly recommend it to everyone who loves science fiction.',
        images: [
          'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ],
        date: '10:15 AM • Yesterday',
        likes: 28,
        comments: 5,
        shares: 2,
        isLiked: true,
        isExpanded: false,
      },
      {
        id: '3',
        type: 'feed',
        author: {
          name: 'Abdullah Gomaa',
          avatar: 'https://example.com/avatar4.jpg',
        },
        content:
          'My new recipe for vegan chocolate cake was a huge success! Everyone loved it at the potluck dinner.',
        images: [
          'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ],
        feeling: { emoji: '😋', label: 'Yummy' },
        date: '5:45 PM • 2 days ago',
        likes: 36,
        comments: 8,
        shares: 4,
        isLiked: false,
        isExpanded: false,
      },
      {
        id: '4',
        type: 'timeline',
        author: {
          name: 'Mike Chen',
          avatar: 'https://example.com/avatar5.jpg',
        },
        content:
          'Just completed my first marathon! The training was tough but so worth it. Who wants to join me for the next one?',
        images: [
          'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        ],
        feeling: { emoji: '🏃‍♂️', label: 'Running' },
        status: { emoji: '🏅', label: 'Achievement' },
        date: '8:20 AM • 3 days ago',
        likes: 87,
        comments: 24,
        shares: 12,
        isLiked: false,
        isExpanded: false,
      },
      {
        id: '5',
        type: 'feed',
        author: {
          name: 'Abdullah Gomaa',
          avatar: 'https://example.com/avatar6.jpg',
        },
        content:
          'Beautiful sunset at the beach today. Nature never fails to amaze me with its beauty.',
        images: [
          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        feeling: { emoji: '🌅', label: 'Sunset' },
        date: '7:15 PM • 4 days ago',
        likes: 65,
        comments: 9,
        shares: 5,
        isLiked: true,
        isExpanded: false,
      },
    ];
  }

  private savePostsToStorage(): void {
    this.localStorage.setItem(this.STORAGE_KEY, this.allPostsSignal());
  }

  // Add new post
  addPost(
    newPost: Omit<Post, 'id' | 'likes' | 'comments' | 'shares'>,
    type: 'timeline' | 'feed' = 'feed'
  ): Post {
    const post: Post = {
      ...newPost,
      id: this.generateId(),
      type,
      likes: 0,
      comments: 0,
      shares: 0,
      isExpanded: false,
    };

    this.allPostsSignal.update((posts) => [post, ...posts]);
    this.savePostsToStorage();
    return post;
  }

  toggleExpand(postId: string) {
    this.allPostsSignal.update((posts) =>
      posts.map((post) =>
        post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
      )
    );
    this.savePostsToStorage();
  }

  selectPost(postId: string) {
    const post = this.allPostsSignal().find((p) => p.id === postId);
    if (post) {
      this.selectedPostSignal.set(post);
      this.commentService.loadComments(postId).subscribe();
      this.likeService.loadPostLikes(postId);
    }
  }

  clearSelectedPost() {
    this.selectedPostSignal.set(null);
    this.commentService.clearComments();
    this.likeService.clearLikes();
  }

  toggleLike(postId: string): void {
    this.allPostsSignal.update((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          const newLikeStatus = !post.isLiked;
          const likeCount = post.likes + (newLikeStatus ? 1 : -1);

          // Update like service
          if (newLikeStatus) {
            this.likeService.togglePostLike(postId);
          } else {
            this.likeService.togglePostLike(postId);
          }

          return {
            ...post,
            likes: likeCount,
            isLiked: newLikeStatus,
          };
        }
        return post;
      })
    );
    this.savePostsToStorage();
  }

  incrementCommentCount(postId: string): void {
    this.allPostsSignal.update((posts) =>
      posts.map((post) =>
        post.id === postId
          ? { ...post, comments: (post.comments || 0) + 1 }
          : post
      )
    );
    this.savePostsToStorage();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}
