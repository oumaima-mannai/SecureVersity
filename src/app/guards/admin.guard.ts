import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = () => {
  const router = inject(Router);
  
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return router.createUrlTree(['/login']);

    const user = JSON.parse(userJson);
    if (user.role === 'ADMIN_SYSTEM') {
      return true;
    }
    
    // Default kick back to standard dashboard if unauthorized
    return router.createUrlTree(['/dashboard']);
  } catch (e) {
    return router.createUrlTree(['/login']);
  }
};
