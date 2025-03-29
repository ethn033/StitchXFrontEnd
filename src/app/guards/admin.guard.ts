import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {

  console.log('Checking access for:', state.url);
  const authService = inject(AuthService);

  return authService.getCurrentUser().pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      }
      return false;
    })
  );
};
