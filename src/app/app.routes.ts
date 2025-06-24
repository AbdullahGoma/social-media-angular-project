import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'app',
    loadChildren: () =>
      import('./features/layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  { path: '**', redirectTo: '' },
];
