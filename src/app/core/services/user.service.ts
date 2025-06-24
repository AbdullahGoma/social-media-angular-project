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
    const defaultUsers = [
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
        friendships: [
          {
            id: '1-2',
            userId: '1',
            friendId: '2',
            status: 'accepted',
            since: new Date(Date.now() - 86400000 * 7), // 7 days ago
          },
          {
            id: '1-3',
            userId: '1',
            friendId: '3',
            status: 'accepted',
            since: new Date(Date.now() - 86400000 * 14), // 14 days ago
          },
          // Add some pending requests
          {
            id: '4-1',
            userId: '4',
            friendId: '1',
            status: 'pending',
            since: new Date(Date.now() - 86400000 * 2), // 2 days ago
          },
        ],
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
      // Add some friends
      {
        id: '2',
        name: 'Ahmed Shtewy',
        bio: 'Be Strong!',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        email: 'ahmed@example.com',
        about: {
          userId: '2',
          job: 'Doctor',
          workplace: 'Tech Company',
          location: 'Cairo, Egypt',
          playerName: 'Ahmed',
          status: 'single',
          education: 'Cairo University',
          phoneNumber: '+20123456789',
        },
        photos: [],
        friends: [],
        friendships: [
          {
            id: '2-1',
            userId: '2',
            friendId: '1',
            status: 'accepted',
            since: new Date(Date.now() - 86400000 * 7), // 7 days ago
          },
        ],
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
      {
        id: '3',
        name: 'Mohamed Ali',
        bio: 'UI/UX Designer',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
        email: 'mohamed@example.com',
        about: {
          userId: '3',
          job: 'UI/UX Designer',
          workplace: 'Design Studio',
          location: 'Alexandria, Egypt',
          playerName: 'Mohamed',
          status: 'married',
          education: 'Alexandria University',
          phoneNumber: '+20123456790',
        },
        photos: [],
        friends: [],
        friendships: [
          {
            id: '3-1',
            userId: '3',
            friendId: '1',
            status: 'accepted',
            since: new Date(Date.now() - 86400000 * 14), // 14 days ago
          },
        ],
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
      // Add more friends as needed
    ] as const satisfies User[];

    return defaultUsers;
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

  currentUserId(): string | null {
    return this.currentUserIdSignal();
  }

  updateUserFriendships(
    userId: string,
    updateFn: (friendships: Friendship[]) => Friendship[]
  ) {
    this.usersSignal.update((users) =>
      users.map((user) =>
        user.id === userId
          ? { ...user, friendships: updateFn(user.friendships) }
          : user
      )
    );
    this.saveUsersToStorage();
  }

  addFollower(userId: string, follower: Follower) {
    this.usersSignal.update((users) =>
      users.map((user) =>
        user.id === userId
          ? { ...user, followers: [...user.followers, follower] }
          : user
      )
    );
    this.saveUsersToStorage();
  }
}
