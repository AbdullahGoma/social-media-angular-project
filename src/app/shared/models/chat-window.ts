import { ChatMessage } from "./chat-message";

export interface ChatWindow {
  id: string;
  contactName: string;
  contactImg: string;
  messages: ChatMessage[];
  minimized: boolean;
  zIndex: number;
}
