import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Roles } from './roles';
import { API_BASE } from '../api.config';

describe('Roles page', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Roles],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  function create() {
    const fixture = TestBed.createComponent(Roles);
    fixture.detectChanges();
    http.expectOne(API_BASE + 'role/getAll').flush([
      { id: 1, name: 'Admin', userCount: 1 },
      { id: 2, name: 'Customer', userCount: 4 },
    ]);
    fixture.detectChanges();
    return fixture;
  }

  it('lists the roles', () => {
    const fixture = create();
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('Admin');
    expect(text).toContain('Customer');
    expect(fixture.componentInstance.totalAssignments).toBe(5);
  });

  it('flags invalid and duplicate names before sending', () => {
    const page = create().componentInstance;
    page.newName = '1abc';
    expect(page.nameProblem).toContain('Start with a letter');
    page.newName = 'admin';
    expect(page.nameProblem).toContain('already exists');
    page.onCreate();
    http.expectNone(API_BASE + 'role/create');
  });

  it('creates a role and reloads the list', () => {
    const page = create().componentInstance;
    page.newName = '  Manager ';
    page.onCreate();

    const req = http.expectOne(API_BASE + 'role/create');
    expect(req.request.body).toEqual({ name: 'Manager' });
    req.flush({ success: true });

    http.expectOne(API_BASE + 'role/getAll').flush([]);
    expect(page.successMsg).toContain('Manager');
    expect(page.newName).toBe('');
  });

  it('shows the server error', () => {
    const page = create().componentInstance;
    page.newName = 'Manager';
    page.onCreate();
    http.expectOne(API_BASE + 'role/create').flush(["Role 'Manager' already exists."], { status: 400, statusText: 'Bad Request' });
    expect(page.errorMsg).toContain('already exists');
  });
});
