import { Injectable, signal } from '@angular/core';
import { Post } from '../../shared/models/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts = signal<Post[]>(this.generateDummyPosts());

  get posts$() {
    return this.posts.asReadonly();
  }

  addPost(newPost: Omit<Post, 'id' | 'likes' | 'comments' | 'shares'>) {
    this.posts.update((posts) => [
      {
        ...newPost,
        id: this.generateId(),
        likes: 0,
        comments: 0,
        shares: 0,
        isExpanded: false,
      },
      ...posts,
    ]);
  }

  toggleExpand(postId: string) {
    this.posts.update((posts) =>
      posts.map((post) =>
        post.id === postId ? { ...post, isExpanded: !post.isExpanded } : post
      )
    );
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private generateDummyPosts(): Post[] {
    return [
      {
        id: '1',
        author: {
          name: 'Abdullah Gomaa',
          avatar:
            'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg',
        },
        content:
          "Check out these amazing moments from my weekend trip! The scenery was breathtaking and the company was even better. Can't wait to go back again soon! #NatureLover #WeekendGetaway",
        images: [
          'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
          'https://images.unsplash.com/photo-1616530940355-351fabd9524b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        feeling: { emoji: '😊', label: 'Happy' },
        status: { emoji: '📺', label: 'Watching' },
        date: '2:30 PM • Today',
        likes: 42,
        comments: 13,
        shares: 7,
      },
      {
        id: '2',
        author: {
          name: 'Abdullah Gomaa',
          avatar:
            'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg',
        },
        content:
          'Just finished reading an amazing book! Highly recommend it to everyone who loves science fiction.',
        date: '10:15 AM • Yesterday',
        likes: 28,
        comments: 5,
        shares: 2,
      },
      {
        id: '3',
        author: {
          name: 'Abdullah Gomaa',
          avatar:
            'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg',
        },
        content: 'Beautiful sunset today! Nature never fails to amaze me.',
        images: [
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
        ],
        feeling: { emoji: '😍', label: 'Loved' },
        date: '7:45 PM • 2 days ago',
        likes: 56,
        comments: 8,
        shares: 3,
      },
    ];
  }
}
