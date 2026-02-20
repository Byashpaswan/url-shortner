import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';

export const authGuard: CanActivateFn = (route, state) => {
  const token = inject(TokenService).token;
  const router = inject(Router);

  if (!token) {
    router.navigate(['/login']);
    return false;
  }
  return true;
};
