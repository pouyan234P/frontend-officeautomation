import { Routes } from '@angular/router';
import { Login } from './Login/login/login';
import { MainPage } from './MainPage/MainPage';
import { Userpage } from './userpage/userpage';
import { Orgchart } from './orgchart/orgchart';
import { Position } from './position/position';
import { Letter } from './letter/letter';
import { Composeletter } from './composeletter/composeletter';
import { Attachment } from './attachment/attachment';
import { Indicator } from './indicator/indicator';
import { Dashboard } from './dashboard/dashboard';
import { loginGuardGuard } from './gaurd/loginGuard-guard';
import { Approve } from './approve/approve';
import { Senderletter } from './senderletter/senderletter';
export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'Login', // Redirects the root URL to /Login
        pathMatch: 'full' 
    },
    {
        path: 'Login',
        component: Login
    },
    {
    path: 'mainpage',
    component: MainPage, 
    canActivate: [loginGuardGuard],       // ← shell with sidebar
    children: [                 // ← these load inside <router-outlet>
      { path: '', redirectTo: 'users', pathMatch: 'full' },
      { path: 'users',       component: Userpage },
      { path: 'orgchart',    component: Orgchart },
      { path: 'positions',   component: Position },
      { path: 'letters',     component: Letter },
      { path: 'newletter',   component: Composeletter },
      { path: 'attachments', component: Attachment },
      { path: 'indicator',   component: Indicator },
      { path: 'dashboard',   component: Dashboard },
      {path: 'senderletter', component: Senderletter}
    ]
  },
  {
    path: 'approved',
    component: Approve
  }
];
