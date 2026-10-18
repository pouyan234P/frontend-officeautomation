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
import { Edituser } from './edituser/edituser';
import { Editposition } from './editposition/editposition';
import { Roles } from './roles/roles';
import { adminGuard } from './gaurd/adminGuard-guard';
import { selfOrAdminGuard } from './gaurd/selfOrAdminGuard-guard';
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
      // admins edit anyone; everyone else only their own account (the API enforces this too)
      { path: 'users/edit/:id',     component: Edituser, canActivate: [selfOrAdminGuard] },
      // creating roles / assigning roles and positions is Admin-only (the API enforces this too)
      { path: 'roles',       component: Roles, canActivate: [adminGuard] },
      { path: 'orgchart',    component: Orgchart },
      { path: 'positions',   component: Position },
      { path: 'positions/edit/:id', component: Editposition, canActivate: [adminGuard] },
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
  },
  { path: '**', redirectTo: 'Login' }
];
