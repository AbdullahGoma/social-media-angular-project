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
import { ModalService } from '../../../../../core/services/modal.service';
import { ModalType } from '../../../../models/modal-type';
import { ImagePreviewModalComponent } from "../../settings/image-preview-modal/image-preview-modal.component";

@Component({
  selector: 'app-chat-window-modal',
  standalone: true,
  imports: [DatePipe, FormsModule, ImagePreviewModalComponent],
  templateUrl: './chat-window-modal.component.html',
  styleUrl: './chat-window-modal.component.css',
})
export class ChatWindowModalComponent implements AfterViewChecked {
  chatWindow = input.required<ChatWindow>();
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  private chatService = inject(ChatService);
  private modalService = inject(ModalService);

  messageText = signal('');
  private shouldScroll = true;
  private fileInput = signal<HTMLInputElement | null>(null);

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
      this.shouldScroll = true;
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

  // Image handling methods
  initFileInput() {
    if (!this.fileInput()) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.style.display = 'none';
      input.addEventListener('change', (event) =>
        this.handleImageUpload(event)
      );
      document.body.appendChild(input);
      this.fileInput.set(input);
    }
  }

  attachImage() {
    this.initFileInput();
    this.fileInput()?.click();
  }

  handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type.match('image.*')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          this.chatService.addMessage(this.chatWindow().id, '', true, imageUrl);
          this.shouldScroll = true;
        };
        reader.readAsDataURL(file);
      }
    }
    input.value = '';
  }

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }
}
