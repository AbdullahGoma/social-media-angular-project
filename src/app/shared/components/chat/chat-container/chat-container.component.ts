import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ChatWindowModalComponent } from '../../modals/chat/chat-window-modal/chat-window-modal.component';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-chat-container',
  standalone: true,
  imports: [CommonModule, ChatWindowModalComponent],
  templateUrl: './chat-container.component.html',
  styleUrls: ['./chat-container.component.css'],
})
export class ChatContainerComponent {
  private chatService = inject(ChatService);
  chatWindows = this.chatService.chatWindows$;
}
