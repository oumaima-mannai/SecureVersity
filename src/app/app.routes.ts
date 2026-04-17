import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'audit',
    loadComponent: () =>
      import('./pages/audit/audit.component').then(m => m.AuditComponent),
  },
  {
    path: 'results',
    loadComponent: () =>
      import('./pages/results/results.component').then(m => m.ResultsComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./pages/admin/admin').then(m => m.Admin),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin/users-list/users-list').then(m => m.UsersList)
      },
      {
        path: 'create-user',
        loadComponent: () => import('./pages/admin/create-user/create-user').then(m => m.CreateUser)
      }
    ]
  },
  { path: '**', redirectTo: '' },
];
