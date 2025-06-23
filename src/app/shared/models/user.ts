import { Post } from './post';
import { Comment } from './comment';
import { Like } from './like';
import { ChatWindow } from './chat-window';
import { Story } from './story';

export interface User {
  id: string;
  name: string;
  bio?: string;
  avatar: string;
  email: string;
  about: About;
  photos: Photo[];
  friends: Friend[]; // Now properly typed as Friend[]
  friendships: Friendship[]; // Relationships this user has initiated
  followers: Follower[]; // Users following this user
  favorites: Favorite[];
  posts: Post[];
  comments: Comment[];
  likes: Like[];
  chats: ChatWindow[];
  stories: Story[];
  createdAt: Date;
  updatedAt: Date;
}

export interface About {
  userId?: string;
  job?: string;
  workplace?: string;
  location?: string;
  playerName?: string;
  status?: 'single' | 'married' | 'divorced' | 'widowed' | 'other';
  education?: string;
  phoneNumber?: string;
}

export interface Photo {
  userId: string;
  id: string;
  url: string;
  caption?: string;
  createdAt: Date;
  postId?: string; 
}

export interface Friendship {
  id: string;
  userId: string; // The user who initiated the friendship
  friendId: string; // The user who is being friended
  status: 'pending' | 'accepted' | 'rejected';
  since: Date;
}

export interface Friend {
  id: string; 
  userId: string;
  friendId: string;
  since: Date;
}


export interface Follower {
  id: string;
  userId: string; // The user being followed
  followerId: string; // The user who is following
  since: Date;
}

export interface Favorite {
  userId: string;
  type: 'post' | 'photo' | 'user' | 'page';
  itemId: string;
  addedAt: Date;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  about: About;
  stats: {
    posts: number;
    photos: number;
    friends: number;
    favorites: number;
  };
}