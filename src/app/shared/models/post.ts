export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  images?: string[];
  feeling?: {
    emoji: string;
    label: string;
  };
  status?: {
    emoji: string;
    label: string;
  };
  date: string;
  likes: number;
  comments: number;
  shares: number;
  isExpanded?: boolean;
  isLiked?: boolean;
}
