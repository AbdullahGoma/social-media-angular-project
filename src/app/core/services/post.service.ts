import { computed, Injectable, signal } from '@angular/core';
import { Post } from '../../shared/models/post';
import { LocalStorageService } from './localtorage.service';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly STORAGE_KEY = 'social-app-posts';

  // Signals for state management
  private allPostsSignal = signal<Post[]>([]);
  private selectedPostSignal = signal<Post | null>(null);

  // Computed signals for different post types
  readonly timelinePosts = computed(() =>
    this.allPostsSignal().filter(
      (post) => post.type === 'timeline' || !post.type
    )
  );

  readonly feedPosts = computed(() =>
    this.allPostsSignal().filter((post) => post.type === 'feed')
  );

  public selectedPost = this.selectedPostSignal;

  constructor(private localStorage: LocalStorageService) {
    const initialPosts = this.initializePosts();
    this.allPostsSignal.set(initialPosts);
  }

  private initializePosts(): Post[] {
    // Try to load from local storage
    const savedPosts = this.localStorage.getItem<Post[]>(this.STORAGE_KEY);
    if (savedPosts) return savedPosts;

    // Default mock data if nothing in storage
    return this.getDefaultPosts();
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
        date: '10:15 AM • Yesterday',
        likes: 28,
        comments: 5,
        shares: 2,
        isExpanded: false,
      },
      // More default posts...
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
    this.selectedPostSignal.set(post || null);
  }

  clearSelectedPost() {
    this.selectedPostSignal.set(null);
  }

  toggleLike(postId: string): void {
    this.allPostsSignal.update((posts) =>
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            likes: post.likes + (post.isLiked ? -1 : 1),
            isLiked: !post.isLiked,
          };
        }
        return post;
      })
    );
    this.savePostsToStorage();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}