import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../Services/userService';
import { PictureService } from '../Services/pictureService';
import { UserModel } from '../Model/userModel';

@Component({
  selector: 'app-edituser',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edituser.html',
  styleUrl: './edituser.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edituser implements OnInit {
  /** Bound from the route parameter /mainpage/users/edit/:id (withComponentInputBinding). */
  @Input() id!: string;

  original: UserModel | null = null;
  form = {
    username: '',
    personID: null as number | null,
    currentStatus: true,
    newPassword: '',
    confirmPassword: '',
    signitureimageid: '',
  };

  /** Id of a newly uploaded signature image; null = keep the current signature. */
  newSignatureId: number | null = null;

  loading = true;
  notFound = false;
  saving = false;
  errorMsg = '';
  successMsg = '';

  // Signature replacement
  selectedFile: File | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;
  isUploading = false;
  uploadStatus = '';

  constructor(
    private userservice: UserService,
    private pictureservice: PictureService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUser();
  }

  get initials(): string {
    const name = this.form.username || this.original?.username || '?';
    return name.slice(0, 2).toUpperCase();
  }

  get hasSignature(): boolean {
    const s = this.form.signitureimageid;
    return !!s && s !== 'not uploaded';
  }

  loadUser(): void {
    const userId = Number(this.id);
    this.userservice.getAll().subscribe({
      next: (users) => {
        const user = users.find((u) => u.id === userId);
        if (!user) {
          this.notFound = true;
        } else {
          this.original = user;
          this.form.username = user.username;
          this.form.personID = user.personID;
          this.form.currentStatus = user.currentStatus;
          this.form.signitureimageid = user.signitureimageid;
        }
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Could not load the user. Check that the API is running.';
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
      this.uploadStatus = 'Upload failed: Only PNG and JPG are allowed.';
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
    reader.readAsDataURL(file);
  }

  clearSelection(inputElement: HTMLInputElement): void {
    this.selectedFile = null;
    this.imagePreviewUrl = null;
    inputElement.value = '';
    this.cdr.markForCheck();
  }

  onUpload(): void {
    if (!this.selectedFile) return;
    this.isUploading = true;
    this.pictureservice.addPicture(this.selectedFile).subscribe({
      next: (response) => {
        // addPicture returns the saved image ({ id, fileName, contentType })
        this.newSignatureId = response?.id ?? null;
        this.form.signitureimageid = 'uploaded';
        this.uploadStatus = 'Signature uploaded — it will be applied when you save.';
        this.isUploading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.uploadStatus = 'Upload failed: the server rejected the file.';
        this.isUploading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSave(): void {
    this.errorMsg = '';
    this.successMsg = '';

    if (!this.form.username.trim()) {
      this.errorMsg = 'Username is required.';
      return;
    }
    if (this.form.personID === null || this.form.personID === undefined) {
      this.errorMsg = 'PersonID is required.';
      return;
    }
    if (this.form.newPassword && this.form.newPassword !== this.form.confirmPassword) {
      this.errorMsg = 'The two passwords do not match.';
      return;
    }
    if (this.selectedFile && !this.uploadStatus.startsWith('Signature uploaded')) {
      this.errorMsg = 'Click "Submit Signature" to upload the new signature first, or remove it.';
      return;
    }

    // Matches updateUserDTO in the webapi project.
    const payload = {
      username: this.form.username.trim(),
      personID: this.form.personID,
      currentStatus: this.form.currentStatus,
      // null = keep the current password / signature
      password: this.form.newPassword || null,
      signitureImageId: this.newSignatureId,
    };

    this.saving = true;
    this.userservice.updateUser(Number(this.id), payload).subscribe({
      next: () => {
        this.saving = false;
        this.successMsg = 'User updated.';
        this.cdr.markForCheck();
        setTimeout(() => this.router.navigate(['/mainpage/users']), 700);
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
    this.router.navigate(['/mainpage/users']);
  }
}
