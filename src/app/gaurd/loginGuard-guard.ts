import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { authservice } from '../Services/authservice';

/** Lets signed-in users through; expired or malformed tokens are cleared and sent to the login page. */
export const loginGuardGuard: CanActivateFn = (route, state) => {
  const auth = inject(authservice);
  const router = inject(Router);

  if (auth.isLoggedIn()) {
    auth.refreshProfileCookies();
    return true;
  }

  auth.logout(false);
  return router.createUrlTree(['/Login'], {
    queryParams: { returnUrl: state.url },
  });
};
