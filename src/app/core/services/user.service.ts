import { Injectable, computed, signal } from '@angular/core';
import { About, Follower, Friendship, Photo, User, UserProfile } from '../../shared/models/user';
import { LocalStorageService } from './localtorage.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly STORAGE_KEY = 'social-app-users';
  private readonly CURRENT_USER_KEY = 'social-app-current-user';

  private usersSignal = signal<User[]>([]);
  private currentUserIdSignal = signal<string | null>(null);

  // Public computed signals
  users = this.usersSignal.asReadonly();
  currentUser = computed<User | null>(() => {
    const userId = this.currentUserIdSignal();
    if (!userId) return null;
    return this.usersSignal().find((user) => user.id === userId) || null;
  });

  currentUserProfile = computed<UserProfile | null>(() => {
    const user = this.currentUser();
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      bio: user.bio,
      avatar: user.avatar,
      about: user.about,
      stats: {
        posts: user.posts.length,
        photos: user.photos.length,
        friends: user.friends.length,
        favorites: user.favorites.length,
      },
    };
  });

  constructor(private localStorage: LocalStorageService) {
    this.loadInitialData();
  }

  private loadInitialData() {
    const savedUsers = this.localStorage.getItem<User[]>(this.STORAGE_KEY);
    const currentUserId = this.localStorage.getItem<string>(
      this.CURRENT_USER_KEY
    );

    if (savedUsers && savedUsers.length > 0) {
      this.usersSignal.set(savedUsers);
      if (currentUserId) {
        this.currentUserIdSignal.set(currentUserId);
      }
    } else {
      const defaultUsers = this.generateDefaultUsers();
      this.usersSignal.set(defaultUsers);
      this.currentUserIdSignal.set(defaultUsers[0].id);
      this.saveUsersToStorage();
    }
  }

  private saveUsersToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.usersSignal());
    if (this.currentUserIdSignal()) {
      this.localStorage.setItem(
        this.CURRENT_USER_KEY,
        this.currentUserIdSignal()!
      );
    }
  }

  private generateDefaultUsers(): User[] {
    return [
      {
        id: '1',
        name: 'Abdullah Gomaa',
        bio: 'Web Developer | Angular Specialist',
        avatar:
          'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg',
        email: 'abdullah@example.com',
        about: {
          userId: '1',
          job: 'Web Developer',
          workplace: 'Home',
          location: 'Dakahlia, Egypt',
          playerName: 'Abdullah Gomaa',
          status: 'single',
          education: 'Al-Azhar University',
          phoneNumber: '+201017066934',
        },
        photos: [],
        friends: [],
        friendships: [],
        favorites: [],
        followers: [],
        posts: [],
        comments: [],
        likes: [],
        chats: [],
        stories: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }

  updateProfile(profileData: Partial<User>): void {
    const currentUserId = this.currentUserIdSignal();
    if (!currentUserId) return;

    this.usersSignal.update((users) =>
      users.map((user) =>
        user.id === currentUserId
          ? {
              ...user,
              ...profileData,
              updatedAt: new Date(),
            }
          : user
      )
    );

    this.saveUsersToStorage();
  }

  getUserById(id: string): User | null {
    return this.usersSignal().find((user) => user.id === id) || null;
  }

  getUserProfile(id: string): UserProfile | null {
    const user = this.getUserById(id);
    if (!user) return null;

    return {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      about: user.about,
      stats: {
        posts: user.posts.length,
        photos: user.photos.length,
        friends: user.friends.length,
        favorites: user.favorites.length,
      },
    };
  }

  updateAbout(aboutData: Partial<About>) {
    const currentUserId = this.currentUserIdSignal();
    if (!currentUserId) return;

    this.usersSignal.update((users) =>
      users.map((user) =>
        user.id === currentUserId
          ? {
              ...user,
              about: { ...user.about, ...aboutData },
              updatedAt: new Date(),
            }
          : user
      )
    );
    this.saveUsersToStorage();
  }

  getUserHeaderData(userId: string) {
    const user = this.getUserById(userId);
    if (!user) return null;

    return {
      name: user.name,
      avatar: user.avatar,
      coverImage:
        'https://res.cloudinary.com/dzqc5nfai/image/upload/v1742965630/footer_gcr56t.jpg', // You might want to add this to your User model
      isFriend: this.isFriend(userId),
    };
  }

  getFriends(userId: string): Friendship[] {
    const user = this.getUserById(userId);
    return user?.friendships.filter((f) => f.status === 'accepted') || [];
  }

  getFollowers(userId: string): Follower[] {
    const user = this.getUserById(userId);
    return user?.followers || [];
  }

  isFriend(userId: string): boolean {
    const currentUser = this.currentUser();
    if (!currentUser || !currentUser.friendships) return false;

    return currentUser.friendships.some(
      (f) => f.friendId === userId && f.status === 'accepted'
    );
  }

  sendFriendRequest(friendId: string) {
    const currentUserId = this.currentUserIdSignal();
    if (!currentUserId || currentUserId === friendId) return;

    this.usersSignal.update((users) =>
      users.map((user) => {
        if (user.id === currentUserId) {
          // Add friendship request
          const newFriendship: Friendship = {
            id: `${currentUserId}-${friendId}`,
            userId: currentUserId,
            friendId,
            status: 'pending',
            since: new Date(),
          };
          return {
            ...user,
            friendships: [...user.friendships, newFriendship],
          };
        }
        return user;
      })
    );
    this.saveUsersToStorage();
  }

  acceptFriendRequest(friendshipId: string) {
    const currentUserId = this.currentUserIdSignal();
    if (!currentUserId) return;

    this.usersSignal.update((users) =>
      users.map((user) => {
        if (user.id === currentUserId) {
          // Type-safe update of friendships
          const updatedFriendships = user.friendships.map((f) => {
            if (f.id === friendshipId) {
              return {
                ...f,
                status: 'accepted' as const, // Explicitly type the status
              };
            }
            return f;
          });

          // Find the friendship with proper typing
          const friendship = user.friendships.find(
            (f) => f.id === friendshipId
          );
          if (friendship) {
            const newFollower: Follower = {
              id: `${friendship.userId}-${currentUserId}`,
              userId: currentUserId,
              followerId: friendship.userId,
              since: new Date(),
            };
            return {
              ...user,
              friendships: updatedFriendships,
              followers: [...user.followers, newFollower],
            };
          }
        }
        return user;
      })
    );
    this.saveUsersToStorage();
  }

  addPhoto(photo: Omit<Photo, 'id' | 'createdAt'>) {
    const currentUserId = this.currentUserIdSignal();
    if (!currentUserId) return;

    const newPhoto: Photo = {
      ...photo,
      id: Date.now().toString(),
      createdAt: new Date(),
    };

    this.usersSignal.update((users) =>
      users.map((user) =>
        user.id === currentUserId
          ? {
              ...user,
              photos: [newPhoto, ...user.photos],
              updatedAt: new Date(),
            }
          : user
      )
    );
    this.saveUsersToStorage();
  }
}
