import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginRedirectGuard } from './guards/login-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    canActivate: [LoginRedirectGuard]
  },
  { path: 'login', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
