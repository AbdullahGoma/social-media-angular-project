import { computed, inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { About } from '../../shared/models/user';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private userService = inject(UserService);

  about = computed<About | null>(() => {
    const user = this.userService.currentUser();
    return user ? user.about : null;
  });

  updateAbout(aboutData: Partial<Omit<About, 'userId'>>) {
    const currentUser = this.userService.currentUser();
    if (!currentUser) return;

    this.userService.updateProfile({
      about: {
        ...currentUser.about,
        ...aboutData,
      },
    });
  }
}
