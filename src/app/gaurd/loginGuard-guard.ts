import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from "jwt-decode";

export const loginGuardGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);

  // 1. Get the token string from the cookie FIRST
  const token = cookieService.get('auth');

  // 2. Check if we actually got a token
  if (token) {
    try {
      // 3. Decode the token safely (jwtDecode returns the object directly)
      const decodedToken: any = jwtDecode(token);
      
      // 4. Set the new cookie if the nameid exists
      if (decodedToken && decodedToken.nameid) {
        cookieService.set("id", decodedToken.nameid);
        cookieService.set("name",decodedToken.unique_name);
      }

      // 5. Let the user access the route
      return true;

    } catch (error) {
      // If the token is malformed, jwtDecode will fail. Treat as unauthorized.
      console.error("Token decoding failed:", error);
      return router.createUrlTree(['/Login'], {
        queryParams: { returnUrl: state.url }
      });
    }
  } else {
    // 6. No token found. Redirect to the login page.
    return router.createUrlTree(['/Login'], {
      queryParams: { returnUrl: state.url }
    });
  }
};
