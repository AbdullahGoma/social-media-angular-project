import { Routes } from '@angular/router';
import { LayoutContainerComponent } from './layout-container/layout-container.component';

export const LAYOUT_ROUTES: Routes = [
  {
    path: '',
    component: LayoutContainerComponent,
    children: [
      { path: '', redirectTo: 'timeline', pathMatch: 'full' },
      {
        path: 'timeline',
        loadChildren: () =>
          import('../timeline/timeline.routes').then((m) => m.TIMELINE_ROUTES),
      },
      {
        path: 'profile/:id',
        loadChildren: () =>
          import('../profile/profile.routes').then((m) => m.PROFILE_ROUTES),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('../settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
      },
    ],
  },
];
