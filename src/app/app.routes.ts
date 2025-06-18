import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./features/layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
    children: [
      { path: '', redirectTo: 'timeline', pathMatch: 'full' },
      {
        path: 'timeline',
        loadChildren: () =>
          import('./features/timeline/timeline.routes').then(
            (m) => m.TIMELINE_ROUTES
          ),
      },
      {
        path: 'profile/:id',
        loadChildren: () =>
          import('./features/profile/profile.routes').then(
            (m) => m.PROFILE_ROUTES
          ),
      },
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (m) => m.SETTINGS_ROUTES
          ),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: 'timeline' },
];
