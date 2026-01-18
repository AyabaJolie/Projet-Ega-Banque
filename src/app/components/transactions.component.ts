import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, User as AuthUser } from '../services/auth.service';
import { LucideAngularModule, Home, Users, CreditCard, BarChart3, Settings, LogOut, Search, Bell, User, X } from 'lucide-angular';

interface Transaction {
  id: string;
  clientName: string;
  firstName: string;
  clientInitials: string;
  birthDate: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  nationality: string;
  transactionDate: string;
  transactionTime: string;
  accountNumber: string;
  amount: number;
  type: 'deposit' | 'withdrawal';
}

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title">Historique des Transactions</div>
        </div>

        <!-- Search and Filter Controls -->
        <div class="controls-container">
          <div class="search-container">
            <lucide-icon name="search" class="search-icon"></lucide-icon>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="filterTransactions()"
              placeholder="Rechercher par nom, prénom, ID, compte, téléphone, email, adresse..."
              class="search-input"
            />
          </div>
          <div class="filter-container">
            <select [(ngModel)]="typeFilter" (change)="filterTransactions()" class="filter-select">
              <option value="">Tous les types</option>
              <option value="deposit">Dépôts</option>
              <option value="withdrawal">Retraits</option>
            </select>
          </div>
          <div class="date-filter-container">
            <input
              type="date"
              [(ngModel)]="dateFilter"
              (change)="filterTransactions()"
              class="date-filter-input"
            />
          </div>
        </div>

        <!-- Transactions Container -->
        <div class="transactions-container">
        <!-- Table Header -->
          <div class="table-header">
            <div class="header-date">Date Transaction</div>
            <div class="header-amount">Montant</div>
            <div class="header-account">Compte Destination</div>
          </div>

          <!-- Transaction Rows -->
          <div
            *ngFor="let transaction of filteredTransactions"
            class="transaction-row"
            (click)="openModal(transaction)"
          >
            <div class="transaction-date">{{ transaction.transactionDate }} {{ transaction.transactionTime }}</div>
            <div
              class="transaction-amount"
              [ngClass]="transaction.type === 'deposit' ? 'positive' : 'negative'"
            >
              {{ transaction.type === 'deposit' ? '+' : '-' }} {{ transaction.amount | number:'1.0-0' }} CFA
            </div>
            <div class="transaction-account">{{ transaction.accountNumber }}</div>
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
              <h3>Informations Client</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Nom:</span>
                  <span>{{ selectedTransaction.clientName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Prénom:</span>
                  <span>{{ selectedTransaction.firstName }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date de naissance:</span>
                  <span>{{ selectedTransaction.birthDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Sexe:</span>
                  <span>{{ selectedTransaction.gender === 'F' ? 'Féminin' : 'Masculin' }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Adresse:</span>
                  <span>{{ selectedTransaction.address }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Téléphone:</span>
                  <span>{{ selectedTransaction.phone }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Courriel:</span>
                  <span>{{ selectedTransaction.email }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Nationalité:</span>
                  <span>{{ selectedTransaction.nationality }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>Informations Transaction</h3>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">ID Transaction:</span>
                  <span>{{ selectedTransaction.id }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Date:</span>
                  <span>{{ selectedTransaction.transactionDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Heure:</span>
                  <span>{{ selectedTransaction.transactionTime }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Numéro de compte:</span>
                  <span>{{ selectedTransaction.accountNumber }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Montant:</span>
                  <span class="amount-detail {{ selectedTransaction.type === 'deposit' ? 'positive' : 'negative' }}">
                    {{ selectedTransaction.type === 'deposit' ? '+' : '-' }} {{ selectedTransaction.amount | number:'1.0-0' }} CFA
                  </span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Type:</span>
                  <span>{{ selectedTransaction.type === 'deposit' ? 'Dépôt' : 'Retrait' }}</span>
                </div>
              </div>
            </div>

            <div class="modal-actions">
              <button class="history-btn" (click)="viewClientHistory(selectedTransaction); closeModal()">Voir Historique</button>
            </div>
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

    /* Transactions Container */
    .transactions-container {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 14px 42px rgba(8, 15, 52, 0.06);
      overflow: hidden;
      margin-bottom: 30px;
    }

    /* Table Header */
    .table-header {
      background: #f8f9fa;
      padding: 20px 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #e2e8f0;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
      flex: 2;
    }

    .header-client {
      flex: 1;
    }

    .header-transaction-info {
      flex: 1;
      text-align: center;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .transaction-item {
      padding: 20px 25px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      border-bottom: 1px solid #f1f5f9;
      background: #FFFFFF;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .transaction-item:hover {
      background: rgba(59, 130, 246, 0.05);
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04);
      border-left: 3px solid #3B82F6;
    }

    .transaction-left {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      flex: 2;
    }

    .client-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .client-name {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 16px;
      color: #000000;
    }

    .client-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px 16px;
      font-family: 'Inter';
      font-size: 12px;
      color: #6B7280;
    }

    .transaction-details {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 4px 16px;
      font-family: 'Inter';
      font-size: 12px;
      color: #3B82F6;
      background: rgba(59, 130, 246, 0.05);
      padding: 8px 12px;
      border-radius: 6px;
      border-left: 3px solid #3B82F6;
    }

    .transaction-detail {
      display: flex;
      gap: 4px;
    }

    .detail-label {
      font-weight: 600;
      min-width: 45px;
    }

    .transaction-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
      margin-top: 8px;
    }

    .transaction-item:last-child {
      border-bottom: none;
    }

    .transaction-profile {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #FFFFFF;
      font-weight: 600;
      font-size: 14px;
      margin-top: 4px;
    }

    .profile-aa {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .profile-jm {
      background: #DCFCE7;
      color: #166534;
    }

    .profile-kp {
      background: #FEF3C7;
      color: #92400E;
    }

    .profile-nm {
      background: #F3E8FF;
      color: #5B21B6;
    }

    .profile-tj {
      background: #FEF3C7;
      color: #92400E;
    }

    .profile-fs {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .profile-ed {
      background: #DCFCE7;
      color: #166534;
    }

    .amount {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 16px;
    }

    .transaction-type {
      font-family: 'Poppins';
      font-weight: 500;
      font-size: 14px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .transaction-amount.positive {
      color: #16AC10;
    }

    .transaction-amount.negative {
      color: #C40303;
    }

    /* Search and Filter Controls */
    .controls-container {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
      align-items: center;
      flex-wrap: wrap;
      justify-content: space-between;
    }

    .search-container {
      position: relative;
      flex: none;
      min-width: 300px;
      max-width: 400px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #6B7280;
    }

    .search-input {
      width: 100%;
      padding: 12px 12px 12px 40px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      transition: all 0.3s ease;
    }

    .search-input:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-container {
      min-width: 200px;
      flex-shrink: 0;
    }

    .filter-select {
      width: 100%;
      padding: 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .date-filter-container {
      min-width: 200px;
      flex-shrink: 0;
    }

    .date-filter-input {
      width: 100%;
      padding: 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .date-filter-input:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    @media (max-width: 768px) {
      .controls-container {
        flex-direction: column;
        align-items: stretch;
      }

      .search-container {
        min-width: unset;
        max-width: unset;
      }

      .filter-container {
        min-width: unset;
      }
    }

    /* Table Styles */
    .table-header {
      display: grid;
      grid-template-columns: 1fr 100px 140px;
      gap: 12px;
      background: #f8f9fa;
      padding: 16px 25px;
      border-bottom: 2px solid #e2e8f0;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 11px;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: sticky;
      top: 0;
      z-index: 10;
    }

    .header-id, .header-nom, .header-prenom, .header-naissance, .header-sexe, .header-adresse, .header-telephone, .header-courriel, .header-nationalite, .header-date-time, .header-account, .header-amount, .header-type {
      text-align: left;
      white-space: nowrap;
    }

    .transaction-row {
      display: grid;
      grid-template-columns: 1fr 100px 140px;
      gap: 12px;
      padding: 16px 25px;
      border-bottom: 1px solid #f1f5f9;
      background: #FFFFFF;
      transition: all 0.3s ease;
      cursor: pointer;
      align-items: center;
    }

    .transaction-row:hover {
      background: rgba(59, 130, 246, 0.05);
      box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }

    .transaction-row:last-child {
      border-bottom: none;
    }

    .transaction-client-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .client-name {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 16px;
      color: #000000;
    }

    .client-details {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-family: 'Inter';
      font-size: 12px;
      color: #6B7280;
    }

    .transaction-id {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #3B82F6;
    }

    .transaction-date-time {
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
    }

    .transaction-account {
      font-family: 'Inter';
      font-weight: 500;
      font-size: 14px;
      color: #6B7280;
    }

    .transaction-client {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 14px;
      color: #000000;
    }

    .transaction-amount {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 14px;
    }

    .transaction-type {
      font-family: 'Poppins';
      font-weight: 500;
      font-size: 12px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
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
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }

    .modal-content {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 20px 60px rgba(0, 0, 0, 0.15);
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 25px 30px;
      border-bottom: 1px solid #e2e8f0;
    }

    .modal-header h2 {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 24px;
      color: #1F2937;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      cursor: pointer;
      padding: 5px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.3s ease;
    }

    .close-btn:hover {
      background: rgba(0, 0, 0, 0.1);
    }

    .close-icon {
      width: 24px;
      height: 24px;
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
      font-size: 18px;
      color: #1F2937;
      margin-bottom: 20px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .detail-label {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #374151;
    }

    .detail-item span:last-child {
      font-family: 'Inter';
      font-size: 14px;
      color: #6B7280;
    }

    .amount-detail {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 16px;
    }

    .amount-detail.positive {
      color: #16AC10;
    }

    .amount-detail.negative {
      color: #C40303;
    }

    .modal-actions {
      display: flex;
      justify-content: center;
      padding-top: 20px;
      border-top: 1px solid #e2e8f0;
    }

    .history-btn {
      background: #3B82F6;
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: background 0.3s ease;
    }

    .history-btn:hover {
      background: #2563EB;
    }


  `]
})
export class TransactionsComponent implements OnInit {
  searchQuery: string = '';
  typeFilter: string = '';
  dateFilter: string = '';
  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  showModal: boolean = false;
  selectedTransaction: Transaction | null = null;
  currentUser: AuthUser | null = null;
  isClient: boolean = false;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadTransactions();
    this.currentUser = this.authService.getCurrentUser();
    this.isClient = this.authService.isClient();
    if (this.isClient) {
      this.filterClientTransactions();
    }
  }

  loadTransactions() {
    this.transactions = [
      {
        id: 'TXN001',
        clientName: 'AYABA',
        firstName: 'Amina',
        clientInitials: 'AA',
        birthDate: '15/03/1985',
        gender: 'F',
        address: 'Yaoundé, Cameroun',
        phone: '+237 691 234 567',
        email: 'amina.ayaba@example.com',
        nationality: 'Camerounaise',
        transactionDate: '15/03/2023',
        transactionTime: '14:30',
        accountNumber: 'CO001',
        amount: 25000,
        type: 'deposit'
      },
      {
        id: 'TXN002',
        clientName: 'MBALLA',
        firstName: 'Jolie',
        clientInitials: 'MJ',
        birthDate: '22/08/1990',
        gender: 'F',
        address: 'Douala, Cameroun',
        phone: '+237 677 890 123',
        email: 'jolie.mballa@example.com',
        nationality: 'Camerounaise',
        transactionDate: '16/03/2023',
        transactionTime: '09:15',
        accountNumber: 'CO001',
        amount: 12000,
        type: 'withdrawal'
      },
      {
        id: 'TXN003',
        clientName: 'KAMGA',
        firstName: 'Paul',
        clientInitials: 'KP',
        birthDate: '10/12/1978',
        gender: 'M',
        address: 'Bafoussam, Cameroun',
        phone: '+237 654 321 098',
        email: 'paul.kamga@example.com',
        nationality: 'Camerounaise',
        transactionDate: '17/03/2023',
        transactionTime: '11:45',
        accountNumber: 'CO001',
        amount: 75000,
        type: 'deposit'
      },
      {
        id: 'TXN004',
        clientName: 'NGOUAN',
        firstName: 'Marie',
        clientInitials: 'NM',
        birthDate: '05/06/1988',
        gender: 'F',
        address: 'Garoua, Cameroun',
        phone: '+237 699 456 789',
        email: 'marie.ngouan@example.com',
        nationality: 'Camerounaise',
        transactionDate: '18/03/2023',
        transactionTime: '16:20',
        accountNumber: 'CO001',
        amount: 5000,
        type: 'withdrawal'
      },
      {
        id: 'TXN005',
        clientName: 'TCHOUA',
        firstName: 'Jean',
        clientInitials: 'TJ',
        birthDate: '18/11/1982',
        gender: 'M',
        address: 'Bamenda, Cameroun',
        phone: '+237 655 789 012',
        email: 'jean.tchoua@example.com',
        nationality: 'Camerounaise',
        transactionDate: '19/03/2023',
        transactionTime: '13:10',
        accountNumber: 'CO001',
        amount: 30000,
        type: 'deposit'
      },
      {
        id: 'TXN006',
        clientName: 'FOUDA',
        firstName: 'Sophie',
        clientInitials: 'FS',
        birthDate: '30/04/1995',
        gender: 'F',
        address: 'Limbe, Cameroun',
        phone: '+237 676 543 210',
        email: 'sophie.fouda@example.com',
        nationality: 'Camerounaise',
        transactionDate: '20/03/2023',
        transactionTime: '10:25',
        accountNumber: 'CO001',
        amount: 15000,
        type: 'withdrawal'
      },
      {
        id: 'TXN007',
        clientName: 'EKOUA',
        firstName: 'David',
        clientInitials: 'ED',
        birthDate: '12/09/1987',
        gender: 'M',
        address: 'Ngaoundéré, Cameroun',
        phone: '+237 690 123 456',
        email: 'david.ekoua@example.com',
        nationality: 'Camerounaise',
        transactionDate: '21/03/2023',
        transactionTime: '15:30',
        accountNumber: 'CO001',
        amount: 45000,
        type: 'deposit'
      }
    ];

    this.filteredTransactions = [...this.transactions];
  }

  filterTransactions() {
    let filtered = [...this.transactions];

    // Apply search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(transaction =>
        transaction.clientName.toLowerCase().includes(query) ||
        transaction.firstName.toLowerCase().includes(query) ||
        transaction.id.toLowerCase().includes(query) ||
        transaction.accountNumber.toLowerCase().includes(query) ||
        transaction.phone.includes(query) ||
        transaction.email.toLowerCase().includes(query) ||
        transaction.address.toLowerCase().includes(query)
      );
    }

    // Apply type filter
    if (this.typeFilter) {
      filtered = filtered.filter(transaction => transaction.type === this.typeFilter);
    }

    // Apply date filter
    if (this.dateFilter) {
      filtered = filtered.filter(transaction => transaction.transactionDate === this.dateFilter);
    }

    this.filteredTransactions = filtered;
  }

  openModal(transaction: Transaction) {
    this.selectedTransaction = transaction;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedTransaction = null;
  }

  viewClientHistory(transaction: Transaction) {
    // Filter transactions by the client's account number
    this.filteredTransactions = this.transactions.filter(t => t.accountNumber === transaction.accountNumber);
    // Reset filters to show all transactions for this client
    this.searchQuery = '';
    this.typeFilter = '';
    this.dateFilter = '';
  }

  filterClientTransactions() {
    // For client, show only their transactions (assuming email is client@gmail.com)
    this.filteredTransactions = this.transactions.filter(t => t.email === 'client@gmail.com');
  }

  logout() {
    this.authService.logout();
  }
}