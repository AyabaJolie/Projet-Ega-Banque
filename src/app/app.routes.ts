import { Routes } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { AppLayoutComponent } from './components/app-layout.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

export const routes: Routes = [
  { path: '', loadComponent: () => import('./components/landing.component').then(m => m.LandingComponent) },
  { path: 'login', loadComponent: () => import('./components/login.component').then(m => m.LoginComponent) },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import('./components/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'clients', loadComponent: () => import('./components/clients.component').then(m => m.ClientsComponent) },
      { path: 'comptes', loadComponent: () => import('./components/comptes.component').then(m => m.ComptesComponent) },
      { path: 'transactions', loadComponent: () => import('./components/transactions.component').then(m => m.TransactionsComponent) },
      { path: 'client-comptes', loadComponent: () => import('./components/client-comptes.component').then(m => m.ClientComptesComponent) },
      { path: 'client-transactions', loadComponent: () => import('./components/client-transactions.component').then(m => m.ClientTransactionsComponent) },
      { path: 'account-detail/:id', loadComponent: () => import('./components/account-detail.component').then(m => m.AccountDetailComponent) },
      { path: 'account', loadComponent: () => import('./components/account.component').then(m => m.AccountComponent) },
      { path: 'settings', loadComponent: () => import('./components/settings.component').then(m => m.SettingsComponent) }
    ]
  }
];
