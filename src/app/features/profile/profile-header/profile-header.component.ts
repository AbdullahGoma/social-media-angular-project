import { Component, computed, inject, Input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ChatService } from '../../../core/services/chat.service';
import { ModalType } from '../../../shared/models/modal-type';
import { ModalService } from '../../../core/services/modal.service';
import { UserService } from '../../../core/services/user.service';
import { FriendsService } from '../../../core/services/friends.service';

@Component({
  selector: 'app-profile-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.css',
})
export class ProfileHeaderComponent {
  // Will Handle by User Id Comes From Routing as Input
  @Input() userId: string = '1';

  private chatService = inject(ChatService);
  private modalService = inject(ModalService);
  private userService = inject(UserService);
  private friendsService = inject(FriendsService);

  headerData = computed(() => {
    const data = this.userService.getUserHeaderData(this.userId);
    return (
      data || {
        name: 'Loading...',
        avatar: '',
        coverImage: '',
        isFriend: false,
      }
    );
  });

  isAnimating = signal(false);

  toggleFriendStatus() {
    if (this.isAnimating()) return;

    this.isAnimating.set(true);
    this.friendsService.sendFriendRequest(this.userId);

    // Simulate API call
    setTimeout(() => {
      this.isAnimating.set(false);
    }, 300);
  }

  acceptFriendRequest() {
    // this.friendsService.acceptFriendRequest(friendshipId);
  }

  openChat() {
    this.chatService.openChat(this.headerData().name, this.headerData().avatar);
  }

  previewImage(imageUrl: string) {
    this.modalService.openModal(ModalType.ImagePreview, imageUrl);
  }
}
