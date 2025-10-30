import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginRedirectGuard } from './guards/login-redirect.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
    canActivate: [LoginRedirectGuard],
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'school-list',
    loadComponent: () =>
      import('./components/school/school-list.component').then(
        (m) => m.SchoolListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'representative-list',
    loadComponent: () =>
      import('./components/representative/representative-list.component').then(
        (m) => m.RepresentativeListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'class-list',
    loadComponent: () =>
      import('./components/class/class-list.component').then(
        (m) => m.ClassListComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'student-list',
    loadComponent: () =>
      import('./components/student/student-list.component').then(
        (m) => m.StudentListComponent
      ),
    canActivate: [AuthGuard],
  },
  { path: 'login', redirectTo: '' },
  { path: '**', redirectTo: '' },
];
