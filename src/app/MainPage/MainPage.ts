import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

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
export class MainPage { }
