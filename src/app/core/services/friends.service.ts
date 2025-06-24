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
      currentUser?.friendships?.filter((f) => f.status === 'accepted') || []
    );
  });

  // Get friend's name
  getFriendName(friendId: string): string | undefined {
    const user = this.userService.getUserById(friendId);
    return user?.name;
  }

  // Get friend's avatar
  getFriendAvatar(friendId: string): string | undefined {
    const user = this.userService.getUserById(friendId);
    return user?.avatar;
  }

  // Get pending friend requests
  pendingRequests = computed(() => {
    const currentUser = this.userService.currentUser();
    return (
      currentUser?.friendships?.filter((f) => f.status === 'pending') || []
    );
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
      const friends = this.getFriends();
      this.friendsSignal.set(friends);
      this.saveFriendsToStorage();
    }
  }

  private saveFriendsToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.friendsSignal());
  }

  private getFriends(): Friend[] {
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
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId || currentUserId === friendId) return;

    this.userService.updateUserFriendships(currentUserId, (friendships) => [
      ...friendships,
      {
        id: `${currentUserId}-${friendId}`,
        userId: currentUserId,
        friendId,
        status: 'pending',
        since: new Date(),
      },
    ]);
  }

  acceptFriendRequest(friendshipId: string) {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return;

    this.userService.updateUserFriendships(currentUserId, (friendships) => {
      const updatedFriendships = friendships.map((f) => {
        if (f.id === friendshipId) {
          return { ...f, status: 'accepted' as const };
        }
        return f;
      });

      // Add follower relationship
      const friendship = friendships.find((f) => f.id === friendshipId);
      if (friendship) {
        this.userService.addFollower(currentUserId, {
          id: `${friendship.userId}-${currentUserId}`,
          userId: currentUserId,
          followerId: friendship.userId,
          since: new Date(),
        });
      }

      return updatedFriendships;
    });
  }

  rejectFriendRequest(friendshipId: string) {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return;

    this.userService.updateUserFriendships(currentUserId, (friendships) =>
      friendships.filter((f) => f.id !== friendshipId)
    );
  }

  removeFriend(friendId: string) {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return;

    this.userService.updateUserFriendships(currentUserId, (friendships) =>
      friendships.filter(
        (f) => !(f.friendId === friendId && f.status === 'accepted')
      )
    );
  }

  isFriend(userId: string): boolean {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return false;
    return currentUser.friendships.some(
      (f) => f.friendId === userId && f.status === 'accepted'
    );
  }

  getMutualFriendsCount(userId: string): number {
    // Implement actual mutual friends logic here
    const currentUser = this.userService.currentUser();
    if (!currentUser) return 0;

    // This is a placeholder - implement your actual mutual friends logic
    return Math.floor(Math.random() * 10) + 1;
  }
}
