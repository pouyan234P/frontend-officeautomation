import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { API_BASE } from '../api.config';

/** Claims the auth service puts in the token (short JWT names). */
interface TokenClaims {
  nameid?: string;
  unique_name?: string;
  email?: string;
  role?: string | string[];
  exp?: number;
}

const TOKEN_COOKIE = 'auth';

@Injectable({
  providedIn: 'root',
})
export class authservice {
  private http = inject(HttpClient);
  private cookieService = inject(CookieService);
  private router = inject(Router);
  private baseurl = API_BASE + 'auth/';

  /** Logs in and stores the token. Errors (wrong password, inactive account…) reach the caller's error handler. */
  Login(model: { email?: string; password?: string }): Observable<void> {
    return this.http.post<{ token: string }>(this.baseurl + 'login', model).pipe(
      map((response) => {
        if (!response?.token || !this.decode(response.token)) {
          throw new Error('The server did not return a valid token.');
        }
        this.storeSession(response.token);
      }),
    );
  }

  /** Creates a user (Admin only on the server). */
  register(user: any) {
    return this.http.post(this.baseurl + 'register', user);
  }

  logout(redirect = true): void {
    for (const name of [TOKEN_COOKIE, 'id', 'name']) {
      this.cookieService.delete(name, '/');
      this.cookieService.delete(name); // cookies written by older builds without a path
    }
    if (redirect) {
      this.router.navigate(['/Login']);
    }
  }

  getToken(): string | null {
    const token = this.cookieService.get(TOKEN_COOKIE);
    return token && this.claims(token) ? token : null;
  }

  /** True when a token exists and has not expired. */
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  roles(): string[] {
    const token = this.getToken();
    const role = token ? this.claims(token)?.role : undefined;
    if (!role) return [];
    return Array.isArray(role) ? role : [role];
  }

  hasRole(role: string): boolean {
    return this.roles().some((r) => r.toLowerCase() === role.toLowerCase());
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  /** The signed-in user's id (from the token), or null. */
  userId(): number | null {
    const token = this.getToken();
    const id = token ? Number(this.claims(token)?.nameid) : NaN;
    return Number.isFinite(id) ? id : null;
  }

  /** Admins can edit anyone; everyone else only their own account. */
  canEditUser(id: number | string): boolean {
    return this.isAdmin() || this.userId() === Number(id);
  }

  userName(): string {
    const token = this.getToken();
    return (token && this.claims(token)?.unique_name) || '';
  }

  /** Re-writes the id/name helper cookies other pages read, from the (trusted) token. */
  refreshProfileCookies(): void {
    const token = this.getToken();
    const claims = token ? this.claims(token) : null;
    if (!claims?.nameid) return;
    const options = this.cookieOptions(claims.exp);
    this.cookieService.set('id', claims.nameid, options);
    this.cookieService.set('name', claims.unique_name ?? '', options);
  }

  private storeSession(token: string): void {
    const claims = this.decode(token);
    this.cookieService.set(TOKEN_COOKIE, token, this.cookieOptions(claims?.exp));
    this.refreshProfileCookies();
  }

  private cookieOptions(exp?: number) {
    return {
      path: '/',
      // the cookie disappears when the token does
      expires: exp ? new Date(exp * 1000) : undefined,
      // only sent over HTTPS when the app itself is served over HTTPS
      secure: typeof location !== 'undefined' && location.protocol === 'https:',
      sameSite: 'Strict' as const,
    };
  }

  /** Decoded claims if the token is well-formed and not expired, otherwise null. */
  private claims(token: string): TokenClaims | null {
    const claims = this.decode(token);
    if (!claims) return null;
    if (claims.exp && claims.exp * 1000 <= Date.now()) return null;
    return claims;
  }

  private decode(token: string): TokenClaims | null {
    try {
      return jwtDecode<TokenClaims>(token);
    } catch {
      return null;
    }
  }
}
