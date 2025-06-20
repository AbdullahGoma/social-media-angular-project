// like.model.ts
export interface Like {
  id: string;
  postId?: string; // For post likes
  commentId?: string; // For comment likes
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
}
