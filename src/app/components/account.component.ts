import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="account-container">
      <div class="account-header">
        <h1>Mon Compte</h1>
        <p>Gérez vos informations personnelles et vos paramètres de compte</p>
      </div>

      <div class="account-content">
        <div class="account-section">
          <h2>Informations Personnelles</h2>
          <div class="account-item">
            <label>Nom complet</label>
            <input type="text" placeholder="Votre nom complet">
          </div>
          <div class="account-item">
            <label>Email</label>
            <input type="email" placeholder="votre.email@example.com">
          </div>
          <div class="account-item">
            <label>Téléphone</label>
            <input type="tel" placeholder="+228 XX XX XX XX">
          </div>
        </div>

        <div class="account-section">
          <h2>Préférences</h2>
          <div class="account-item">
            <label>Langue</label>
            <select>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div class="account-item">
            <label>Devise</label>
            <select>
              <option value="XOF">Franc CFA (XOF)</option>
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dollar US (USD)</option>
            </select>
          </div>
        </div>

        <div class="account-actions">
          <button class="btn-save">Enregistrer les modifications</button>
          <button class="btn-cancel" routerLink="/dashboard">Retour au tableau de bord</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .account-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: 'Arial', sans-serif;
    }

    .account-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .account-header h1 {
      font-size: 36px;
      color: #084506;
      margin-bottom: 10px;
    }

    .account-header p {
      font-size: 18px;
      color: #666;
    }

    .account-content {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 30px;
    }

    .account-section {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }

    .account-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .account-section h2 {
      font-size: 24px;
      color: #084506;
      margin-bottom: 20px;
    }

    .account-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px 0;
    }

    .account-item label {
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .account-item input,
    .account-item select {
      flex: 2;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .account-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
    }

    .btn-save,
    .btn-cancel {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-save {
      background: #128B0E;
      color: #fff;
    }

    .btn-save:hover {
      background: #0f7a0a;
    }

    .btn-cancel {
      background: #dc3545;
      color: #fff;
    }

    .btn-cancel:hover {
      background: #c82333;
    }

    @media (max-width: 768px) {
      .account-container {
        padding: 20px 10px;
      }

      .account-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .account-actions {
        flex-direction: column;
      }
    }
  `]
})
export class AccountComponent {

}
