import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { authservice } from '../Services/authservice';

/**
 * Creating roles, assigning roles and creating/assigning positions are Admin-only on
 * the server; this keeps non-admins off pages that would only show permission errors.
 */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(authservice);
  const router = inject(Router);
  return auth.isAdmin() ? true : router.createUrlTree(['/mainpage/letters']);
};
