import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';

export const guestGuard: CanActivateFn = (route, state) => {
  const token = inject(TokenService).token;
  const router = inject(Router);
  if (token) {
    return router.createUrlTree(['/dashboard']);
  }
  return true;
};
