import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { authservice } from './authservice';
import { authInterceptor } from './auth.interceptor';
import { API_BASE } from '../api.config';

/** Builds an unsigned JWT-shaped string; the client only decodes, it never verifies. */
function fakeToken(claims: Record<string, unknown>): string {
  const enc = (o: unknown) =>
    btoa(JSON.stringify(o)).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
  return `${enc({ alg: 'HS256', typ: 'JWT' })}.${enc(claims)}.signature`;
}

const inOneHour = () => Math.floor(Date.now() / 1000) + 3600;

describe('authservice', () => {
  let auth: authservice;
  let cookies: CookieService;
  let http: HttpTestingController;
  let client: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'Login', children: [] }]),
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    auth = TestBed.inject(authservice);
    cookies = TestBed.inject(CookieService);
    http = TestBed.inject(HttpTestingController);
    client = TestBed.inject(HttpClient);
    cookies.deleteAll('/');
    cookies.deleteAll();
  });

  afterEach(() => http.verify());

  it('treats an expired token as signed out', () => {
    cookies.set('auth', fakeToken({ nameid: '1', exp: Math.floor(Date.now() / 1000) - 10 }), { path: '/' });
    expect(auth.isLoggedIn()).toBe(false);
    expect(auth.getToken()).toBeNull();
  });

  it('reads a single role and a role array', () => {
    cookies.set('auth', fakeToken({ nameid: '1', role: 'Admin', exp: inOneHour() }), { path: '/' });
    expect(auth.roles()).toEqual(['Admin']);
    expect(auth.isAdmin()).toBe(true);

    cookies.set('auth', fakeToken({ nameid: '1', role: ['Customer', 'Manager'], exp: inOneHour() }), { path: '/' });
    expect(auth.roles()).toEqual(['Customer', 'Manager']);
    expect(auth.isAdmin()).toBe(false);
  });

  it('stores the token and profile cookies after login', () => {
    const token = fakeToken({ nameid: '7', unique_name: 'sara', role: 'Admin', exp: inOneHour() });
    auth.Login({ email: 'a@b.c', password: 'x' }).subscribe();
    http.expectOne(API_BASE + 'auth/login').flush({ token });

    expect(auth.getToken()).toBe(token);
    expect(cookies.get('id')).toBe('7');
    expect(cookies.get('name')).toBe('sara');
  });

  it('rejects a login response without a real token', () => {
    let failed = false;
    auth.Login({ email: 'a@b.c', password: 'x' }).subscribe({ error: () => (failed = true) });
    http.expectOne(API_BASE + 'auth/login').flush({ token: 'Invalid email or password.' });

    expect(failed).toBe(true);
    expect(auth.isLoggedIn()).toBe(false);
  });

  it('lets admins edit anyone and others only themselves', () => {
    cookies.set('auth', fakeToken({ nameid: '5', role: 'Customer', exp: inOneHour() }), { path: '/' });
    expect(auth.userId()).toBe(5);
    expect(auth.canEditUser(5)).toBe(true);
    expect(auth.canEditUser('5')).toBe(true);
    expect(auth.canEditUser(6)).toBe(false);

    cookies.set('auth', fakeToken({ nameid: '1', role: 'Admin', exp: inOneHour() }), { path: '/' });
    expect(auth.canEditUser(6)).toBe(true);
  });

  it('logout clears the session cookies', () => {
    cookies.set('auth', fakeToken({ nameid: '1', exp: inOneHour() }), { path: '/' });
    cookies.set('id', '1', { path: '/' });
    auth.logout(false);
    expect(cookies.get('auth')).toBe('');
    expect(cookies.get('id')).toBe('');
  });

  describe('interceptor', () => {
    it('adds the bearer token to API calls only', () => {
      const token = fakeToken({ nameid: '1', exp: inOneHour() });
      cookies.set('auth', token, { path: '/' });

      client.get(API_BASE + 'user/getAll').subscribe();
      client.get('https://example.com/other').subscribe();

      expect(http.expectOne(API_BASE + 'user/getAll').request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      expect(http.expectOne('https://example.com/other').request.headers.has('Authorization')).toBe(false);
    });

    it('signs out when the API answers 401', () => {
      cookies.set('auth', fakeToken({ nameid: '1', exp: inOneHour() }), { path: '/' });

      client.get(API_BASE + 'user/getAll').subscribe({ error: () => {} });
      http.expectOne(API_BASE + 'user/getAll').flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(auth.isLoggedIn()).toBe(false);
    });
  });
});
