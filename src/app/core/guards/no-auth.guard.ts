import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const noAuthGuard: CanActivateFn = (route, state) => {
  // const authService = inject(AuthService);
  const router = inject(Router);

  // if (authService.isLoggedIn()) {
    // return router.parseUrl('/app/timeline');
  // }
  return true;
};
