export interface Story {
  id: string;
  user: string;
  image: string;
  stories: StoryItem[];
  viewed: boolean;
  viewedStories: number[];
  isMine: boolean;
}

export interface StoryItem {
  id: string;
  type: 'image' | 'text' | 'image-text';
  url?: string;
  content?: string;
  text?: string;
  textColor?: string;
  fontSize?: string;
  textPosition?: 'top' | 'center' | 'bottom';
  background?: string;
  color?: string;
  position?: 'top' | 'center' | 'bottom';
  timestamp?: string;
}
