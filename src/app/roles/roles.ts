import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RoleModel } from '../Model/roleModel';
import { RoleService } from '../Services/roleService';
import { describeApiError } from '../Services/apiError';

/** Same rule the API validates with (createRoleCommandValidator). */
const ROLE_NAME_PATTERN = /^[A-Za-z][A-Za-z0-9 _-]*$/;
const BUILT_IN = ['admin', 'customer'];

@Component({
  selector: 'app-roles',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './roles.html',
  styleUrl: './roles.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Roles implements OnInit, AfterViewInit {
  /** ?create=1 (from the Users page "New Role" button) puts the cursor in the name field. */
  @Input() create?: string;

  @ViewChild('nameInput') nameInput?: ElementRef<HTMLInputElement>;

  roles: RoleModel[] = [];
  loading = true;
  loadError = '';

  newName = '';
  saving = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private roleService: RoleService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    if (this.create) {
      setTimeout(() => this.nameInput?.nativeElement.focus());
    }
  }

  get totalAssignments(): number {
    return this.roles.reduce((sum, r) => sum + (r.userCount ?? 0), 0);
  }

  isBuiltIn(role: RoleModel): boolean {
    return BUILT_IN.includes(role.name.toLowerCase());
  }

  badgeClass(role: RoleModel): string {
    const name = role.name.toLowerCase();
    if (name === 'admin') return 'b-purple';
    if (name === 'customer') return 'b-gray';
    return 'b-blue';
  }

  loadRoles(): void {
    this.loading = true;
    this.loadError = '';
    this.roleService.getAll().subscribe({
      next: (roles) => {
        this.roles = roles ?? [];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.loadError = 'Could not load roles: ' + describeApiError(err);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /** Inline check shown while typing; the server validates the same rules. */
  get nameProblem(): string {
    const name = this.newName.trim();
    if (!name) return '';
    if (name.length > 50) return 'Use at most 50 characters.';
    if (!ROLE_NAME_PATTERN.test(name)) return 'Start with a letter; use only letters, digits, spaces, - or _.';
    if (this.roles.some((r) => r.name.toLowerCase() === name.toLowerCase())) return `“${name}” already exists.`;
    return '';
  }

  onCreate(): void {
    this.errorMsg = '';
    this.successMsg = '';
    const name = this.newName.trim();
    if (!name) {
      this.errorMsg = 'Enter a role name.';
      return;
    }
    if (this.nameProblem) {
      this.errorMsg = this.nameProblem;
      return;
    }

    this.saving = true;
    this.roleService.create(name).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = `Role “${name}” created. Assign it to people from the Users page.`;
        this.newName = '';
        this.cdr.markForCheck();
        this.loadRoles();
      },
      error: (err) => {
        this.saving = false;
        this.errorMsg = 'Could not create the role: ' + describeApiError(err);
        this.cdr.markForCheck();
      },
    });
  }
}
