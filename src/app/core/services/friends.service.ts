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

    console.log((this.friendShipsSignal()));
    
    return this.friendShipsSignal().filter(
      (fs) => fs.status === 'accepted' && fs.userId === currentUser.id
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

    console.log(this.friendShipsSignal());
    

    return this.friendShipsSignal().filter(
      (fs) => fs.status === 'pending' && fs.friendId === currentUser.id
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
        id: '3',
        userId: '2',
        friendId: '1',
        status: 'accepted',
        since: twoDaysAgo,
      },
      {
        id: '4',
        userId: '3',
        friendId: '1',
        status: 'accepted',
        since: sevenDaysAgo,
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
    const currentUser = this.userService.currentUser();
    if (!currentUser) return 0;

    const targetUser = this.userService.getUserById(userId);
    if (!targetUser) return 0;

    const currentUserFriends = this.friends().map((f) => f.friendId);
    const targetUserFriends = targetUser.friendships
      .filter((f) => f.status === 'accepted')
      .map((f) => f.friendId);

    return currentUserFriends.filter((id) => targetUserFriends.includes(id))
      .length;
  }
}
