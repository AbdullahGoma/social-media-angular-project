import { inject, Injectable, signal } from '@angular/core';
import { UserService } from './user.service';
import { LocalStorageService } from './localtorage.service';
import { Photo } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private readonly STORAGE_KEY = 'social-app-user-photos';
  private userService = inject(UserService);
  private localStorage = inject(LocalStorageService);

  private photosSignal = signal<Photo[]>([]);
  photos = this.photosSignal.asReadonly();

  constructor() {
    this.loadInitialPhotos();
  }

  private loadInitialPhotos() {
    const savedPhotos = this.localStorage.getItem<Photo[]>(this.STORAGE_KEY);
    if (savedPhotos) {
      this.photosSignal.set(savedPhotos);
    } else {
      const defaultPhotos = this.generateDefaultPhotos();
      this.photosSignal.set(defaultPhotos);
      this.savePhotosToStorage();
    }
  }

  private savePhotosToStorage() {
    this.localStorage.setItem(this.STORAGE_KEY, this.photosSignal());
  }

  private generateDefaultPhotos(): Photo[] {
    return [
      {
        userId: '1',
        id: '1',
        url: 'https://res.cloudinary.com/dzqc5nfai/image/upload/v1743787413/tasiqt2dkqhjjmomflna.jpg',
        caption: 'Profile picture',
        createdAt: new Date(),
      },
      {
        userId: '1',
        id: '2',
        url: 'https://res.cloudinary.com/dzqc5nfai/image/upload/v1742965630/footer_gcr56t.jpg',
        caption: 'Cover photo',
        createdAt: new Date(),
      },
    ];
  }

  addPhoto(photo: Omit<Photo, 'id' | 'createdAt'>) {
    const newPhoto: Photo = {
      ...photo,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    this.photosSignal.update((photos) => [newPhoto, ...photos]);
    this.savePhotosToStorage();
  }

  removePhoto(photoId: string) {
    this.photosSignal.update((photos) =>
      photos.filter((p) => p.id !== photoId)
    );
    this.savePhotosToStorage();
  }
}