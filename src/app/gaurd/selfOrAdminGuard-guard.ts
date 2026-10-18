import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { authservice } from '../Services/authservice';

/** /users/edit/:id — admins can open anyone, everyone else only their own account. */
export const selfOrAdminGuard: CanActivateFn = (route) => {
  const auth = inject(authservice);
  const router = inject(Router);
  return auth.canEditUser(route.paramMap.get('id') ?? '') ? true : router.createUrlTree(['/mainpage/users']);
};
