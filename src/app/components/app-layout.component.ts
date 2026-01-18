import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-layout">
      <header class="app-header">
        <div class="header-content">
          <div class="logo">
            <img src="assets/images/logo.png" alt="EGA BANQUE" class="logo-img">
          </div>
          <nav class="main-nav">
            <a routerLink="/app/dashboard" class="nav-item">Dashboard</a>
            <a *ngIf="authService.isAdmin()" routerLink="/app/clients" class="nav-item">Clients</a>
            <a *ngIf="authService.isAdmin() || authService.isClient()" routerLink="/app/comptes" class="nav-item">Mes Comptes</a>
            <a *ngIf="authService.isAdmin() || authService.isClient()" routerLink="/app/transactions" class="nav-item">Mes Transactions</a>
            <a *ngIf="authService.isClient()" routerLink="/app/transactions" class="nav-item">Historique</a>
            <a routerLink="/app/account" class="nav-item">Mon Compte</a>
            <a *ngIf="authService.isAdmin()" routerLink="/app/settings" class="nav-item">Paramètres</a>
          </nav>
          <div class="user-actions">
            <button class="logout-btn" (click)="logout()">Déconnexion</button>
          </div>
        </div>
      </header>
      <main class="app-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-layout {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .app-header {
      background: linear-gradient(to right, #ffffff, #f8f9fa);
      border-bottom: 1px solid #e9ecef;
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: box-shadow 0.3s ease, background 0.3s ease;
    }

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      max-width: 1400px;
      margin: 0 auto;
      padding: 10px 0;
    }

    .logo-img {
      height: 80px;
      width: auto;
    }

    .main-nav {
      display: flex;
      gap: 20px;
    }

    .nav-item {
      text-decoration: none;
      padding: 12px 18px;
      font-size: 18px;
      font-weight: 600;
      font-family: 'Roboto', sans-serif;
      color: #6c757d;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .nav-item:hover {
      background: #f8f9fa;
      color: #084506;
      transform: scale(1.05);
    }

    .user-actions {
      display: flex;
      align-items: center;
    }

    .logout-btn {
      background: #dc3545;
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 16px;
      font-family: 'Roboto', sans-serif;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .logout-btn:hover {
      background: #c82333;
      box-shadow: 0 4px 8px rgba(0,0,0,0.2);
      transform: scale(1.05);
    }

    .app-main {
      padding: 10px;
      max-width: 1600px;
      margin: 0 auto;
    }
  `]
})
export class AppLayoutComponent {
  constructor(public authService: AuthService) {}

  logout() {
    this.authService.logout();
  }

  makeDeposit() {
    alert('Fonction de versement à implémenter');
  }

  makeWithdrawal() {
    alert('Fonction de retrait à implémenter');
  }
}
