import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ReferralService } from '../Services/referralService';
import { CookieService } from 'ngx-cookie-service';
import { ReferralModel } from '../Model/referralModel';
import { referralStatusenum } from '../Model/enumreferral/referralStatusenum';

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
  myref: ReferralModel[]=[];
  unreadCount: number = 0; // Added property to track the unread count
  ngOnInit(): void {
    this.loadref();
  }
  constructor(private refservice: ReferralService,private cdr: ChangeDetectorRef,private cookie:CookieService)
  {
    this.name=this.cookie.get('name');
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
