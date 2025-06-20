export interface Comment {
  id: string;
  postId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string | Date;
  likes: number;
  parentId?: string | null; // null for top-level comments
  replies?: Comment[];
}
