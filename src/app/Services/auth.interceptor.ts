import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { API_BASE } from '../api.config';
import { authservice } from './authservice';

/**
 * Adds "Authorization: Bearer <token>" to every call to our API (and nowhere else),
 * and signs the user out when the API says the session is no longer valid.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(authservice);
  const isApiCall = req.url.startsWith(API_BASE);
  const token = isApiCall ? auth.getToken() : null;

  const request = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(request).pipe(
    catchError((err: unknown) => {
      const isLogin = req.url.startsWith(API_BASE + 'auth/login');
      if (isApiCall && !isLogin && err instanceof HttpErrorResponse && err.status === 401) {
        auth.logout();
      }
      return throwError(() => err);
    }),
  );
};
