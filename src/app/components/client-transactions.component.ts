  import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LucideAngularModule, Home, Users, CreditCard, BarChart3, Settings, LogOut, Search, Bell, User, X, RefreshCw, Filter, Printer, Plus } from 'lucide-angular';

interface Transaction {
  id: string;
  clientName: string;
  clientInitials: string;
  birthDate: string;
  gender: string;
  phone: string;
  nationality: string;
  transactionDate: string;
  transactionTime: string;
  accountNumber: string;
  accountType: string;
  accountCreationDate: string;
  accountBalance: number;
  accountOwner: string;
  accountStatus: 'Actif' | 'Inactif';
  amount: number;
  type: 'deposit' | 'withdrawal' | 'transfer';
  recipientAccount?: string;
  recipientName?: string;
  transactionFees?: number;
  description?: string;
}

interface Account {
  id: number;
  numeroCompte: string;
  typeCompte: string;
  solde: number;
  devise: string;
}

@Component({
  selector: 'app-client-transactions',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title">Mes Transactions</div>
          <button class="new-transaction-btn" (click)="openNewTransactionModal()">
            <lucide-icon name="plus" class="plus-icon"></lucide-icon>
            Nouvelle transaction
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
                placeholder="ID, compte, montant..."
                [(ngModel)]="searchQuery"
                (input)="applyFilters()"
              >
            </div>
          </div>
          <div class="filter-group">
            <div class="date-filter">
              <label class="date-label">Date début</label>
              <input type="date" class="date-input" [(ngModel)]="startDate" (change)="applyFilters()">
            </div>
            <div class="date-filter">
              <label class="date-label">Date fin</label>
              <input type="date" class="date-input" [(ngModel)]="endDate" (change)="applyFilters()">
            </div>
            <div class="filter-container">
              <label class="filter-label">Type</label>
              <select class="filter-select" [(ngModel)]="typeFilter" (change)="applyFilters()">
                <option value="">Tous</option>
                <option value="deposit">Dépôt</option>
                <option value="withdrawal">Retrait</option>
                <option value="transfer">Virement</option>
              </select>
            </div>
            <div class="filter-container">
              <label class="filter-label">Compte</label>
              <select class="filter-select" [(ngModel)]="accountFilter" (change)="applyFilters()">
                <option value="">Tous</option>
                <option *ngFor="let account of clientAccounts" [value]="account.numeroCompte">
                  {{ account.numeroCompte }} ({{ account.typeCompte }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Transactions Container -->
        <div class="transactions-container">
          <!-- Table Header -->
          <div class="table-header">
            <div class="header-date-time">Date & Heure</div>
            <div class="header-left">
              <div class="header-client">Transaction</div>
              <div class="header-transaction-info">Informations</div>
            </div>
            <div class="header-center">
              <div class="header-account">Détails du Compte</div>
            </div>
            <div class="header-right">
              <div class="header-amount">Montant</div>
            </div>
          </div>

          <!-- Transaction Items -->
          <div
            *ngFor="let transaction of filteredTransactions"
            class="transaction-item"
            (click)="openModal(transaction)"
          >
            <div class="transaction-date-time">
              <div class="date-time-info">
                <div class="transaction-date">{{ formatDate(transaction.transactionDate) }}</div>
                <div class="transaction-time">{{ transaction.transactionTime }}</div>
              </div>
            </div>

            <div class="transaction-left">
              <div class="transaction-profile profile-{{ transaction.clientInitials.toLowerCase() }}">
                {{ transaction.clientInitials }}
              </div>
              <div class="client-info">
                <div class="client-name">ID: {{ transaction.id }}</div>
                <div class="client-details">
                  <span>{{ transaction.accountNumber }}</span>
                  <span *ngIf="transaction.type === 'transfer'">→ {{ transaction.recipientAccount }}</span>
                </div>
              </div>
            </div>

            <div class="transaction-center">
              <div class="account-info">
                <div class="account-detail">
                  <span class="detail-label">Type:</span>
                  <span class="transaction-type-badge" [ngClass]="transaction.type">
                    {{ getTransactionTypeLabel(transaction.type) }}
                  </span>
                </div>
                <div class="account-detail" *ngIf="transaction.description">
                  <span class="detail-label">Description:</span>
                  <span class="transaction-description">{{ transaction.description }}</span>
                </div>
              </div>
            </div>

            <div class="transaction-right">
              <div class="transaction-amount" [ngClass]="getAmountClass(transaction.type)">
                <div class="amount">
                  {{ getAmountPrefix(transaction.type) }} {{ transaction.amount | number:'1.0-0' }} CFA
                </div>
                <div class="transaction-type-label">
                  {{ getTransactionTypeLabel(transaction.type) }}
                </div>
              </div>
              <button class="print-btn" (click)="printInvoice(transaction); $event.stopPropagation()" title="Imprimer la facture">
                <lucide-icon name="printer" class="print-icon"></lucide-icon>
              </button>
            </div>
          </div>
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

      <!-- Transaction Detail Modal -->
      <div *ngIf="showModal" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Détails de la Transaction</h2>
            <button class="close-btn" (click)="closeModal()">
              <lucide-icon name="x" class="close-icon"></lucide-icon>
            </button>
          </div>
          <div class="modal-body" *ngIf="selectedTransaction">
            <div class="detail-section">
              <h3>Informations Transaction</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">ID Transaction:</span>
                  <span class="transaction-id">{{ selectedTransaction.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date:</span>
                  <span>{{ formatDate(selectedTransaction.transactionDate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Heure:</span>
                  <span>{{ selectedTransaction.transactionTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Type:</span>
                  <span class="transaction-type-badge" [ngClass]="selectedTransaction.type">
                    {{ getTransactionTypeLabel(selectedTransaction.type) }}
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Montant:</span>
                  <span class="amount-detail {{ getAmountClass(selectedTransaction.type) }}">
                    {{ getAmountPrefix(selectedTransaction.type) }} {{ selectedTransaction.amount | number:'1.0-0' }} CFA
                  </span>
                </div>
                <div class="detail-item" *ngIf="selectedTransaction.transactionFees">
                  <span class="detail-label">Frais:</span>
                  <span class="fees-amount">{{ selectedTransaction.transactionFees | number:'1.0-0' }} CFA</span>
                </div>
                <div class="detail-item" *ngIf="selectedTransaction.description">
                  <span class="detail-label">Description:</span>
                  <span>{{ selectedTransaction.description }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Informations Compte Source</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Numéro de compte:</span>
                  <span>{{ selectedTransaction.accountNumber }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Type de compte:</span>
                  <span>{{ selectedTransaction.accountType }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Propriétaire:</span>
                  <span>{{ selectedTransaction.accountOwner }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Solde après opération:</span>
                  <span>{{ selectedTransaction.accountBalance | number:'1.0-0' }} CFA</span>
                </div>
              </div>
            </div>

            <div class="detail-section" *ngIf="selectedTransaction.type === 'transfer' && selectedTransaction.recipientAccount">
              <h3>Informations Compte Destinataire</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Numéro de compte:</span>
                  <span>{{ selectedTransaction.recipientAccount }}</span>
                </div>
                <div class="detail-item" *ngIf="selectedTransaction.recipientName">
                  <span class="detail-label">Bénéficiaire:</span>
                  <span>{{ selectedTransaction.recipientName }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="action-btn print-action-btn" (click)="printInvoice(selectedTransaction)">
                <lucide-icon name="printer" class="action-icon"></lucide-icon>
                Imprimer la facture
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- New Transaction Modal -->
      <div *ngIf="showNewTransactionModal" class="modal-overlay" (click)="closeNewTransactionModal()">
        <div class="modal-content large-modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Nouvelle Transaction</h2>
            <button class="close-btn" (click)="closeNewTransactionModal()">
              <lucide-icon name="x" class="close-icon"></lucide-icon>
            </button>
          </div>
          <div class="modal-body">
            <form (ngSubmit)="createTransaction()" #transactionForm="ngForm">
              <div class="form-row">
                <div class="form-group">
                  <label for="accountNumber">Compte source *</label>
                  <select 
                    id="accountNumber" 
                    name="accountNumber" 
                    [(ngModel)]="newTransaction.accountNumber" 
                    required 
                    class="form-select"
                    (change)="onAccountChange()"
                  >
                    <option value="">Sélectionnez un compte</option>
                    <option *ngFor="let account of clientAccounts" [value]="account.numeroCompte">
                      {{ account.numeroCompte }} ({{ account.typeCompte }}) - Solde: {{ account.solde | number:'1.0-0' }} {{ account.devise }}
                    </option>
                  </select>
                  <div *ngIf="selectedAccount" class="account-balance-info">
                    Solde disponible: <strong>{{ selectedAccount.solde | number:'1.0-0' }} {{ selectedAccount.devise }}</strong>
                  </div>
                </div>

                <div class="form-group">
                  <label for="transactionType">Type d'opération *</label>
                  <select 
                    id="transactionType" 
                    name="transactionType" 
                    [(ngModel)]="newTransaction.type" 
                    required 
                    class="form-select"
                    (change)="onTransactionTypeChange()"
                  >
                    <option value="">Sélectionnez une opération</option>
                    <option value="deposit">Dépôt</option>
                    <option value="withdrawal">Retrait</option>
                    <option value="transfer">Virement</option>
                  </select>
                </div>
              </div>

              <div class="form-row" *ngIf="newTransaction.type === 'transfer'">
                <div class="form-group">
                  <label for="recipientAccount">Compte destinataire *</label>
                  <input 
                    type="text" 
                    id="recipientAccount" 
                    name="recipientAccount" 
                    [(ngModel)]="newTransaction.recipientAccount" 
                    [required]="newTransaction.type === 'transfer'"
                    class="form-input"
                    placeholder="Numéro de compte du bénéficiaire"
                  >
                </div>
                <div class="form-group">
                  <label for="recipientName">Nom du bénéficiaire</label>
                  <input 
                    type="text" 
                    id="recipientName" 
                    name="recipientName" 
                    [(ngModel)]="newTransaction.recipientName" 
                    class="form-input"
                    placeholder="Nom complet du bénéficiaire"
                  >
                </div>
              </div>

              <div class="form-group">
                <label for="amount">Montant *</label>
                <input 
                  type="number" 
                  id="amount" 
                  name="amount" 
                  [(ngModel)]="newTransaction.amount" 
                  required 
                  class="form-input"
                  placeholder="Montant de la transaction"
                  min="1"
                  [max]="getMaxAmount()"
                >
                <div class="amount-validation" *ngIf="newTransaction.amount">
                  <span *ngIf="newTransaction.type === 'withdrawal' && newTransaction.amount > getMaxAmount()" class="error-text">
                    Le montant dépasse le solde disponible
                  </span>
                  <span *ngIf="newTransaction.type === 'withdrawal' && newTransaction.amount <= getMaxAmount()" class="success-text">
                    Solde après retrait: {{ (selectedAccount?.solde || 0) - (newTransaction.amount || 0) | number:'1.0-0' }} {{ selectedAccount?.devise }}
                  </span>
                </div>
              </div>

              <div class="form-group">
                <label for="description">Description</label>
                <textarea 
                  id="description" 
                  name="description" 
                  [(ngModel)]="newTransaction.description" 
                  class="form-textarea"
                  placeholder="Description de la transaction (optionnel)"
                  rows="3"
                ></textarea>
              </div>

              <div class="transaction-summary" *ngIf="newTransaction.amount && newTransaction.type && selectedAccount">
                <h3>Résumé de la transaction</h3>
                <div class="summary-grid">
                  <div class="summary-item">
                    <span class="summary-label">Type:</span>
                    <span class="summary-value">{{ getTransactionTypeLabel(newTransaction.type) }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Montant:</span>
                    <span class="summary-value">{{ newTransaction.amount | number:'1.0-0' }} {{ selectedAccount.devise }}</span>
                  </div>
                  <div class="summary-item" *ngIf="newTransaction.type === 'transfer'">
                    <span class="summary-label">Frais:</span>
                    <span class="summary-value">{{ calculateFees() | number:'1.0-0' }} {{ selectedAccount.devise }}</span>
                  </div>
                  <div class="summary-item">
                    <span class="summary-label">Total:</span>
                    <span class="summary-value total-amount">
                      {{ calculateTotal() | number:'1.0-0' }} {{ selectedAccount.devise }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="cancel-btn" (click)="closeNewTransactionModal()">Annuler</button>
                <button 
                  type="submit" 
                  class="submit-btn" 
                  [disabled]="!transactionForm.valid || (newTransaction.type === 'withdrawal' && newTransaction.amount > getMaxAmount())"
                >
                  Confirmer la transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Facture Print Template (Hidden) -->
      <div id="invoice-template" style="display: none;">
        <div class="invoice" id="invoice-content">
          <div class="invoice-header">
            <div class="invoice-logo">
              <img src="/assets/images/logo.png" alt="CMR BANK Logo" class="bank-logo">
              <div class="logo-text">
                <span class="bank-name">CMR BANK</span>
                <span class="bank-slogan">Votre partenaire financier de confiance</span>
              </div>
            </div>
            <div class="invoice-title">
              <h1>FACTURE DE TRANSACTION</h1>
              <div class="invoice-number" id="invoice-number"></div>
            </div>
          </div>

          <div class="invoice-info">
            <div class="info-section">
              <h3>Informations de la Banque</h3>
              <p><strong>CMR BANK</strong></p>
              <p>Siège Social: Avenue du Président, Yaoundé</p>
              <p>Tél: +237 222 22 22 22 | Email: contact@cmrbank.cm</p>
              <p>Agrément N°: AGR/2023/CMR/001</p>
            </div>
            <div class="info-section">
              <h3>Informations du Client</h3>
              <p id="client-name"></p>
              <p id="client-phone"></p>
              <p id="client-nationality"></p>
              <p>Date d'émission: <span id="invoice-date"></span></p>
            </div>
          </div>

          <div class="transaction-details">
            <h2>Détails de la Transaction</h2>
            <table class="details-table">
              <tr>
                <td><strong>Numéro de transaction:</strong></td>
                <td id="transaction-id"></td>
              </tr>
              <tr>
                <td><strong>Type d'opération:</strong></td>
                <td id="transaction-type"></td>
              </tr>
              <tr>
                <td><strong>Date et heure:</strong></td>
                <td id="transaction-datetime"></td>
              </tr>
              <tr>
                <td><strong>Compte source:</strong></td>
                <td id="source-account"></td>
              </tr>
              <tr *ngIf="selectedTransaction?.type === 'transfer'">
                <td><strong>Compte destinataire:</strong></td>
                <td id="recipient-account"></td>
              </tr>
              <tr *ngIf="selectedTransaction?.recipientName">
                <td><strong>Bénéficiaire:</strong></td>
                <td id="recipient-name"></td>
              </tr>
              <tr>
                <td><strong>Description:</strong></td>
                <td id="transaction-description"></td>
              </tr>
            </table>
          </div>

          <div class="amount-section">
            <h2>Montants</h2>
            <table class="amount-table">
              <tr>
                <td>Montant de la transaction:</td>
                <td id="transaction-amount"></td>
              </tr>
              <tr *ngIf="selectedTransaction?.transactionFees">
                <td>Frais de transaction:</td>
                <td id="transaction-fees"></td>
              </tr>
              <tr>
                <td><strong>Montant total:</strong></td>
                <td><strong id="total-amount"></strong></td>
              </tr>
            </table>
          </div>

          <div class="account-info">
            <h2>Informations du Compte</h2>
            <table class="account-table">
              <tr>
                <td>Type de compte:</td>
                <td id="account-type"></td>
              </tr>
              <tr>
                <td>Solde après opération:</td>
                <td id="account-balance"></td>
              </tr>
              <tr>
                <td>Statut du compte:</td>
                <td id="account-status"></td>
              </tr>
            </table>
          </div>

          <div class="invoice-footer">
            <div class="signature">
              <p>Signature autorisée</p>
              <div class="signature-line"></div>
              <p>CMR BANK</p>
            </div>
            <div class="footer-notes">
              <p><strong>Notes importantes:</strong></p>
              <p>• Cette facture est un reçu officiel de transaction</p>
              <p>• Conservez ce document pour vos archives</p>
              <p>• Pour toute réclamation, contactez notre service client</p>
              <p>• Référence: <span id="transaction-reference"></span></p>
            </div>
          </div>

          <div class="watermark">
            CMR BANK - Transaction Sécurisée
          </div>
        </div>
      </div>
  `,
  styles: [`
    /* Main Content */
    .main-content {
      padding: 40px 60px;
      min-height: calc(100vh - 50px);
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      overflow-x: hidden;
    }

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

    .new-transaction-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: linear-gradient(135deg, #059669 0%, #10B981 100%);
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

    .new-transaction-btn:hover {
      background: linear-gradient(135deg, #047857 0%, #059669 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
    }

    .plus-icon {
      width: 16px;
      height: 16px;
    }

    /* Search and Filter Bar */
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

    /* Transactions Container */
    .transactions-container {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .table-header {
      display: flex;
      background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
      padding: 20px;
      font-family: 'Inter';
      font-weight: 700;
      font-size: 13px;
      color: #374151;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 2px solid #E5E7EB;
    }

    .header-date-time {
      flex: 0 0 120px;
    }

    .header-left {
      flex: 1;
      display: flex;
      gap: 40px;
    }

    .header-center {
      flex: 1;
    }

    .header-right {
      flex: 0 0 150px;
    }

    .transaction-item {
      display: flex;
      padding: 20px;
      border-bottom: 1px solid #F3F4F6;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .transaction-item:hover {
      background: #F9FAFB;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      margin: 4px;
    }

    .transaction-date-time {
      flex: 0 0 120px;
      display: flex;
      align-items: center;
    }

    .date-time-info {
      font-family: 'Inter';
      font-size: 12px;
      color: #374151;
    }

    .transaction-date {
      font-weight: 600;
      margin-bottom: 2px;
      color: #1F2937;
    }

    .transaction-time {
      color: #6B7280;
      font-size: 11px;
    }

    .transaction-left {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .transaction-profile {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #FFFFFF;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    }

    .profile-aa { background: linear-gradient(135deg, #FF7D0B 0%, #FF9A3D 100%); }
    .profile-mj { background: linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%); }
    .profile-c { background: linear-gradient(135deg, #059669 0%, #10B981 100%); }
    .profile-d { background: linear-gradient(135deg, #DC2626 0%, #EF4444 100%); }
    .profile-e { background: linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%); }
    .profile-f { background: linear-gradient(135deg, #EA580C 0%, #F97316 100%); }
    .profile-g { background: linear-gradient(135deg, #0891B2 0%, #06B6D4 100%); }

    .client-info {
      flex: 1;
    }

    .client-name {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #1F2937;
      margin-bottom: 4px;
    }

    .client-details {
      font-family: 'Inter';
      font-size: 12px;
      color: #6B7280;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .transaction-center {
      flex: 1;
      padding: 0 20px;
    }

    .account-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .account-detail {
      display: flex;
      gap: 8px;
      font-family: 'Inter';
      font-size: 12px;
      color: #374151;
    }

    .detail-label {
      font-weight: 600;
      color: #6B7280;
    }

    .transaction-type-badge {
      padding: 4px 8px;
      border-radius: 6px;
      font-family: 'Inter';
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .transaction-type-badge.deposit {
      background: #D1FAE5;
      color: #065F46;
    }

    .transaction-type-badge.withdrawal {
      background: #FEE2E2;
      color: #991B1B;
    }

    .transaction-type-badge.transfer {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .transaction-description {
      font-style: italic;
      color: #6B7280;
    }

    .status-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-family: 'Inter';
      font-size: 10px;
      font-weight: 600;
    }

    .actif {
      background: #D1FAE5;
      color: #059669;
    }

    .inactif {
      background: #FEE2E2;
      color: #DC2626;
    }

    .transaction-right {
      flex: 0 0 150px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .transaction-amount {
      text-align: right;
      flex: 1;
    }

    .amount {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 16px;
    }

    .positive {
      color: #059669;
    }

    .negative {
      color: #DC2626;
    }

    .neutral {
      color: #6B7280;
    }

    .transaction-type-label {
      font-family: 'Inter';
      font-size: 11px;
      color: #6B7280;
      margin-top: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .print-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: #EBF8FF;
      color: #3B82F6;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .print-btn:hover {
      background: #DBEAFE;
      transform: scale(1.1);
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
    }

    .print-icon {
      width: 14px;
      height: 14px;
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

    /* Modal Styles */
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
      padding: 20px;
    }

    .modal-content {
      background: #FFFFFF;
      border-radius: 15px;
      width: 90%;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.15);
    }

    .large-modal {
      max-width: 800px;
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
      transition: background 0.3s ease;
    }

    .close-btn:hover {
      background: #F3F4F6;
    }

    .close-icon {
      width: 20px;
      height: 20px;
      color: #6B7280;
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
      padding-bottom: 8px;
      border-bottom: 2px solid #E5E7EB;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
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
      font-size: 14px;
      color: #374151;
    }

    .transaction-id {
      font-family: 'Monaco', 'Courier New', monospace;
      font-weight: 600;
      color: #3B82F6;
    }

    .amount-detail {
      font-weight: 700;
      font-size: 16px;
    }

    .fees-amount {
      color: #F59E0B;
      font-weight: 600;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .print-action-btn {
      background: #3B82F6;
      color: white;
    }

    .print-action-btn:hover {
      background: #2563EB;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .action-icon {
      width: 16px;
      height: 16px;
    }

    /* New Transaction Form Styles */
    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .form-row .form-group {
      flex: 1;
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

    .form-input, .form-select, .form-textarea {
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

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-select {
      cursor: pointer;
    }

    .form-textarea {
      resize: vertical;
    }

    .account-balance-info {
      margin-top: 8px;
      font-family: 'Inter';
      font-size: 13px;
      color: #059669;
      font-weight: 500;
    }

    .amount-validation {
      margin-top: 8px;
      font-family: 'Inter';
      font-size: 13px;
    }

    .error-text {
      color: #DC2626;
    }

    .success-text {
      color: #059669;
    }

    .transaction-summary {
      background: #F8FAFC;
      border-radius: 10px;
      padding: 20px;
      margin: 20px 0;
      border: 1px solid #E5E7EB;
    }

    .transaction-summary h3 {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 16px;
      color: #1F2937;
      margin-bottom: 15px;
    }

    .summary-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid #E5E7EB;
    }

    .summary-item:last-child {
      border-bottom: none;
      font-weight: 700;
    }

    .summary-label {
      font-family: 'Inter';
      font-size: 14px;
      color: #6B7280;
    }

    .summary-value {
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      font-weight: 600;
    }

    .total-amount {
      color: #059669;
      font-size: 16px;
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
      background: linear-gradient(135deg, #059669 0%, #10B981 100%);
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
      background: linear-gradient(135deg, #047857 0%, #059669 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(5, 150, 105, 0.4);
    }

    .submit-btn:disabled {
      background: #D1FAE5;
      cursor: not-allowed;
      transform: none;
    }

    /* Invoice Print Styles */
    #invoice-template {
      position: fixed;
      left: -9999px;
      top: 0;
    }

    .invoice {
      width: 210mm;
      min-height: 297mm;
      padding: 20mm;
      background: white;
      font-family: 'Arial', sans-serif;
      color: #333;
      position: relative;
    }

    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #059669;
    }

    .invoice-logo {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .bank-logo {
      width: 80px;
      height: 80px;
      object-fit: contain;
    }

    .logo-text {
      display: flex;
      flex-direction: column;
    }

    .bank-name {
      font-size: 28px;
      font-weight: 700;
      color: #059669;
      margin-bottom: 5px;
    }

    .bank-slogan {
      font-size: 14px;
      color: #6B7280;
      font-style: italic;
    }

    .invoice-title {
      text-align: right;
    }

    .invoice-title h1 {
      font-size: 24px;
      color: #1F2937;
      margin: 0 0 10px 0;
    }

    .invoice-number {
      font-size: 16px;
      color: #3B82F6;
      font-weight: 600;
    }

    .invoice-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      padding: 20px;
      background: #F8FAFC;
      border-radius: 8px;
    }

    .info-section {
      flex: 1;
    }

    .info-section h3 {
      font-size: 16px;
      color: #059669;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #E5E7EB;
    }

    .info-section p {
      margin: 5px 0;
      font-size: 13px;
    }

    .transaction-details, .amount-section, .account-info {
      margin-bottom: 30px;
    }

    .transaction-details h2, .amount-section h2, .account-info h2 {
      font-size: 18px;
      color: #1F2937;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #E5E7EB;
    }

    .details-table, .amount-table, .account-table {
      width: 100%;
      border-collapse: collapse;
    }

    .details-table td, .amount-table td, .account-table td {
      padding: 10px;
      border-bottom: 1px solid #E5E7EB;
      font-size: 13px;
    }

    .details-table tr:last-child td, .amount-table tr:last-child td, .account-table tr:last-child td {
      border-bottom: none;
    }

    .details-table td:first-child, .amount-table td:first-child, .account-table td:first-child {
      width: 40%;
      color: #6B7280;
    }

    .amount-table tr:last-child {
      background: #F8FAFC;
      font-weight: 700;
    }

    .invoice-footer {
      display: flex;
      justify-content: space-between;
      margin-top: 50px;
      padding-top: 30px;
      border-top: 3px solid #059669;
    }

    .signature {
      text-align: center;
    }

    .signature-line {
      width: 200px;
      height: 1px;
      background: #333;
      margin: 40px auto 10px;
    }

    .footer-notes {
      max-width: 50%;
      font-size: 11px;
      color: #6B7280;
    }

    .footer-notes p {
      margin: 3px 0;
    }

    .watermark {
      position: absolute;
      bottom: 20mm;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 72px;
      color: rgba(0, 0, 0, 0.05);
      transform: rotate(-45deg);
      font-weight: 700;
      pointer-events: none;
      user-select: none;
    }
  `]
})
export class ClientTransactionsComponent implements OnInit {
  searchQuery = '';
  typeFilter = '';
  accountFilter = '';
  startDate = '';
  endDate = '';
  currentPage = 1;
  itemsPerPage = 10;
  showModal = false;
  showNewTransactionModal = false;
  selectedTransaction: Transaction | null = null;
  selectedAccount: Account | null = null;

  clientAccounts: Account[] = [
    {
      id: 1,
      numeroCompte: 'CMR0012345678',
      typeCompte: 'Épargne',
      solde: 2500000,
      devise: 'CFA'
    },
    {
      id: 2,
      numeroCompte: 'CMR0087654321',
      typeCompte: 'Courant',
      solde: 1500000,
      devise: 'CFA'
    }
  ];

  newTransaction: any = {
    accountNumber: '',
    type: '',
    amount: null,
    description: '',
    recipientAccount: '',
    recipientName: ''
  };

  transactions: Transaction[] = [
    {
      id: 'TX001',
      clientName: 'AYABA Amina',
      clientInitials: 'AA',
      birthDate: '15/03/1985',
      gender: 'F',
      phone: '+237 691 234 567',
      nationality: 'Camerounaise',
      transactionDate: '2023-01-15',
      transactionTime: '14:30',
      accountNumber: 'CMR0012345678',
      accountType: 'Épargne',
      accountCreationDate: '2020-05-10',
      accountBalance: 2500000,
      accountOwner: 'AYABA Amina',
      accountStatus: 'Actif',
      amount: 50000,
      type: 'deposit',
      description: 'Dépôt d\'argent liquide'
    },
    {
      id: 'TX002',
      clientName: 'MBALLA Jolie',
      clientInitials: 'MJ',
      birthDate: '22/08/1990',
      gender: 'F',
      phone: '+237 677 890 123',
      nationality: 'Camerounaise',
      transactionDate: '2023-01-14',
      transactionTime: '09:15',
      accountNumber: 'CMR0087654321',
      accountType: 'Courant',
      accountCreationDate: '2019-11-22',
      accountBalance: 1500000,
      accountOwner: 'MBALLA Jolie',
      accountStatus: 'Actif',
      amount: 200000,
      type: 'withdrawal',
      description: 'Retrait au guichet'
    },
    {
      id: 'TX003',
      clientName: 'AYABA Amina',
      clientInitials: 'AA',
      birthDate: '15/03/1985',
      gender: 'F',
      phone: '+237 691 234 567',
      nationality: 'Camerounaise',
      transactionDate: '2023-01-13',
      transactionTime: '11:45',
      accountNumber: 'CMR0012345678',
      accountType: 'Épargne',
      accountCreationDate: '2020-05-10',
      accountBalance: 2450000,
      accountOwner: 'AYABA Amina',
      accountStatus: 'Actif',
      amount: 50000,
      type: 'transfer',
      recipientAccount: 'CMR0098765432',
      recipientName: 'DUPONT Jean',
      transactionFees: 500,
      description: 'Virement à Jean Dupont'
    }
  ];

  get filteredTransactions(): Transaction[] {
    let filtered = this.transactions;

    if (this.searchQuery) {
      filtered = filtered.filter(t =>
        t.clientName.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        t.accountNumber.includes(this.searchQuery) ||
        (t.recipientAccount && t.recipientAccount.includes(this.searchQuery))
      );
    }

    if (this.startDate) {
      filtered = filtered.filter(t => t.transactionDate >= this.startDate);
    }

    if (this.endDate) {
      filtered = filtered.filter(t => t.transactionDate <= this.endDate);
    }

    if (this.typeFilter) {
      filtered = filtered.filter(t => t.type === this.typeFilter);
    }

    if (this.accountFilter) {
      filtered = filtered.filter(t => t.accountNumber === this.accountFilter);
    }

    return filtered;
  }

  constructor() {}

  ngOnInit() {}

  applyFilters() {
    this.currentPage = 1;
  }

  openModal(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTransaction = null;
  }

  openNewTransactionModal() {
    this.showNewTransactionModal = true;
  }

  closeNewTransactionModal() {
    this.showNewTransactionModal = false;
    this.newTransaction = {
      accountNumber: '',
      type: '',
      amount: null,
      description: '',
      recipientAccount: '',
      recipientName: ''
    };
    this.selectedAccount = null;
  }

  onAccountChange() {
    this.selectedAccount = this.clientAccounts.find(
      account => account.numeroCompte === this.newTransaction.accountNumber
    ) || null;
  }

  onTransactionTypeChange() {
    if (this.newTransaction.type !== 'transfer') {
      this.newTransaction.recipientAccount = '';
      this.newTransaction.recipientName = '';
    }
  }

  getMaxAmount(): number {
    return this.selectedAccount ? this.selectedAccount.solde : 0;
  }

  calculateFees(): number {
    if (this.newTransaction.type === 'transfer') {
      return Math.min(1000, Math.max(100, this.newTransaction.amount * 0.01));
    }
    return 0;
  }

  calculateTotal(): number {
    const amount = this.newTransaction.amount || 0;
    if (this.newTransaction.type === 'withdrawal') {
      return amount;
    } else if (this.newTransaction.type === 'transfer') {
      return amount + this.calculateFees();
    }
    return amount;
  }

  createTransaction() {
    if (!this.selectedAccount) return;

    const newId = 'TX' + (this.transactions.length + 1).toString().padStart(3, '0');
    const now = new Date();
    const transactionDate = now.toISOString().split('T')[0];
    const transactionTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    const fees = this.newTransaction.type === 'transfer' ? this.calculateFees() : 0;
    const amount = this.newTransaction.amount;
    
    let newBalance = this.selectedAccount.solde;
    if (this.newTransaction.type === 'deposit') {
      newBalance += amount;
    } else if (this.newTransaction.type === 'withdrawal') {
      newBalance -= amount;
    } else if (this.newTransaction.type === 'transfer') {
      newBalance -= (amount + fees);
    }

    const transaction: Transaction = {
      id: newId,
      clientName: 'AYABA Amina', // À remplacer par l'utilisateur connecté
      clientInitials: 'AA',
      birthDate: '15/03/1985',
      gender: 'F',
      phone: '+237 691 234 567',
      nationality: 'Camerounaise',
      transactionDate,
      transactionTime,
      accountNumber: this.newTransaction.accountNumber,
      accountType: this.selectedAccount.typeCompte,
      accountCreationDate: '2020-05-10',
      accountBalance: newBalance,
      accountOwner: 'AYABA Amina',
      accountStatus: 'Actif',
      amount,
      type: this.newTransaction.type,
      recipientAccount: this.newTransaction.recipientAccount,
      recipientName: this.newTransaction.recipientName,
      transactionFees: fees,
      description: this.newTransaction.description
    };

    this.transactions.unshift(transaction);
    
    // Mettre à jour le solde du compte
    const accountIndex = this.clientAccounts.findIndex(
      acc => acc.numeroCompte === this.newTransaction.accountNumber
    );
    if (accountIndex > -1) {
      this.clientAccounts[accountIndex].solde = newBalance;
    }

    this.closeNewTransactionModal();
    console.log('Nouvelle transaction créée:', transaction);
  }

  printInvoice(transaction: Transaction) {
    this.selectedTransaction = transaction;
    
    // Remplir le template de facture
    setTimeout(() => {
      const invoiceContent = document.getElementById('invoice-content');
      if (!invoiceContent) return;

      // Remplir les informations
      const invoiceNumberEl = document.getElementById('invoice-number');
      const clientNameEl = document.getElementById('client-name');
      const clientPhoneEl = document.getElementById('client-phone');
      const clientNationalityEl = document.getElementById('client-nationality');
      const invoiceDateEl = document.getElementById('invoice-date');

      if (invoiceNumberEl) invoiceNumberEl.textContent = transaction.id;
      if (clientNameEl) clientNameEl.textContent = transaction.clientName;
      if (clientPhoneEl) clientPhoneEl.textContent = transaction.phone;
      if (clientNationalityEl) clientNationalityEl.textContent = transaction.nationality;
      if (invoiceDateEl) invoiceDateEl.textContent = new Date().toLocaleDateString('fr-FR');

      const transactionIdEl = document.getElementById('transaction-id');
      const transactionTypeEl = document.getElementById('transaction-type');
      const transactionDatetimeEl = document.getElementById('transaction-datetime');
      const sourceAccountEl = document.getElementById('source-account');

      if (transactionIdEl) transactionIdEl.textContent = transaction.id;
      if (transactionTypeEl) transactionTypeEl.textContent = this.getTransactionTypeLabel(transaction.type);
      if (transactionDatetimeEl) transactionDatetimeEl.textContent =
        `${this.formatDate(transaction.transactionDate)} à ${transaction.transactionTime}`;
      if (sourceAccountEl) sourceAccountEl.textContent = transaction.accountNumber;

      if (transaction.type === 'transfer' && transaction.recipientAccount) {
        const recipientAccountEl = document.getElementById('recipient-account');
        if (recipientAccountEl) recipientAccountEl.textContent = transaction.recipientAccount;
      }

      if (transaction.recipientName) {
        const recipientNameEl = document.getElementById('recipient-name');
        if (recipientNameEl) recipientNameEl.textContent = transaction.recipientName;
      }

      const transactionDescriptionEl = document.getElementById('transaction-description');
      if (transactionDescriptionEl) transactionDescriptionEl.textContent = transaction.description || 'N/A';

      const prefix = this.getAmountPrefix(transaction.type);
      const transactionAmountEl = document.getElementById('transaction-amount');
      if (transactionAmountEl) transactionAmountEl.textContent =
        `${prefix}${transaction.amount.toLocaleString('fr-FR')} CFA`;

      if (transaction.transactionFees) {
        const transactionFeesEl = document.getElementById('transaction-fees');
        if (transactionFeesEl) transactionFeesEl.textContent =
          `${transaction.transactionFees.toLocaleString('fr-FR')} CFA`;
      }

      const total = transaction.transactionFees ? transaction.amount + transaction.transactionFees : transaction.amount;
      const totalAmountEl = document.getElementById('total-amount');
      if (totalAmountEl) totalAmountEl.textContent =
        `${prefix}${total.toLocaleString('fr-FR')} CFA`;

      const accountTypeEl = document.getElementById('account-type');
      const accountBalanceEl = document.getElementById('account-balance');
      const accountStatusEl = document.getElementById('account-status');

      if (accountTypeEl) accountTypeEl.textContent = transaction.accountType;
      if (accountBalanceEl) accountBalanceEl.textContent =
        `${transaction.accountBalance.toLocaleString('fr-FR')} CFA`;
      if (accountStatusEl) accountStatusEl.textContent = transaction.accountStatus;

      const transactionReferenceEl = document.getElementById('transaction-reference');
      if (transactionReferenceEl) transactionReferenceEl.textContent =
        `${transaction.id}-${new Date().getTime()}`;
      // Créer une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      // Styles pour l'impression
      const printStyles = `
        <style>
          @media print {
            body { margin: 0; padding: 0; }
            .invoice { 
              width: 210mm; 
              min-height: 297mm; 
              padding: 20mm; 
              background: white; 
              font-family: 'Arial', sans-serif; 
              color: #333;
              position: relative;
            }
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #059669;
            }
            .invoice-logo { flex: 1; }
            .bank-name {
              font-size: 28px;
              font-weight: 700;
              color: #059669;
              margin-bottom: 5px;
            }
            .bank-slogan {
              font-size: 14px;
              color: #6B7280;
              font-style: italic;
            }
            .invoice-title { text-align: right; }
            .invoice-title h1 {
              font-size: 24px;
              color: #1F2937;
              margin: 0 0 10px 0;
            }
            .invoice-number {
              font-size: 16px;
              color: #3B82F6;
              font-weight: 600;
            }
            .invoice-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              padding: 20px;
              background: #F8FAFC;
              border-radius: 8px;
            }
            .info-section { flex: 1; }
            .info-section h3 {
              font-size: 16px;
              color: #059669;
              margin-bottom: 10px;
              padding-bottom: 5px;
              border-bottom: 1px solid #E5E7EB;
            }
            .info-section p { margin: 5px 0; font-size: 13px; }
            .transaction-details, .amount-section, .account-info { margin-bottom: 30px; }
            .transaction-details h2, .amount-section h2, .account-info h2 {
              font-size: 18px;
              color: #1F2937;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #E5E7EB;
            }
            table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
            td { padding: 10px; border-bottom: 1px solid #E5E7EB; font-size: 13px; }
            tr:last-child td { border-bottom: none; }
            td:first-child { width: 40%; color: #6B7280; }
            .amount-table tr:last-child {
              background: #F8FAFC;
              font-weight: 700;
            }
            .invoice-footer {
              display: flex;
              justify-content: space-between;
              margin-top: 50px;
              padding-top: 30px;
              border-top: 3px solid #059669;
            }
            .signature { text-align: center; }
            .signature-line {
              width: 200px;
              height: 1px;
              background: #333;
              margin: 40px auto 10px;
            }
            .footer-notes {
              max-width: 50%;
              font-size: 11px;
              color: #6B7280;
            }
            .footer-notes p { margin: 3px 0; }
            .watermark {
              position: absolute;
              bottom: 20mm;
              left: 0;
              width: 100%;
              text-align: center;
              font-size: 72px;
              color: rgba(0, 0, 0, 0.05);
              transform: rotate(-45deg);
              font-weight: 700;
              pointer-events: none;
              user-select: none;
            }
          }
        </style>
      `;

      // Écrire le contenu dans la nouvelle fenêtre
      printWindow.document.write(`
        <html>
          <head>
            <title>Facture ${transaction.id}</title>
            ${printStyles}
          </head>
          <body>
            ${invoiceContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      
      // Attendre que le contenu soit chargé avant d'imprimer
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }, 100);
  }

  getTransactionTypeLabel(type: string): string {
    switch(type) {
      case 'deposit': return 'Dépôt';
      case 'withdrawal': return 'Retrait';
      case 'transfer': return 'Virement';
      default: return type;
    }
  }

  getAmountClass(type: string): string {
    switch(type) {
      case 'deposit': return 'positive';
      case 'withdrawal': return 'negative';
      case 'transfer': return 'negative';
      default: return 'neutral';
    }
  }

  getAmountPrefix(type: string): string {
    switch(type) {
      case 'deposit': return '+';
      case 'withdrawal': return '-';
      case 'transfer': return '-';
      default: return '';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.itemsPerPage, this.filteredTransactions.length);
  }

  getTotalPages(): number {
    return Math.ceil(this.filteredTransactions.length / this.itemsPerPage);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
    }
  }
}