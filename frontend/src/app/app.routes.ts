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
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'school-list',
    loadComponent: () =>
      import('./school/school-list.component').then(
        (m) => m.SchoolListComponent
      ),
  },
  {
    path: 'representative-list',
    loadComponent: () =>
      import('./representative/representative-list.component').then(
        (m) => m.RepresentativeListComponent
      ),
  },
  {
    path: 'class-list',
    loadComponent: () =>
      import('./class/class-list.component').then(
        (m) => m.ClassListComponent
      ),
  },
  {
    path: 'student-list',
    loadComponent: () =>
      import('./student/student-list.component').then(
        (m) => m.StudentListComponent
      ),
  },
  { path: 'login', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
