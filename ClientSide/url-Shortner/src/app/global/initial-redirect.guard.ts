import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from '../services/token-service';

export const initialRedirect: CanActivateFn = (route, state) => {
  const token = inject(TokenService).token;
  const router = inject(Router);
  return token ? router.createUrlTree(['/dashboard']) : router.createUrlTree(['/login']);
};
