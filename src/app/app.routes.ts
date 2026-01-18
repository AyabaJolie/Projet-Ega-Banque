import { Routes } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./components/login.component').then(m => m.LoginComponent) },
  {
    path: 'app',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'clients', loadComponent: () => import('./components/clients.component').then(m => m.ClientsComponent) },
      { path: 'comptes', loadComponent: () => import('./components/comptes.component').then(m => m.ComptesComponent) },
      { path: 'transactions', loadComponent: () => import('./components/transactions.component').then(m => m.TransactionsComponent) },
      { path: 'account', loadComponent: () => import('./components/account.component').then(m => m.AccountComponent) },
      { path: 'settings', loadComponent: () => import('./components/settings.component').then(m => m.SettingsComponent) }
    ]
  }
];
