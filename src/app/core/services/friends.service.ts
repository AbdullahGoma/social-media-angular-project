import { computed, inject, Injectable, signal } from '@angular/core';
import { UserService } from './user.service';
import { LocalStorageService } from './localtorage.service';
import { Friend, Friendship } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private readonly STORAGE_KEY = 'social-app-user-friends';
  private userService = inject(UserService);
  private localStorage = inject(LocalStorageService);

  private friendShipsSignal = signal<Friendship[]>([]);

  // Get accepted friendships
  friends = computed(() => {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return [];

    return this.friendShipsSignal().filter(
      (fs) =>
        fs.status === 'accepted' &&
        (fs.userId === currentUser.id || fs.friendId === currentUser.id)
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
    if (!currentUser) return [];

    return this.friendShipsSignal().filter(
      (fs) =>
        fs.status === 'pending' &&
        (fs.userId === currentUser.id || fs.friendId === currentUser.id)
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
    const savedFriendShips = this.localStorage.getItem<Friendship[]>(
      this.STORAGE_KEY
    );
    if (savedFriendShips) {
      this.friendShipsSignal.set(savedFriendShips);
    } else {
      const friendships = this.getFriendships();
      this.friendShipsSignal.set(friendships);
      this.saveFriendsToStorage();
    }
  }

  private saveFriendsToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.friendShipsSignal());
  }

  private getFriendships(): Friendship[] {
    const sevenDaysAgo = new Date(Date.now() - 86400000 * 7);
    const fourteenDaysAgo = new Date(Date.now() - 86400000 * 14);
    const twoDaysAgo = new Date(Date.now() - 86400000 * 2);

    return [
      // User 1's friendships
      {
        id: '1',
        userId: '1',
        friendId: '2',
        status: 'accepted',
        since: sevenDaysAgo,
      },
      {
        id: '2',
        userId: '1',
        friendId: '3',
        status: 'accepted',
        since: fourteenDaysAgo,
      },
      {
        id: '5',
        userId: '4',
        friendId: '1',
        status: 'pending',
        since: fourteenDaysAgo,
      },
      {
        id: '6',
        userId: '5',
        friendId: '1',
        status: 'pending',
        since: fourteenDaysAgo,
      },
    ];
  }

  sendFriendRequest(friendId: string) {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId || currentUserId === friendId) return;

    const newFriendship: Friendship = {
      id: `${currentUserId}-${friendId}`,
      userId: currentUserId,
      friendId,
      status: 'pending',
      since: new Date(),
    };

    this.friendShipsSignal.update((friendships) => [
      ...friendships,
      newFriendship,
    ]);
    this.saveFriendsToStorage();
  }

  acceptFriendRequest(friendshipId: string) {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return;

    this.friendShipsSignal.update((friendships) => {
      const friendship = friendships.find((f) => f.id === friendshipId);
      if (!friendship) return friendships;

      const updatedFriendships = friendships.map((f) =>
        f.id === friendshipId ? { ...f, status: 'accepted' as const } : f
      );

      const reciprocalExists = friendships.some(
        (f) =>
          (f.userId === currentUserId && f.friendId === friendship.userId && f.status === 'accepted') ||
          (f.userId === friendship.userId && f.friendId === currentUserId && f.status === 'accepted')
      );

      if (!reciprocalExists) {
        updatedFriendships.push({
          id: `${currentUserId}-${friendship.userId}`,
          userId: currentUserId,
          friendId: friendship.userId,
          status: 'accepted',
          since: new Date(),
        });
      }

      return updatedFriendships;
    });

    this.saveFriendsToStorage();
  }

  rejectFriendRequest(friendshipId: string) {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return;

    this.friendShipsSignal.update((friendships) =>
      friendships.filter((f) => f.id !== friendshipId)
    );
    this.saveFriendsToStorage();
  }

  removeFriend(friendId: string) {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return;

    this.friendShipsSignal.update((friendships) =>
      friendships.filter(
        (f) =>
          !(
            (f.userId === currentUserId && f.friendId === friendId) ||
            (f.userId === friendId && f.friendId === currentUserId)
          )
      )
    );
    this.saveFriendsToStorage();
  }

  isFriend(userId: string): boolean {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return false;

    return this.friendShipsSignal().some(
      (f) =>
        f.userId === currentUserId &&
        f.friendId === userId &&
        f.status === 'accepted'
    );
  }

  getMutualFriendsCount(userId: string): number {
    const currentUserId = this.userService.currentUserId();
    if (!currentUserId) return 0;

    const currentUserFriends = this.friendShipsSignal()
      .filter((f) => f.userId === currentUserId && f.status === 'accepted')
      .map((f) => f.friendId);

    const targetUserFriends = this.friendShipsSignal()
      .filter((f) => f.userId === userId && f.status === 'accepted')
      .map((f) => f.friendId);

    return currentUserFriends.filter((id) => targetUserFriends.includes(id))
      .length;
  }
}
