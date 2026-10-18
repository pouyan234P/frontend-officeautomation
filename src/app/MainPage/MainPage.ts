import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReferralService } from '../Services/referralService';
import { CookieService } from 'ngx-cookie-service';
import { ReferralModel } from '../Model/referralModel';
import { referralStatusenum } from '../Model/enumreferral/referralStatusenum';
import { authservice } from '../Services/authservice';

@Component({
  selector: 'app-main-page',
  imports: [
    RouterOutlet,      // ← enables <router-outlet>
    RouterLink,        // ← enables routerLink="..."
    RouterLinkActive,],
  templateUrl: './MainPage.html',
  styleUrl: './MainPage.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainPage implements OnInit {
  name: string |undefined;
  userId = '';
  isAdmin = false;
  roleLabel = '';
  myref: ReferralModel[]=[];
  unreadCount: number = 0; // Added property to track the unread count
  ngOnInit(): void {
    this.loadref();
  }
  constructor(private refservice: ReferralService,private cdr: ChangeDetectorRef,private cookie:CookieService,private auth: authservice)
  {
    this.name = this.auth.userName() || this.cookie.get('name');
    this.userId = this.cookie.get('id');
    this.isAdmin = this.auth.isAdmin();
    const roles = this.auth.roles();
    this.roleLabel = roles.length ? roles.join(', ') : 'No role';
  }

  get initials(): string {
    return (this.name || '?').slice(0, 2).toUpperCase();
  }

  signOut(): void {
    this.auth.logout();
  }
  loadref()
  {
    this.refservice.getAllByReciver(+this.cookie.get('id')).subscribe(
      {
        next: (data)=>
        {
          this.myref=data;
          this.unreadCount = this.myref.filter(ref => ref.status === 0).length;
          this.cdr.markForCheck();
        }
      });
  }
}
