import { Component, computed, inject, signal } from '@angular/core';
import { ModalType } from '../../../../shared/models/modal-type';
import { FriendsService } from '../../../../core/services/friends.service';
import { UserService } from '../../../../core/services/user.service';
import { ModalService } from '../../../../core/services/modal.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfirmationModalComponent } from '../../../../shared/components/modals/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-friends-tab',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './friends-tab.component.html',
  styleUrl: './friends-tab.component.css',
})
export class FriendsTabComponent {
  private friendsService = inject(FriendsService);
  private userService = inject(UserService);
  private modalService = inject(ModalService);

  // Search terms
  friendsSearchTerm = signal('');
  requestsSearchTerm = signal('');

  // Pagination
  friendsCurrentPage = signal(1);
  requestsCurrentPage = signal(1);
  itemsPerPage = 4;

  // Filtered and paginated data
  filteredFriends = computed(() => {
    const term = this.friendsSearchTerm().toLowerCase();
    const friends = this.friendsService.friends();
    if (!friends) return [];

    return friends.filter((friend) => {
      const user = this.userService.getUserById(friend.friendId);
      return user?.name?.toLowerCase().includes(term);
    });
  });

  filteredRequests = computed(() => {
    const term = this.requestsSearchTerm().toLowerCase();
    const requests = this.friendsService.pendingRequests();
    if (!requests) return [];

    return requests.filter((request) => {
      const user = this.userService.getUserById(request.friendId);
      return user?.name?.toLowerCase().includes(term);
    });
  });

  paginatedFriends = computed(() => {
    const filtered = this.filteredFriends();
    const startIndex = (this.friendsCurrentPage() - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  });

  paginatedRequests = computed(() => {
    const filtered = this.filteredRequests();
    const startIndex = (this.requestsCurrentPage() - 1) * this.itemsPerPage;
    return filtered.slice(startIndex, startIndex + this.itemsPerPage);
  });

  totalFriendsPages = computed(() =>
    Math.ceil(this.filteredFriends().length / this.itemsPerPage)
  );

  totalRequestsPages = computed(() =>
    Math.ceil(this.filteredRequests().length / this.itemsPerPage)
  );

  // FIXED: Added getUserDetails method that your template expects
  getUserDetails(friendId: string) {
    const user = this.userService.getUserById(friendId);
    return {
      name: user?.name || 'Unknown User',
      avatar: user?.avatar || 'default-avatar.png',
      mutualFriends: this.friendsService.getMutualFriendsCount(friendId),
    };
  }

  // Get user details for display (keeping this for backward compatibility)
  getFriendDetails(friendId: string) {
    return {
      name: this.friendsService.getFriendName(friendId),
      avatar: this.friendsService.getFriendAvatar(friendId),
      mutualFriends: this.friendsService.getMutualFriendsCount(friendId),
    };
  }

  private getMutualFriendsCount(userId: string): number {
    // This is a Random Number for Now
    return Math.floor(Math.random() * 10) + 1; // Random number between 1-10 for demo
  }

  // Pagination controls
  nextFriendsPage() {
    if (this.friendsCurrentPage() < this.totalFriendsPages()) {
      this.friendsCurrentPage.update((page) => page + 1);
    }
  }

  prevFriendsPage() {
    if (this.friendsCurrentPage() > 1) {
      this.friendsCurrentPage.update((page) => page - 1);
    }
  }

  nextRequestsPage() {
    if (this.requestsCurrentPage() < this.totalRequestsPages()) {
      this.requestsCurrentPage.update((page) => page + 1);
    }
  }

  prevRequestsPage() {
    if (this.requestsCurrentPage() > 1) {
      this.requestsCurrentPage.update((page) => page - 1);
    }
  }

  // Friend actions
  acceptRequest(friendshipId: string) {
    this.friendsService.acceptFriendRequest(friendshipId);
  }

  declineRequest(friendshipId: string) {
    this.friendsService.rejectFriendRequest(friendshipId);
  }

  removeFriend(userId: string) {
    this.modalService.openModal(ModalType.Confiramation, {
      message: 'Are you sure you want to remove this friend?',
      action: () => this.friendsService.removeFriend(userId),
    });
  }

  blockUser(userId: string) {
    this.modalService.openModal(ModalType.Confiramation, {
      message:
        "Are you sure you want to block this user? You will no longer be able to see each other's activities.",
      action: () => {
        // Implement block user logic (later)
        this.friendsService.removeFriend(userId);
      },
    });
  }
}
