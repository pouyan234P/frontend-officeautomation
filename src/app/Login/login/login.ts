import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { authservice } from '../../Services/authservice';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgeReel } from '../../forge-reel/forge-reel';
import { describeApiError } from '../../Services/apiError';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ForgeReel],
  templateUrl: `./login.html`,
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  Login: { email?: string; password?: string } = {};
  errorMsg = '';
  busy = false;

  constructor(
    private auth: authservice,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigateByUrl(this.returnUrl());
    }
  }

  handleSubmit() {
    this.errorMsg = '';
    if (!this.Login.email || !this.Login.password) {
      this.errorMsg = 'Enter your email and password.';
      return;
    }

    this.busy = true;
    this.auth.Login(this.Login).subscribe({
      next: () => {
        this.busy = false;
        this.Login.password = '';
        this.router.navigateByUrl(this.returnUrl());
      },
      error: (error) => {
        this.busy = false;
        this.errorMsg = describeApiError(error);
        this.cdr.markForCheck();
      },
    });
  }

  /** Only follow in-app paths, never an absolute URL from the query string (open redirect). */
  private returnUrl(): string {
    const url = this.route.snapshot.queryParamMap.get('returnUrl');
    return url && url.startsWith('/') && !url.startsWith('//') ? url : '/mainpage';
  }
}
