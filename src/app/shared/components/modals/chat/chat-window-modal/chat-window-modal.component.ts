import {
  AfterViewChecked,
  Component,
  ElementRef,
  inject,
  input,
  signal,
  ViewChild,
} from '@angular/core';
import { ChatService } from '../../../../../core/services/chat.service';
import { ChatWindow } from '../../../../models/chat-window';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-window-modal',
  standalone: true,
  imports: [DatePipe, FormsModule],
  templateUrl: './chat-window-modal.component.html',
  styleUrl: './chat-window-modal.component.css',
})
export class ChatWindowModalComponent implements AfterViewChecked {
  chatWindow = input.required<ChatWindow>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private chatService = inject(ChatService);

  messageText = signal('');
  private shouldScroll = true;

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
    }
  }

  sendMessage() {
    if (this.messageText().trim()) {
      this.chatService.addMessage(
        this.chatWindow().id,
        this.messageText(),
        true
      );
      this.messageText.set('');
    }
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  toggleMinimize() {
    this.chatService.toggleMinimize(this.chatWindow().id);
  }

  closeChat() {
    this.chatService.closeChat(this.chatWindow().id);
  }

  bringToFront() {
    this.chatService.focusChat(this.chatWindow().id);
  }

  onScroll() {
    const element = this.messagesContainer.nativeElement;
    const atBottom =
      element.scrollHeight - element.scrollTop === element.clientHeight;
    this.shouldScroll = atBottom;
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
