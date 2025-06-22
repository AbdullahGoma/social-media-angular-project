import { Component, inject, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { ModalType } from '../../../shared/models/modal-type';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent {
  @Input() userId: number = 1;
  @Input() userName: string = 'Abdullah Gomaa';
  @Input() userImage: string =
    'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg';

  private chatService = inject(ChatService);
  private modalService = inject(ModalService);

  isFriend = signal(false);
  isAnimating = signal(false);

  toggleFriendStatus() {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    this.isFriend.update((val) => !val);

    // Simulate API call
    setTimeout(() => {
      this.isAnimating.set(false);
    }, 300); 
  }

  openChat() {
    this.chatService.openChat(this.userName, this.userImage);
  }

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }
}
