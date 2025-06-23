import { computed, inject, Injectable, signal } from '@angular/core';
import { UserService } from './user.service';
import { LocalStorageService } from './localtorage.service';
import { Friend } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private readonly STORAGE_KEY = 'social-app-user-friends';
  private userService = inject(UserService);
  private localStorage = inject(LocalStorageService);

  private friendsSignal = signal<Friend[]>([]);
  // Get accepted friendships
  friends = computed(() => {
    const currentUser = this.userService.currentUser();
    return (
      currentUser?.friendships.filter((f) => f.status === 'accepted') || []
    );
  });

  // Get pending friend requests
  pendingRequests = computed(() => {
    const currentUser = this.userService.currentUser();
    return currentUser?.friendships.filter((f) => f.status === 'pending') || [];
  });

  // Get followers
  followers = computed(() => {
    const currentUser = this.userService.currentUser();
    return currentUser?.followers || [];
  });

  constructor() {
    this.loadInitialFriends();
  }

  private loadInitialFriends() {
    const savedFriends = this.localStorage.getItem<Friend[]>(this.STORAGE_KEY);
    if (savedFriends) {
      this.friendsSignal.set(savedFriends);
    } else {
      const defaultFriends = this.generateDefaultFriends();
      this.friendsSignal.set(defaultFriends);
      this.saveFriendsToStorage();
    }
  }

  private saveFriendsToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.friendsSignal());
  }

  private generateDefaultFriends(): Friend[] {
    return [
      {
        id: '1',
        friendId: '2',
        userId: '1',
        since: new Date(),
      },
      {
        id: '2',
        friendId: '3',
        userId: '1',
        since: new Date(Date.now() - 86400000), // 1 day ago
      },
    ];
  }

  sendFriendRequest(friendId: string) {
    this.userService.sendFriendRequest(friendId);
  }

  acceptFriendRequest(friendshipId: string) {
    this.userService.acceptFriendRequest(friendshipId);
  }

  rejectFriendRequest(friendshipId: string) {
    // Similar to accept but with 'rejected' status
  }

  removeFriend(userId: string) {
    this.friendsSignal.update((friends) =>
      friends.filter((f) => f.userId !== userId)
    );
    this.saveFriendsToStorage();
  }

  isFriend(userId: string): boolean {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return false;

    return currentUser.friendships.some(
      (f) => f.friendId === userId && f.status === 'accepted'
    );
  }
}
