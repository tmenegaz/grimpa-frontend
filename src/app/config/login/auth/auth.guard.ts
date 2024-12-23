import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '~entities/login/service/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isAuthenticated = authService.isAuthenticated();
  if (!isAuthenticated) {
    router.navigate(['/login']);
  }
  return isAuthenticated;
};
