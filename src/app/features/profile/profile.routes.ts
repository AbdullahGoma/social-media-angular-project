import { Routes } from '@angular/router';
import { ProfileContainerComponent } from './profile-container/profile-container.component';
import { FeedTabComponent } from './tabs/feed-tab/feed-tab.component';
import { AboutTabComponent } from './tabs/about-tab/about-tab.component';
import { FriendsTabComponent } from './tabs/friends-tab/friends-tab.component';
import { PhotosTabComponent } from './tabs/photos-tab/photos-tab.component';
import { FavsTabComponent } from './tabs/favs-tab/favs-tab.component';

export const PROFILE_ROUTES: Routes = [
  {
    path: '',
    component: ProfileContainerComponent,
    children: [
      { path: '', redirectTo: 'feed', pathMatch: 'full' },
      { path: 'feed', component: FeedTabComponent },
      { path: 'about', component: AboutTabComponent },
      { path: 'friends', component: FriendsTabComponent },
      { path: 'photos', component: PhotosTabComponent },
      { path: 'favs', component: FavsTabComponent },
    ],
  },
];
