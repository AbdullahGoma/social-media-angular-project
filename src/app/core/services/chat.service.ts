import { Injectable, signal } from '@angular/core';
import { ChatWindow } from '../../shared/models/chat-window';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private chatWindows = signal<ChatWindow[]>([]);
  private maxZIndex = 5;

  chatWindows$ = this.chatWindows.asReadonly();

  openChat(contactName: string, contactImg: string) {
    const existingChat = this.chatWindows().find(
      (c) => c.contactName === contactName
    );

    if (existingChat) {
      this.focusChat(existingChat.id);
      return;
    }

    const newChat: ChatWindow = {
      id: `chat-${Date.now()}`,
      contactName,
      contactImg,
      messages: [],
      minimized: false,
      zIndex: ++this.maxZIndex,
    };

    // Add sample received messages
    setTimeout(() => {
      this.addMessage(newChat.id, 'Hi there! How can I help you?', false);
    }, 500);

    setTimeout(() => {
      this.addMessage(
        newChat.id,
        'Let me know if you have any questions.',
        false
      );
    }, 1500);

    this.chatWindows.update((chats) => [...chats, newChat]);
  }

  closeChat(chatId: string) {
    this.chatWindows.update((chats) => chats.filter((c) => c.id !== chatId));
  }

  toggleMinimize(chatId: string) {
    this.chatWindows.update((chats) =>
      chats.map((c) =>
        c.id === chatId ? { ...c, minimized: !c.minimized } : c
      )
    );
  }

  focusChat(chatId: string) {
    this.chatWindows.update((chats) =>
      chats.map((c) => ({
        ...c,
        minimized: c.id === chatId ? false : c.minimized,
        zIndex: c.id === chatId ? ++this.maxZIndex : c.zIndex,
      }))
    );
  }

  addMessage(chatId: string, text: string, isSent: boolean, imageUrl?: string) {
    this.chatWindows.update((chats) =>
      chats.map((c) =>
        c.id === chatId
          ? {
              ...c,
              messages: [
                ...c.messages,
                {
                  text,
                  isSent,
                  time: new Date(),
                  imageUrl,
                },
              ],
            }
          : c
      )
    );

    if (isSent) {
      // Simulate reply
      setTimeout(() => {
        const replies = [
          'Thanks for your message!',
          "I'll get back to you soon.",
          "That's interesting, tell me more.",
          'How can I assist you further?',
          'Got it! Anything else?',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        this.addMessage(chatId, randomReply, false);
      }, 1000 + Math.random() * 2000);
    }
  }
}
