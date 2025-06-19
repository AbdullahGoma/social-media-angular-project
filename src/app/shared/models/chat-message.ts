export interface ChatMessage {
  text: string;
  isSent: boolean;
  time: Date;
  imageUrl?: string;
}
