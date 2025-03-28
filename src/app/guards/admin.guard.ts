import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    take(1), // Take only the latest value and complete
    map(user => {
      // If user is authenticated and has admin role
      if (user) {
        // Optional: Add role check if needed
        // if (user.role === 'admin') return true;
        return true;
      }

      // Redirect to login with return URL
      return router.createUrlTree(
        ['/auth/login'], 
        { queryParams: { returnUrl: state.url } }
      );
    })
  );
};
