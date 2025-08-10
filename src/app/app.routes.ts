import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'test',
    loadComponent: () => import('./testing/testing.component').then(m => m.TestingComponent)
  },
  {
    path: '',
    redirectTo: 'landing-page',
    pathMatch: 'full'
  },
  {
    path: 'landing-page',
    loadComponent: () => import('./layouts/landing-layout/landing-layout.component').then(m => m.LandingLayoutComponent),
  },
  {
    path: 'auth',
    canActivate: [authGuard],
    loadComponent: () => import('./layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
          {
            path: 'login',
            loadComponent: () => import('./dashboard/auth/login/login.component').then(m => m.LoginComponent)
          },
          {
            path: 'sign-up',
            loadComponent: () => import('./dashboard/auth/signup/signup.component').then(m => m.SignupComponent)
          },
          {
            path: '',
            redirectTo: 'login',
            pathMatch: 'full'
          }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layouts/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    // canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./dashboard/orders/orders.component').then(m => m.OrderComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./dashboard/customers/customers.component').then(m => m.CustomersComponent)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent),
  }
];