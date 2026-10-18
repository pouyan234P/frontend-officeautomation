import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Newuser } from '../ newuser/ newuser';
import { UserService } from '../Services/userService';
import { UserModel } from '../Model/userModel';
import { FormsModule } from '@angular/forms';
import { PictureService } from '../Services/pictureService';
import { authservice } from '../Services/authservice';
import { RouterLink } from '@angular/router';
import { RoleService } from '../Services/roleService';
import { RoleModel } from '../Model/roleModel';
import { describeApiError } from '../Services/apiError';

@Component({
  selector: 'app-userpage',
  imports: [CommonModule, Newuser, FormsModule, RouterLink],
  templateUrl: './userpage.html',
  styleUrl: './userpage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Userpage implements OnInit {
  myuser: UserModel[] = [];
  roles: RoleModel[] = [];
  newuser: any = this.emptyUser();
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  uploadStatus: string = '';
  isUploading: boolean = false;
  saving = false;
  saveError = '';
  listMessage = '';
  statusFilter: 'all' | 'active' | 'inactive' = 'all';

  // "Role" modal (assign roles to one user)
  roleUser: UserModel | null = null;
  roleSelection: Record<string, boolean> = {};
  roleSaving = false;
  roleError = '';

  ngOnInit(): void {
    this.loaduser();
    this.loadRoles();
  }

  constructor(
    private userservice: UserService,
    private cdr: ChangeDetectorRef,
    private pictureservice: PictureService,
    private myauthservice: authservice,
    private roleservice: RoleService,
  ) {}

  get filteredUsers(): UserModel[] {
    if (this.statusFilter === 'all') return this.myuser;
    const active = this.statusFilter === 'active';
    return this.myuser.filter((u) => !!u.currentStatus === active);
  }

  initials(user: UserModel): string {
    return (user.username || '?').slice(0, 2).toUpperCase();
  }

  roleBadge(role: string): string {
    const name = role.toLowerCase();
    if (name === 'admin') return 'b-purple';
    if (name === 'customer') return 'b-gray';
    return 'b-blue';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Basic validation (the server checks the real file type too)
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        this.uploadStatus = 'Upload failed: Only PNG and JPG are allowed.';
        this.clearSelection(input);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.uploadStatus = 'Upload failed: the image must be 2 MB or smaller.';
        this.clearSelection(input);
        return;
      }

      this.selectedFile = file;
      this.uploadStatus = '';

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviewUrl = reader.result;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  clearSelection(inputElement: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    inputElement.value = '';
    this.cdr.markForCheck();
  }

  isModalOpen = false;
  openModal() {
    this.saveError = '';
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
    this.cdr.markForCheck();
  }

  loaduser() {
    this.userservice.getAll().subscribe({
      next: (data) => {
        this.myuser = data ?? [];
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.listMessage = 'Could not load users: ' + describeApiError(err);
        this.cdr.markForCheck();
      },
    });
  }

  loadRoles() {
    this.roleservice.getAll().subscribe({
      next: (roles) => {
        this.roles = roles ?? [];
        this.cdr.markForCheck();
      },
      error: () => {
        // The page still works without the list; the role picker just falls back to Customer.
        this.roles = [];
        this.cdr.markForCheck();
      },
    });
  }

  onSave() {
    this.saveError = '';
    if (this.selectedFile && !this.newuser.signitureid) {
      this.saveError = 'Click "Submit Signature" to upload the signature first, or remove it.';
      return;
    }

    this.saving = true;
    this.myauthservice.register(this.newuser).subscribe({
      next: () => {
        this.saving = false;
        this.listMessage = `User “${this.newuser.name ?? ''} ${this.newuser.family ?? ''}” created.`;
        this.newuser = this.emptyUser();
        this.selectedFile = null;
        this.imagePreviewUrl = null;
        this.uploadStatus = '';
        this.closeModal();
        this.loaduser();
        this.loadRoles();
      },
      error: (error) => {
        this.saving = false;
        this.saveError = describeApiError(error);
        this.cdr.markForCheck();
      },
    });
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.isUploading = true;
    this.pictureservice.addPicture(this.selectedFile).subscribe({
      next: (response) => {
        this.newuser.signitureid = response;
        this.uploadStatus = 'Signature uploaded.';
        this.isUploading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isUploading = false;
        this.uploadStatus = 'Upload failed: ' + describeApiError(err);
        this.cdr.markForCheck();
      },
    });
  }

  // ─── Role assignment ─────────────────────────────────────────────

  openRoles(user: UserModel): void {
    this.roleUser = user;
    this.roleError = '';
    const current = new Set((user.roles ?? []).map((r) => r.toLowerCase()));
    this.roleSelection = {};
    for (const role of this.roles) {
      this.roleSelection[role.name] = current.has(role.name.toLowerCase());
    }
    this.cdr.markForCheck();
  }

  closeRoles(): void {
    this.roleUser = null;
    this.cdr.markForCheck();
  }

  saveRoles(): void {
    if (!this.roleUser) return;
    const user = this.roleUser;
    const chosen = Object.keys(this.roleSelection).filter((name) => this.roleSelection[name]);

    this.roleSaving = true;
    this.roleError = '';
    this.roleservice.setUserRoles(user.id, chosen).subscribe({
      next: () => {
        this.roleSaving = false;
        user.roles = chosen;
        this.listMessage = `Roles updated for ${user.username}.`;
        this.roleUser = null;
        this.loadRoles(); // refresh user counts
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.roleSaving = false;
        this.roleError = describeApiError(err);
        this.cdr.markForCheck();
      },
    });
  }

  private emptyUser() {
    return { currentStatus: true, role: 'Customer' } as any;
  }
}
