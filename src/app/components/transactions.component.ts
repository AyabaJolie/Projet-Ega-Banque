import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { LucideAngularModule, Search, Filter, Eye, FileText, Calendar } from 'lucide-angular';

// Interface pour les transactions
export interface Transaction {
  id: number;
  numeroTransaction: string;
  numeroCompte: string;
  typeCompte: 'Épargne' | 'Courant' | 'Entreprise' | 'Jeune';
  typeTransaction: 'Dépôt' | 'Retrait' | 'Transfert' | 'Paiement' | 'Virement';
  montant: number;
  devise: string;
  dateTransaction: string;
  heureTransaction: string;
  beneficiaire: string;
  emetteur: string;
  description: string;
  statut: 'Réussi' | 'Échoué' | 'En attente' | 'Annulé';
  soldeApres: number;
  proprietaire: string;
  frais?: number;
  reference: string;
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">Gestion des Transactions</div>
        <div class="header-actions">
          
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="search-filter-bar">
        <div class="search-container">
          <lucide-icon name="search" class="search-icon"></lucide-icon>
          <input
            type="text"
            class="search-input"
            placeholder="Numéro, compte, propriétaire..."
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
          >
        </div>
        <div class="filter-group">
          <div class="filter-container">
            <label class="filter-label">Type</label>
            <select class="filter-select" [(ngModel)]="typeFilter" (change)="applyFilters()">
              <option value="">Tous</option>
              <option value="Courant">Courant</option>
              <option value="Épargne">Épargne</option>
              <option value="Entreprise">Entreprise</option>
              <option value="Jeune">Jeune</option>
            </select>
          </div>
          <div class="filter-container">
            <label class="filter-label">Statut</label>
            <select class="filter-select" [(ngModel)]="statutFilter" (change)="applyFilters()">
              <option value="">Tous</option>
              <option value="Réussi">Réussi</option>
              <option value="Échoué">Échoué</option>
              <option value="En attente">En attente</option>
              <option value="Annulé">Annulé</option>
            </select>
          </div>
          <div class="filter-container">
            <label class="filter-label">Type Transaction</label>
            <select class="filter-select" [(ngModel)]="transactionTypeFilter" (change)="applyFilters()">
              <option value="">Tous</option>
              <option value="Dépôt">Dépôt</option>
              <option value="Retrait">Retrait</option>
              <option value="Transfert">Transfert</option>
              <option value="Paiement">Paiement</option>
              <option value="Virement">Virement</option>
            </select>
          </div>
          <div class="date-filter">
            <label class="date-label">Date début</label>
            <input type="date" class="date-input" [(ngModel)]="dateFrom" (change)="applyFilters()">
          </div>
          <div class="date-filter">
            <label class="date-label">Date fin</label>
            <input type="date" class="date-input" [(ngModel)]="dateTo" (change)="applyFilters()">
          </div>
          <div class="amount-filter">
            <label class="amount-label">Montant min</label>
            <input type="number" class="amount-input" [(ngModel)]="amountMin" (input)="applyFilters()" placeholder="0">
          </div>
          <div class="amount-filter">
            <label class="amount-label">Montant max</label>
            <input type="number" class="amount-input" [(ngModel)]="amountMax" (input)="applyFilters()" placeholder="∞">
          </div>
        </div>
      </div>

      <!-- Filtres Actifs -->
      <div *ngIf="hasActiveFilters()" class="active-filters">
        <div class="filters-header">
          <span class="filters-title">Filtres actifs</span>
          <button class="clear-all-filters" (click)="resetFilters()">
            <lucide-icon name="x" size="16"></lucide-icon>
            Tout effacer
          </button>
        </div>
        <div class="filter-tags">
          <div *ngIf="searchTerm" class="filter-tag">
            <span>Recherche: "{{ searchTerm }}"</span>
            <button class="remove-filter" (click)="removeFilter('search')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
          <div *ngIf="typeFilter" class="filter-tag">
            <span>Type: {{ typeFilter }}</span>
            <button class="remove-filter" (click)="removeFilter('type')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
          <div *ngIf="statutFilter" class="filter-tag">
            <span>Statut: {{ statutFilter }}</span>
            <button class="remove-filter" (click)="removeFilter('statut')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
          <div *ngIf="transactionTypeFilter" class="filter-tag">
            <span>Type Transaction: {{ transactionTypeFilter }}</span>
            <button class="remove-filter" (click)="removeFilter('transactionType')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
          <div *ngIf="dateFrom" class="filter-tag">
            <span>Date début: {{ dateFrom }}</span>
            <button class="remove-filter" (click)="removeFilter('dateFrom')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
          <div *ngIf="dateTo" class="filter-tag">
            <span>Date fin: {{ dateTo }}</span>
            <button class="remove-filter" (click)="removeFilter('dateTo')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
          <div *ngIf="amountMin" class="filter-tag">
            <span>Montant min: {{ amountMin }}</span>
            <button class="remove-filter" (click)="removeFilter('amountMin')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
          <div *ngIf="amountMax" class="filter-tag">
            <span>Montant max: {{ amountMax }}</span>
            <button class="remove-filter" (click)="removeFilter('amountMax')">
              <lucide-icon name="x" size="12"></lucide-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Stats des filtres -->
      <div class="filter-stats">
        <div class="stat-card">
          <div class="stat-value">{{ filteredTransactions.length }}</div>
          <div class="stat-label">Transactions filtrées</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getTotalAmount() | number }}</div>
          <div class="stat-label">Montant total (CFA)</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">{{ getSuccessfulTransactionsCount() }}</div>
          <div class="stat-label">Transactions réussies</div>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="table-container">
        <table class="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Numéro Transaction</th>
              <th>Numéro Compte</th>
              <th>Type Compte</th>
              <th>Type Transaction</th>
              <th>Date & Heure</th>
              <th>Montant</th>
              <th>Propriétaire</th>
              <th>Description</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let transaction of getCurrentPageTransactions()" class="table-row">
              <td>{{ transaction.id }}</td>
              <td class="transaction-number">{{ transaction.numeroTransaction }}</td>
              <td class="account-number">{{ transaction.numeroCompte }}</td>
              <td>
                <span class="account-type-badge" [ngClass]="getAccountTypeClass(transaction.typeCompte)">
                  {{ transaction.typeCompte }}
                </span>
              </td>
              <td>
                <span class="transaction-type-badge" [ngClass]="getTransactionTypeClass(transaction.typeTransaction)">
                  {{ transaction.typeTransaction }}
                </span>
              </td>
              <td>
                <div class="datetime-cell">
                  <div class="date">{{ transaction.dateTransaction }}</div>
                  <div class="time">{{ transaction.heureTransaction }}</div>
                </div>
              </td>
              <td class="amount" [ngClass]="getAmountClass(transaction.typeTransaction)">
                {{ transaction.montant | currency:transaction.devise:'symbol':'1.0-0' }}
              </td>
              <td>{{ transaction.proprietaire }}</td>
              <td class="description">{{ transaction.description }}</td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(transaction.statut)">
                  {{ transaction.statut }}
                </span>
              </td>

            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          Affichage {{ getStartIndex() + 1 }} à {{ getEndIndex() }}
          sur {{ filteredTransactions.length }} transactions
        </div>

        <div class="pagination-controls">
          <button
            class="pagination-btn"
            (click)="previousPage()"
            [disabled]="currentPage === 1"
          >
            Précédent
          </button>

          <span class="page-info">
            Page {{ currentPage }} sur {{ getTotalPages() }}
          </span>

          <button
            class="pagination-btn"
            (click)="nextPage()"
            [disabled]="currentPage === getTotalPages()"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Page Header */
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

    .header-actions {
      display: flex;
      gap: 15px;
      align-items: center;
    }



    .refresh-btn {
      background: #3B82F6;
      color: #FFFFFF;
      border: none;
      border-radius: 10px;
      padding: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .refresh-btn:hover {
      background: #2563EB;
      transform: scale(1.05);
    }

    .refresh-icon {
      width: 16px;
      height: 16px;
    }

    /* Search and Filter Bar */
    .search-filter-bar {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      align-items: flex-end;
    }

    .search-container {
      flex: 1;
      max-width: 400px;
      position: relative;
      display: flex;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 0 14px;
      gap: 10px;
    }

    .search-icon {
      width: 16px;
      height: 16px;
      color: #6B7280;
    }

    .search-input {
      flex: 1;
      height: 40px;
      border: none;
      outline: none;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
    }

    .search-input::placeholder {
      color: #9CA3AF;
    }

    .filter-group {
      display: flex;
      gap: 20px;
    }

    .filter-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
      min-width: 200px;
    }

    .filter-label {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .filter-select {
      height: 40px;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 0 14px;
      background: #FFFFFF;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      outline: none;
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

    .amount-filter {
      flex: 1 1 180px;
      min-width: 140px;
      margin: 0 8px;
    }

    .amount-label {
      display: block;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 12px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .amount-input {
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
      transition: border-color 0.3s ease;
    }

    .amount-input:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    /* Filtres actifs */
    .active-filters {
      background: #F9FAFB;
      border-radius: 10px;
      padding: 16px;
      margin-bottom: 20px;
      border: 1px solid #E5E7EB;
    }

    .filters-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }

    .filters-title {
      font-family: 'Inter';
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .clear-all-filters {
      display: flex;
      align-items: center;
      gap: 6px;
      background: none;
      border: none;
      color: #DC2626;
      font-family: 'Inter';
      font-size: 14px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .clear-all-filters:hover {
      background: #FEE2E2;
    }

    .filter-tags {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
    }

    .filter-tag {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 20px;
      padding: 6px 12px;
      font-family: 'Inter';
      font-size: 13px;
      color: #374151;
    }

    .remove-filter {
      background: none;
      border: none;
      padding: 2px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
    }

    .remove-filter:hover {
      background: #F3F4F6;
    }

    /* Filter Stats */
    .filter-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }

    .stat-card {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 16px;
      text-align: center;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
    }

    .stat-value {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 24px;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .stat-label {
      font-family: 'Inter';
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Table Container */
    .table-container {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      overflow-x: auto;
    }

    .transactions-table {
      width: 100%;
      border-collapse: collapse;
    }

    .transactions-table thead {
      background: #f5f5f5;
    }

    .transactions-table th {
      padding: 20px 16px;
      text-align: left;
      font-family: 'Inter';
      font-weight: 700;
      font-size: 13px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: none;
      position: relative;
    }

    .transactions-table th:first-child {
      border-top-left-radius: 12px;
    }

    .transactions-table th:last-child {
      border-top-right-radius: 12px;
    }

    .transactions-table th::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #3B82F6;
    }

    .transactions-table td {
      padding: 16px 12px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
    }

    .table-row:hover {
      background: #F9FAFB;
    }

    /* Transaction Number */
    .transaction-number {
      font-family: 'Inter';
      font-weight: 600;
      color: #1F2937;
      letter-spacing: 1px;
    }

    /* Account Number */
    .account-number {
      font-family: 'Inter';
      font-weight: 500;
      color: #374151;
    }

    /* Account Type Badges */
    .account-type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .courant {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .epargne {
      background: #D1FAE5;
      color: #065F46;
    }

    .entreprise {
      background: #F3E8FF;
      color: #5B21B6;
    }

    .jeune {
      background: #FEF3C7;
      color: #92400E;
    }

    /* Transaction Type Badges */
    .transaction-type-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .depot {
      background: #D1FAE5;
      color: #065F46;
    }

    .retrait {
      background: #FEE2E2;
      color: #DC2626;
    }

    .transfert {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .paiement {
      background: #FEF3C7;
      color: #92400E;
    }

    .virement {
      background: #F3E8FF;
      color: #5B21B6;
    }

    /* Date & Time */
    .datetime-cell {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .date {
      font-weight: 500;
      color: #374151;
    }

    .time {
      font-size: 12px;
      color: #6B7280;
    }

    /* Amount */
    .amount {
      font-weight: 600;
    }

    .amount.positive {
      color: #059669;
    }

    .amount.negative {
      color: #DC2626;
    }

    /* Description */
    .description {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Status Badges */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .reussi {
      background: #D1FAE5;
      color: #065F46;
    }

    .echoue {
      background: #FEE2E2;
      color: #DC2626;
    }

    .en-attente {
      background: #FEF3C7;
      color: #92400E;
    }

    .annule {
      background: #F3F4F6;
      color: #6B7280;
    }



    /* Pagination */
    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 20px;
      background: #FFFFFF;
      border-radius: 10px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
    }

    .pagination-info {
      font-family: 'Inter';
      font-size: 14px;
      color: #6B7280;
    }

    .pagination-controls {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .pagination-btn {
      padding: 8px 16px;
      border: 1px solid #E5E7EB;
      background: #FFFFFF;
      border-radius: 6px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .pagination-btn:hover:not(:disabled) {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .pagination-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-info {
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }
  `]
})
export class TransactionsComponent implements OnInit {
  allTransactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  // Filtres
  searchTerm = '';
  typeFilter = '';
  statutFilter = '';
  transactionTypeFilter = '';
  dateFrom = '';
  dateTo = '';
  amountMin = '';
  amountMax = '';

  // User properties
  currentUser: any;
  isClient = false;

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.loadMockData();
    this.currentUser = this.authService.getCurrentUser();
    this.isClient = this.authService.isClient();
    if (this.isClient) {
      this.filterClientTransactions();
    }
  }

  loadMockData() {
    // Données de démonstration pour les transactions
    this.allTransactions = [
      {
        id: 1,
        numeroTransaction: 'TRX0012345678',
        numeroCompte: 'CMR0012345678',
        typeCompte: 'Courant',
        typeTransaction: 'Dépôt',
        montant: 500000,
        devise: 'CFA',
        dateTransaction: '15/01/2024',
        heureTransaction: '10:30:45',
        beneficiaire: 'AYABA Amina',
        emetteur: 'Banque Centrale',
        description: 'Dépôt espèces',
        statut: 'Réussi',
        soldeApres: 3000000,
        proprietaire: 'AYABA Amina',
        frais: 0,
        reference: 'DEP-20240115-001'
      },
      {
        id: 2,
        numeroTransaction: 'TRX0012345679',
        numeroCompte: 'CMR0087654321',
        typeCompte: 'Épargne',
        typeTransaction: 'Retrait',
        montant: 200000,
        devise: 'CFA',
        dateTransaction: '15/01/2024',
        heureTransaction: '14:15:22',
        beneficiaire: 'MBALLA Jolie',
        emetteur: 'MBALLA Jolie',
        description: 'Retrait DAB',
        statut: 'Réussi',
        soldeApres: 1000000,
        proprietaire: 'MBALLA Jolie',
        frais: 500,
        reference: 'RET-20240115-002'
      },
      {
        id: 3,
        numeroTransaction: 'TRX0012345680',
        numeroCompte: 'CMR0056789012',
        typeCompte: 'Entreprise',
        typeTransaction: 'Transfert',
        montant: 1500000,
        devise: 'CFA',
        dateTransaction: '16/01/2024',
        heureTransaction: '09:45:10',
        beneficiaire: 'Fournisseur ABC',
        emetteur: 'KAMGA Paul',
        description: 'Paiement facture',
        statut: 'Réussi',
        soldeApres: 6000000,
        proprietaire: 'KAMGA Paul',
        frais: 2500,
        reference: 'TRF-20240116-003'
      },
      {
        id: 4,
        numeroTransaction: 'TRX0012345681',
        numeroCompte: 'CMR0098765432',
        typeCompte: 'Jeune',
        typeTransaction: 'Virement',
        montant: 50000,
        devise: 'CFA',
        dateTransaction: '16/01/2024',
        heureTransaction: '16:20:33',
        beneficiaire: 'NGOUAN Marie',
        emetteur: 'Parent',
        description: 'Virement mensuel',
        statut: 'En attente',
        soldeApres: 550000,
        proprietaire: 'NGOUAN Marie',
        frais: 100,
        reference: 'VIR-20240116-004'
      },
      {
        id: 5,
        numeroTransaction: 'TRX0012345682',
        numeroCompte: 'CMR0034567890',
        typeCompte: 'Courant',
        typeTransaction: 'Paiement',
        montant: 75000,
        devise: 'CFA',
        dateTransaction: '17/01/2024',
        heureTransaction: '11:05:17',
        beneficiaire: 'SUPERMARCHE XYZ',
        emetteur: 'TCHOUA Jean',
        description: 'Paiement carte',
        statut: 'Réussi',
        soldeApres: 2925000,
        proprietaire: 'TCHOUA Jean',
        frais: 250,
        reference: 'PAY-20240117-005'
      },
      {
        id: 6,
        numeroTransaction: 'TRX0012345683',
        numeroCompte: 'CMR0076543210',
        typeCompte: 'Épargne',
        typeTransaction: 'Dépôt',
        montant: 300000,
        devise: 'CFA',
        dateTransaction: '17/01/2024',
        heureTransaction: '15:40:55',
        beneficiaire: 'FOUDA Sophie',
        emetteur: 'Banque',
        description: 'Dépôt chèque',
        statut: 'Échoué',
        soldeApres: 1500000,
        proprietaire: 'FOUDA Sophie',
        frais: 0,
        reference: 'DEP-20240117-006'
      },
      {
        id: 7,
        numeroTransaction: 'TRX0012345684',
        numeroCompte: 'CMR0023456789',
        typeCompte: 'Courant',
        typeTransaction: 'Transfert',
        montant: 1000000,
        devise: 'CFA',
        dateTransaction: '18/01/2024',
        heureTransaction: '08:15:42',
        beneficiaire: 'Partenaire Business',
        emetteur: 'EKOUA David',
        description: 'Transfert commercial',
        statut: 'Réussi',
        soldeApres: 3500000,
        proprietaire: 'EKOUA David',
        frais: 5000,
        reference: 'TRF-20240118-007'
      },
      {
        id: 8,
        numeroTransaction: 'TRX0012345685',
        numeroCompte: 'CMR0045678901',
        typeCompte: 'Entreprise',
        typeTransaction: 'Virement',
        montant: 2500000,
        devise: 'CFA',
        dateTransaction: '18/01/2024',
        heureTransaction: '13:25:19',
        beneficiaire: 'AYABA Amina',
        emetteur: 'Client Entreprise',
        description: 'Virement client',
        statut: 'Annulé',
        soldeApres: 8500000,
        proprietaire: 'AYABA Amina',
        frais: 0,
        reference: 'VIR-20240118-008'
      },
      {
        id: 9,
        numeroTransaction: 'TRX0012345686',
        numeroCompte: 'CMR0067890123',
        typeCompte: 'Épargne',
        typeTransaction: 'Retrait',
        montant: 100000,
        devise: 'CFA',
        dateTransaction: '19/01/2024',
        heureTransaction: '10:10:10',
        beneficiaire: 'KAMGA Paul',
        emetteur: 'KAMGA Paul',
        description: 'Retrait guichet',
        statut: 'Réussi',
        soldeApres: 2100000,
        proprietaire: 'KAMGA Paul',
        frais: 500,
        reference: 'RET-20240119-009'
      },
      {
        id: 10,
        numeroTransaction: 'TRX0012345687',
        numeroCompte: 'CMR0011112222',
        typeCompte: 'Jeune',
        typeTransaction: 'Paiement',
        montant: 25000,
        devise: 'CFA',
        dateTransaction: '19/01/2024',
        heureTransaction: '17:45:30',
        beneficiaire: 'LIBRAIRIE ABC',
        emetteur: 'NGOUAN Marie',
        description: 'Achat livres',
        statut: 'Réussi',
        soldeApres: 775000,
        proprietaire: 'NGOUAN Marie',
        frais: 100,
        reference: 'PAY-20240119-010'
      }
    ];

    this.filteredTransactions = [...this.allTransactions];
  }

  filterClientTransactions() {
    // For client, show only their transactions (assuming clientId = 1 for client@gmail.com)
    this.filteredTransactions = this.allTransactions.filter(
      transaction => transaction.proprietaire === 'AYABA Amina'
    );
  }

  applyFilters() {
    this.filteredTransactions = this.allTransactions.filter(transaction => {
      // Filtre par recherche
      const searchMatch = !this.searchTerm ||
        transaction.numeroTransaction.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.numeroCompte.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.proprietaire.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        transaction.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtre par type de compte
      const typeMatch = !this.typeFilter ||
        transaction.typeCompte === this.typeFilter;

      // Filtre par statut
      const statutMatch = !this.statutFilter ||
        transaction.statut === this.statutFilter;

      // Filtre par type de transaction
      const transactionTypeMatch = !this.transactionTypeFilter ||
        transaction.typeTransaction === this.transactionTypeFilter;

      // Filtre par date
      const dateMatch = (!this.dateFrom || transaction.dateTransaction >= this.dateFrom) &&
                        (!this.dateTo || transaction.dateTransaction <= this.dateTo);

      // Filtre par montant
      const amountMatch = (!this.amountMin || transaction.montant >= parseFloat(this.amountMin)) &&
                          (!this.amountMax || transaction.montant <= parseFloat(this.amountMax));

      return searchMatch && typeMatch && statutMatch && transactionTypeMatch && dateMatch && amountMatch;
    });

    this.currentPage = 1; // Revenir à la première page après filtrage
  }

  resetFilters() {
    this.searchTerm = '';
    this.typeFilter = '';
    this.statutFilter = '';
    this.transactionTypeFilter = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.amountMin = '';
    this.amountMax = '';
    this.applyFilters();
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || !!this.typeFilter || !!this.statutFilter ||
           !!this.transactionTypeFilter || !!this.dateFrom || !!this.dateTo ||
           !!this.amountMin || !!this.amountMax;
  }

  removeFilter(filterType: string) {
    switch(filterType) {
      case 'search':
        this.searchTerm = '';
        break;
      case 'type':
        this.typeFilter = '';
        break;
      case 'statut':
        this.statutFilter = '';
        break;
      case 'transactionType':
        this.transactionTypeFilter = '';
        break;
      case 'dateFrom':
        this.dateFrom = '';
        break;
      case 'dateTo':
        this.dateTo = '';
        break;
      case 'amountMin':
        this.amountMin = '';
        break;
      case 'amountMax':
        this.amountMax = '';
        break;
    }
    this.applyFilters();
  }

  getTotalAmount(): number {
    return this.filteredTransactions.reduce((total, transaction) => total + transaction.montant, 0);
  }

  getSuccessfulTransactionsCount(): number {
    return this.filteredTransactions.filter(transaction => transaction.statut === 'Réussi').length;
  }

  getAccountTypeClass(type: string): string {
    const typeMap: {[key: string]: string} = {
      'Courant': 'courant',
      'Épargne': 'epargne',
      'Entreprise': 'entreprise',
      'Jeune': 'jeune'
    };
    return typeMap[type] || 'courant';
  }

  getTransactionTypeClass(type: string): string {
    const typeMap: {[key: string]: string} = {
      'Dépôt': 'depot',
      'Retrait': 'retrait',
      'Transfert': 'transfert',
      'Paiement': 'paiement',
      'Virement': 'virement'
    };
    return typeMap[type] || 'depot';
  }

  getAmountClass(type: string): string {
    return type === 'Dépôt' ? 'positive' : 'negative';
  }

  getStatusClass(statut: string): string {
    const statutMap: {[key: string]: string} = {
      'Réussi': 'reussi',
      'Échoué': 'echoue',
      'En attente': 'en-attente',
      'Annulé': 'annule'
    };
    return statutMap[statut] || 'en-attente';
  }

  getCurrentPageTransactions() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredTransactions.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  getStartIndex() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex() {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredTransactions.length);
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  refreshTransactions() {
    console.log('Rafraîchir les transactions');
    this.loadMockData();
    this.applyFilters();
  }
}
