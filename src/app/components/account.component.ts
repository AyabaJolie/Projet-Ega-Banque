import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-account',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="account-container">
      <div class="account-header">
        <h1>Mon Compte</h1>
        <p>Informations de votre compte</p>
      </div>

      <div class="account-content">
        <div class="account-section">
          <h2>Informations Personnelles</h2>
          <div class="account-item">
            <label>Nom</label>
            <span>{{ currentUser?.nom }}</span>
          </div>
          <div class="account-item">
            <label>Email</label>
            <span>{{ currentUser?.email }}</span>
          </div>
          <div class="account-item">
            <label>Mot de passe</label>
            <span>********</span>
          </div>
        </div>

        <div class="account-section">
          <h2>Changer le Mot de Passe</h2>
          <div *ngIf="message" class="message">{{ message }}</div>
          <div class="account-item">
            <label>Ancien mot de passe</label>
            <input type="password" [(ngModel)]="passwordForm.oldPassword" name="oldPassword">
          </div>
          <div class="account-item">
            <label>Nouveau mot de passe</label>
            <input type="password" [(ngModel)]="passwordForm.newPassword" name="newPassword">
          </div>
          <div class="account-item">
            <label>Confirmer le nouveau mot de passe</label>
            <input type="password" [(ngModel)]="passwordForm.confirmPassword" name="confirmPassword">
          </div>
        </div>

        <div class="account-actions">
          <button class="btn-save" (click)="changePassword()">Changer le mot de passe</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Arial', sans-serif;
    }

    .account-header {
      text-align: center;
      margin-bottom: 30px;
    }

    .account-header h1 {
      font-size: 28px;
      color: #084506;
      margin-bottom: 10px;
    }

    .account-header p {
      font-size: 16px;
      color: #666;
    }

    .account-content {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 20px;
    }

    .account-section {
      margin-bottom: 20px;
    }

    .account-section h2 {
      font-size: 20px;
      color: #084506;
      margin-bottom: 15px;
    }

    .account-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      padding: 8px 0;
    }

    .account-item label {
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .account-item span {
      flex: 2;
      font-weight: 400;
      color: #555;
    }

    .account-item input {
      flex: 2;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .account-actions {
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }

    .btn-save {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      background: #128B0E;
      color: #fff;
    }

    .btn-save:hover {
      background: #0f7a0a;
    }

    .message {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
      font-weight: 500;
      background-color: #efe;
      color: #363;
      border: 1px solid #cfc;
    }
  `]
})
export class AccountComponent implements OnInit {
  currentUser: User | null = null;
  passwordForm = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  message: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
  }

  changePassword(): void {
    if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
      this.message = 'Les nouveaux mots de passe ne correspondent pas.';
      return;
    }
    if (this.authService.changePassword(this.passwordForm.oldPassword, this.passwordForm.newPassword)) {
      this.message = 'Mot de passe changé avec succès.';
      this.passwordForm = { oldPassword: '', newPassword: '', confirmPassword: '' };
    } else {
      this.message = 'Erreur lors du changement du mot de passe.';
    }
  }
}
