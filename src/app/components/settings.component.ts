import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1>Paramètres</h1>
        <p>Gérez vos préférences et paramètres de compte</p>
      </div>

      <div class="settings-content">
        <div class="settings-section">
          <h2>Profil</h2>
          <div class="setting-item">
            <label>Nom d'utilisateur</label>
            <input type="text" placeholder="Votre nom d'utilisateur">
          </div>
          <div class="setting-item">
            <label>Email</label>
            <input type="email" placeholder="votre.email@example.com">
          </div>
        </div>

        <div class="settings-section">
          <h2>Sécurité</h2>
          <div class="setting-item">
            <label>Mot de passe</label>
            <button class="btn-primary">Changer le mot de passe</button>
          </div>
          <div class="setting-item">
            <label>Authentification à deux facteurs</label>
            <button class="btn-secondary">Activer</button>
          </div>
        </div>

        <div class="settings-section">
          <h2>Notifications</h2>
          <div class="setting-item">
            <label>Notifications par email</label>
            <input type="checkbox" checked>
          </div>
          <div class="setting-item">
            <label>Notifications push</label>
            <input type="checkbox">
          </div>
        </div>

        <div class="settings-actions">
          <button class="btn-save">Enregistrer les modifications</button>
          <button class="btn-cancel" routerLink="/dashboard">Annuler</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 20px;
      font-family: 'Arial', sans-serif;
    }

    .settings-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .settings-header h1 {
      font-size: 36px;
      color: #084506;
      margin-bottom: 10px;
    }

    .settings-header p {
      font-size: 18px;
      color: #666;
    }

    .settings-content {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      padding: 30px;
    }

    .settings-section {
      margin-bottom: 30px;
      border-bottom: 1px solid #eee;
      padding-bottom: 20px;
    }

    .settings-section:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }

    .settings-section h2 {
      font-size: 24px;
      color: #084506;
      margin-bottom: 20px;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      padding: 10px 0;
    }

    .setting-item label {
      font-weight: 500;
      color: #333;
      flex: 1;
    }

    .setting-item input[type="text"],
    .setting-item input[type="email"] {
      flex: 2;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
    }

    .setting-item input[type="checkbox"] {
      width: 20px;
      height: 20px;
    }

    .btn-primary,
    .btn-secondary,
    .btn-save,
    .btn-cancel {
      padding: 10px 20px;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #FF8D28;
      color: #000;
    }

    .btn-primary:hover {
      background: #e67e1a;
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .btn-secondary:hover {
      background: #e0e0e0;
    }

    .settings-actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      margin-top: 30px;
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
      .settings-container {
        padding: 20px 10px;
      }

      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }

      .settings-actions {
        flex-direction: column;
      }
    }
  `]
})
export class SettingsComponent {

}
