
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { LucideAngularModule, Home, Users, CreditCard, BarChart3, User, Settings, LogOut, Search, Bell, Plus, Eye, Edit, Trash2, Filter, Lock, Unlock, X } from 'lucide-angular';

// Interface pour les comptes
export interface Compte {
  id: number;
  numeroCompte: string;
  typeCompte: 'Épargne' | 'Courant';
  dateCreation: string;
  solde: number;
  clientId: number;
  proprietaire: string;
  statut: 'Actif' | 'Inactif';
  devise: string;
}

@Component({
  selector: 'app-client-comptes',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title">Mes Comptes</div>
          <button class="new-account-btn" (click)="openNewAccountModal()">
            <lucide-icon name="plus" class="plus-icon"></lucide-icon>
            Nouveau compte
          </button>
        </div>

        <!-- Search and Filter Bar -->
        <div class="search-filter-bar">
          <div class="search-container">
            <label class="search-label">Rechercher</label>
            <div class="search-input-wrapper">
              <lucide-icon name="search" class="search-icon"></lucide-icon>
              <input
                type="text"
                class="search-input"
                placeholder="Numéro ou propriétaire..."
                [(ngModel)]="searchTerm"
                (input)="filterAccounts()"
              >
            </div>
          </div>
          <div class="filter-group">
            <div class="date-filter">
              <label class="date-label">Date début</label>
              <input type="date" class="date-input" [(ngModel)]="startDate" (change)="filterAccounts()">
            </div>
            <div class="date-filter">
              <label class="date-label">Date fin</label>
              <input type="date" class="date-input" [(ngModel)]="endDate" (change)="filterAccounts()">
            </div>
            <div class="filter-container">
              <label class="filter-label">Statut</label>
              <select class="filter-select" [(ngModel)]="selectedStatusFilter" (change)="filterAccounts()">
                <option value="all">Tous</option>
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
            <div class="filter-container">
              <label class="filter-label">Type</label>
              <select class="filter-select" [(ngModel)]="selectedTypeFilter" (change)="filterAccounts()">
                <option value="all">Tous</option>
                <option value="Courant">Courant</option>
                <option value="Épargne">Épargne</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Accounts Container -->
        <div class="accounts-container">
          <!-- Account Cards -->
          <div class="account-grid">
            <div
              *ngFor="let compte of filteredAccounts"
              class="account-card"
              [ngClass]="compte.statut === 'Actif' ? 'active' : 'inactive'"
            >
              <div class="account-header">
                <div class="account-type">
                  <span class="type-badge" [ngClass]="getTypeClass(compte.typeCompte)">
                    {{ compte.typeCompte }}
                  </span>
                </div>
                <div class="account-status">
                  <span class="status-badge" [ngClass]="getStatusClass(compte.statut)">
                    {{ compte.statut }}
                  </span>
                </div>
              </div>

              <div class="account-number">
                {{ compte.numeroCompte }}
              </div>

              <div class="account-balance">
                <div class="balance-amount">{{ compte.solde | number:'1.0-0' }} {{ compte.devise }}</div>
                <div class="balance-label">Solde actuel</div>
              </div>

              <div class="account-details">
                <div class="detail-item">
                  <span class="detail-label">Créé le:</span>
                  <span>{{ compte.dateCreation }}</span>
                </div>
              </div>

              <div class="account-actions">
                <button class="action-btn view-btn" (click)="viewAccountDetails(compte)">
                  <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  Voir détails
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Account Details Modal -->
      <div *ngIf="showDetailsModal" class="modal-overlay" (click)="closeDetailsModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Détails du Compte</h2>
            <button class="close-btn" (click)="closeDetailsModal()">&times;</button>
          </div>
          <div class="modal-body">
            <div class="detail-section">
              <h3>Informations Générales</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Numéro de compte:</span>
                  <span>{{ selectedAccount?.numeroCompte }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Type de compte:</span>
                  <span [ngClass]="getTypeClass(selectedAccount?.typeCompte || '')">{{ selectedAccount?.typeCompte }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date de création:</span>
                  <span>{{ selectedAccount?.dateCreation }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Informations Financières</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Solde actuel:</span>
                  <span class="amount-detail">{{ selectedAccount?.solde | number:'1.0-0' }} {{ selectedAccount?.devise }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Devise:</span>
                  <span>{{ selectedAccount?.devise }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Client ID:</span>
                  <span>{{ selectedAccount?.clientId }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Statut du Compte</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Statut:</span>
                  <span class="status-badge" [ngClass]="getStatusClass(selectedAccount?.statut || '')">
                    {{ selectedAccount?.statut }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Compte ID:</span>
                  <span>{{ selectedAccount?.id }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Create Account Modal -->
      <div *ngIf="showCreateAccountModal" class="modal-overlay" (click)="closeCreateModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Créer un Nouveau Compte</h2>
            <button class="close-btn" (click)="closeCreateModal()">&times;</button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="createAccount()" #accountForm="ngForm">
              <div class="form-group">
                <label for="numeroCompte">Numéro de compte:</label>
                <input type="text" id="numeroCompte" name="numeroCompte" [(ngModel)]="newAccount.numeroCompte" required class="form-input">
              </div>

              <div class="form-group">
                <label for="typeCompte">Type de compte:</label>
                <select id="typeCompte" name="typeCompte" [(ngModel)]="newAccount.typeCompte" required class="form-select">
                  <option value="Courant">Courant</option>
                  <option value="Épargne">Épargne</option>
                </select>
              </div>

              <div class="form-group">
                <label for="solde">Solde initial:</label>
                <input type="number" id="solde" name="solde" [(ngModel)]="newAccount.solde" required class="form-input">
              </div>

              <div class="form-group">
                <label for="devise">Devise:</label>
                <select id="devise" name="devise" [(ngModel)]="newAccount.devise" required class="form-select">
                  <option value="CFA">CFA</option>
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                </select>
              </div>

              <div class="form-group">
                <label for="statut">Statut:</label>
                <select id="statut" name="statut" [(ngModel)]="newAccount.statut" required class="form-select">
                  <option value="Actif">Actif</option>
                  <option value="Inactif">Inactif</option>
                </select>
              </div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" (click)="closeCreateModal()">Annuler</button>
                <button type="submit" class="submit-btn" [disabled]="!accountForm.valid">Créer le compte</button>
              </div>
            </form>
          </div>
        </div>
      </div>
  `,
  styles: [`
    .main-content {
      padding: 40px 60px;
      min-height: calc(100vh - 50px);
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }

    .page-title {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 28px;
      color: #1F2937;
    }

    .new-account-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #3B82F6;
      color: #FFFFFF;
      border: none;
      border-radius: 10px;
      padding: 12px 20px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .new-account-btn:hover {
      background: #2563EB;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .plus-icon {
      width: 16px;
      height: 16px;
    }

    .search-filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 30px;
      align-items: flex-end;
      background: #FFFFFF;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
    }

    .search-container {
      flex: 1 1 400px;
      max-width: 500px;
      min-width: 250px;
      position: relative;
    }

    .search-label {
      display: block;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 12px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-input {
      width: 100%;
      height: 44px;
      padding: 12px 16px 12px 44px;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .search-input:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      color: #6B7280;
    }

    .filter-group {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      flex: 1 1 100%;
    }

    .filter-container {
      flex: 1 1 180px;
      min-width: 160px;
    }

    .filter-label {
      display: block;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 12px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .filter-select {
      width: 100%;
      height: 44px;
      padding: 12px 16px;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      outline: none;
      cursor: pointer;
      transition: border-color 0.3s ease;
    }

    .filter-select:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .date-filter {
      flex: 1 1 180px;
      min-width: 140px;
      margin: 0 8px;
    }

    .date-label {
      display: block;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 12px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .date-input {
      width: 100%;
      height: 44px;
      padding: 12px;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      outline: none;
      cursor: pointer;
      transition: border-color 0.3s ease;
    }

    .date-input:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .accounts-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .account-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 20px;
    }

    .account-card {
      background: #FFFFFF;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      border: 2px solid transparent;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .account-card.active {
      border-color: #10B981;
    }

    .account-card.inactive {
      border-color: #F59E0B;
      opacity: 0.8;
    }

    .account-card:hover {
      transform: translateY(-5px);
      box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.12);
    }

    .account-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .type-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .courant { background: #DBEAFE; color: #1E40AF; }
    .epargne { background: #D1FAE5; color: #065F46; }
    .entreprise { background: #F3E8FF; color: #5B21B6; }
    .jeune { background: #FEF3C7; color: #92400E; }

    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .actif { background: #D1FAE5; color: #065F46; }

    .inactif { background: #F3F4F6; color: #6B7280; }

    .account-number {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 16px;
      color: #374151;
      margin-bottom: 15px;
      letter-spacing: 1px;
    }

    .account-balance {
      margin-bottom: 20px;
    }

    .balance-amount {
      font-family: 'Poppins';
      font-weight: 700;
      font-size: 24px;
      color: #059669;
      margin-bottom: 5px;
    }

    .balance-label {
      font-family: 'Inter';
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .account-details {
      margin-bottom: 20px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #F3F4F6;
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item span:last-child {
      font-family: 'Inter';
      font-weight: 400;
      font-size: 14px;
      color: #374151;
    }

    .account-actions {
      display: flex;
      gap: 10px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
      flex: 1;
      justify-content: center;
    }

    .view-btn {
      background: #3B82F6;
      color: white;
    }

    .view-btn:hover {
      background: #2563EB;
      transform: scale(1.02);
    }

    .action-icon {
      width: 16px;
      height: 16px;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }

    .modal-content {
      background: #FFFFFF;
      border-radius: 15px;
      width: 90%;
      max-width: 500px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.15);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      border-bottom: 1px solid #E5E7EB;
    }

    .modal-header h2 {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 20px;
      color: #1F2937;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      font-size: 24px;
      color: #6B7280;
      transition: background 0.3s ease;
    }

    .close-btn:hover {
      background: #F3F4F6;
    }

    .modal-body {
      padding: 30px;
    }

    .detail-section {
      margin-bottom: 30px;
    }

    .detail-section h3 {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 16px;
      color: #1F2937;
      margin-bottom: 15px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #F3F4F6;
    }

    .detail-item:last-child {
      border-bottom: none;
    }

    .detail-label {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item span:last-child {
      font-family: 'Inter';
      font-weight: 400;
      font-size: 14px;
      color: #374151;
    }

    .amount-detail {
      font-weight: 700;
      font-size: 16px;
      color: #059669;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #374151;
      margin-bottom: 8px;
    }

    .form-input, .form-select {
      width: 100%;
      padding: 12px 16px;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      outline: none;
      transition: border-color 0.3s ease;
    }

    .form-input:focus, .form-select:focus {
      border-color: #3B82F6;
    }

    .form-select {
      cursor: pointer;
    }

    .form-actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      margin-top: 30px;
    }

    .cancel-btn {
      background: #F3F4F6;
      color: #374151;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: #E5E7EB;
    }

    .submit-btn {
      background: #10B981;
      color: #FFFFFF;
      border: none;
      border-radius: 8px;
      padding: 12px 24px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #059669;
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      background: #D1FAE5;
      cursor: not-allowed;
      transform: none;
    }
  `]
})
export class ClientComptesComponent implements OnInit {
  clientAccounts: Compte[] = [];
  filteredAccounts: Compte[] = [];
  showCreateAccountModal = false;
  showDetailsModal = false;
  selectedAccount: Compte | null = null;
  searchTerm: string = '';
  selectedStatusFilter: string = 'all';
  selectedTypeFilter: string = 'all';
  startDate: string = '';
  endDate: string = '';

  // New account form
  newAccount: Partial<Compte> = {
    typeCompte: 'Courant',
    devise: 'CFA',
    statut: 'Actif',
    solde: 0
  };

  constructor(private authService: AuthService, private apiService: ApiService, private router: Router) {}

  ngOnInit() {
    this.loadClientAccounts();
  }

  loadClientAccounts() {
    // Display sample accounts
    this.clientAccounts = [
      {
        id: 1,
        numeroCompte: 'CMR0012345678',
        typeCompte: 'Courant',
        dateCreation: '15/01/2023',
        solde: 2500000,
        clientId: 1,
        proprietaire: 'Jean Dupont',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 2,
        numeroCompte: 'CMR0087654321',
        typeCompte: 'Épargne',
        dateCreation: '20/03/2023',
        solde: 1500000,
        clientId: 1,
        proprietaire: 'Jean Dupont',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 3,
        numeroCompte: 'CMR0056781234',
        typeCompte: 'Courant',
        dateCreation: '10/05/2022',
        solde: 500000,
        clientId: 1,
        proprietaire: 'Jean Dupont',
        statut: 'Inactif',
        devise: 'EUR'
      }
    ];
    this.filteredAccounts = [...this.clientAccounts];
  }

  getTypeClass(type: string): string {
    const typeMap: {[key: string]: string} = {
      'Courant': 'courant',
      'Épargne': 'epargne',
      'Entreprise': 'entreprise',
      'Jeune': 'jeune'
    };
    return typeMap[type] || 'courant';
  }

  getStatusClass(statut: string): string {
    const statutMap: {[key: string]: string} = {
      'Actif': 'actif',
      'Inactif': 'inactif'
    };
    return statutMap[statut] || 'inactif';
  }

  viewAccountDetails(compte: Compte) {
    this.selectedAccount = compte;
    this.showDetailsModal = true;
  }

  closeDetailsModal() {
    this.showDetailsModal = false;
    this.selectedAccount = null;
  }

  openNewAccountModal() {
    this.showCreateAccountModal = true;
  }

  closeCreateModal() {
    this.showCreateAccountModal = false;
    this.newAccount = {
      typeCompte: 'Courant',
      devise: 'CFA',
      statut: 'Actif',
      solde: 0
    };
  }

  createAccount() {
    const currentUser = this.authService.getCurrentUser();
    if (this.newAccount.numeroCompte && this.newAccount.typeCompte && this.newAccount.solde !== undefined && this.newAccount.devise && currentUser) {
      const newId = this.clientAccounts.length > 0 ? Math.max(...this.clientAccounts.map(c => c.id)) + 1 : 1;
      const compte: Compte = {
        id: newId,
        numeroCompte: this.newAccount.numeroCompte,
        typeCompte: this.newAccount.typeCompte,
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        solde: this.newAccount.solde,
        clientId: currentUser.id || 1,
        proprietaire: currentUser.nom,
        statut: this.newAccount.statut || 'Actif',
        devise: this.newAccount.devise
      };

      this.clientAccounts.push(compte);
      this.filterAccounts();
      this.closeCreateModal();
      console.log('Nouveau compte créé:', compte);
    }
  }

  filterAccounts() {
    this.filteredAccounts = this.clientAccounts.filter(compte => {
      // Search term filter
      const matchesSearch = !this.searchTerm ||
        compte.numeroCompte.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        compte.proprietaire.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Date range filter
      let matchesDate = true;
      if (this.startDate || this.endDate) {
        // Convert dateCreation from DD/MM/YYYY to YYYY-MM-DD for comparison
        const [day, month, year] = compte.dateCreation.split('/');
        const accountDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;

        if (this.startDate && accountDate < this.startDate) {
          matchesDate = false;
        }
        if (this.endDate && accountDate > this.endDate) {
          matchesDate = false;
        }
      }

      // Status filter
      const matchesStatus = this.selectedStatusFilter === 'all' || compte.statut === this.selectedStatusFilter;

      // Type filter
      const matchesType = this.selectedTypeFilter === 'all' || compte.typeCompte === this.selectedTypeFilter;

      return matchesSearch && matchesDate && matchesStatus && matchesType;
    });
  }
}