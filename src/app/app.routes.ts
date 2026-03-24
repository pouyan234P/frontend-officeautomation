import { Routes } from '@angular/router';
import { Login } from './Login/login/login';
export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'Login', // Redirects the root URL to /Login
        pathMatch: 'full' 
    },
    {
        path: 'Login',
        component: Login
    }
];
