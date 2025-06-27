import { Routes } from '@angular/router';
import { LandingComponent } from './features/landing/landing.component';
import { noAuthGuard } from './core/guards/no-auth.guard';
import { NotFoundComponent } from './features/not-found/not-found.component';

export const APP_ROUTES: Routes = [
  {
    path: '',
    component: LandingComponent,
    canActivate: [noAuthGuard],
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
  {
    path: 'not-found',
    component: NotFoundComponent,
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];
