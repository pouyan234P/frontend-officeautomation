import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PositionService } from '../Services/positionService';
import { DepartmentService } from '../Services/departmentService';
import { UserService } from '../Services/userService';
import { GetPosition } from '../Model/getPosition';
import { GetDepartmentModel } from '../Model/getDepartmentModel';
import { UserModel } from '../Model/userModel';

@Component({
  selector: 'app-editposition',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editposition.html',
  styleUrl: './editposition.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Editposition implements OnInit {
  /** Bound from the route parameter /mainpage/positions/edit/:id (withComponentInputBinding). */
  @Input() id!: string;

  original: GetPosition | null = null;
  departments: GetDepartmentModel[] = [];
  users: UserModel[] = [];

  form = {
    Title: '',
    departmentId: null as number | null,
    userId: null as number | null,
  };

  loading = true;
  notFound = false;
  saving = false;
  errorMsg = '';
  successMsg = '';

  constructor(
    private posservice: PositionService,
    private depservice: DepartmentService,
    private userservice: UserService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const posId = Number(this.id);
    forkJoin({
      positions: this.posservice.getAll(),
      departments: this.depservice.getDepartment(),
      users: this.userservice.getAll(),
    }).subscribe({
      next: ({ positions, departments, users }) => {
        this.departments = departments;
        this.users = users;
        const pos = positions.find((p) => p.id === posId);
        if (!pos) {
          this.notFound = true;
        } else {
          this.original = pos;
          this.form.Title = pos.title;
          this.form.departmentId = pos.depID?.id ?? null;
          this.form.userId = pos.userID?.id ?? null;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Could not load the position. Check that the API is running.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  /**
   * Users that can be picked as holder: anyone without a position yet,
   * plus whoever holds this position right now (so it stays selectable).
   */
  get availableUsers(): UserModel[] {
    const currentHolderId = this.original?.userID?.id;
    return this.users.filter((u) => !u.title || u.id === currentHolderId);
  }

  get departmentName(): string {
    return this.departments.find((d) => d.id === this.form.departmentId)?.name ?? '—';
  }

  onSave(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.form.Title.trim()) {
      this.errorMsg = 'Title is required.';
      return;
    }
    if (this.form.departmentId === null) {
      this.errorMsg = 'Please choose a department.';
      return;
    }
    if (this.form.userId === null) {
      this.errorMsg = 'Please choose the user who holds this position.';
      return;
    }

    // Same field names as the "New Position" form uses for insertPosition (setPosition DTO).
    const payload = {
      Title: this.form.Title.trim(),
      departmentId: this.form.departmentId,
      userId: this.form.userId,
    };

    this.saving = true;
    this.posservice.updatePosition(Number(this.id), payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'Position updated.';
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/mainpage/positions']), 700);
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
        this.errorMsg = 'Saving failed: ' + this.describeError(err);
        this.cdr.markForCheck();
      },
    });
  }

  /** The API returns a list of messages on 400 Bad Request. */
  private describeError(err: any): string {
    const body = err?.error;
    if (Array.isArray(body) && body.length) return body.join(' ');
    if (typeof body === 'string' && body) return body;
    return body?.message || err?.statusText || 'unknown error';
  }

  cancel(): void {
    this.router.navigate(['/mainpage/positions']);
  }
}
