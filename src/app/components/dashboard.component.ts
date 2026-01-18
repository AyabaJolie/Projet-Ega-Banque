import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LayoutService } from '../services/layout.service';
import { LucideAngularModule, Home, Users, CreditCard, BarChart3, Settings, LogOut, Search, Bell, Plus, Minus } from 'lucide-angular';

// Interfaces for client data
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

interface Compte {
  id: number;
  numeroCompte: string;
  typeCompte: 'Épargne' | 'Courant' | 'Entreprise' | 'Jeune';
  dateCreation: string;
  solde: number;
  clientId: number;
  proprietaire: string;
  statut: 'Actif' | 'Bloqué' | 'Supprimé' | 'Inactif';
  devise: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, CommonModule, LucideAngularModule],
  template: `
    <div class="dashboard">
      <div class="main-content">
        <!-- Welcome Banner -->
        <div class="welcome-container">
      <!-- Star Decorations -->
      <div class="star-1"></div>
      <div class="star-2"></div>
      <div class="star-3"></div>
      <div class="star-4"></div>
      <div class="star-5"></div>

      <!-- Content -->
      <div class="welcome-text">BONJOUR , {{ currentUser?.nom }}</div>
      <div class="date-text">{{ currentDate }}</div>
      <div class="time-text">{{ currentTime }}</div>
      <div class="hand-icon">👋</div>
    </div>

    <!-- Today Section -->
    <div class="today-title">Aujourd'hui</div>

    <!-- Stats Grid -->
    <div class="stats-grid" *ngIf="isAdmin">
      <div class="stat-card clients-card">
        <div class="stat-number">5,650</div>
        <div class="stat-label">Clients</div>
        <div class="stat-change">↗ +12% ce mois</div>
      </div>

      <div class="stat-card accounts-card">
        <div class="stat-number">6,350</div>
        <div class="stat-label">Comptes</div>
        <div class="stat-change">↗ +8% ce mois</div>
      </div>

      <div class="stat-card cash-card">
        <div class="stat-number">12.1M CFA</div>
        <div class="stat-label">En Caisse</div>
        <div class="stat-change">↗ +5% ce mois</div>
      </div>

      <div class="stat-card transactions-card">
        <div class="stat-number">270</div>
        <div class="stat-label">Transactions</div>
        <div class="stat-change">↗ +15% aujourd'hui</div>
      </div>
    </div>

    <!-- Client Stats Grid -->
    <div class="stats-grid" *ngIf="!isAdmin">
      <div class="stat-card accounts-card">
        <div class="stat-number">{{ clientAccounts.length }}</div>
        <div class="stat-label">Mes Comptes</div>
        <div class="stat-change">Actifs</div>
      </div>

      <div class="stat-card cash-card">
        <div class="stat-number">{{ getClientTotalBalance() | number:'1.0-0' }} CFA</div>
        <div class="stat-label">Solde Total</div>
        <div class="stat-change">Disponible</div>
      </div>

      <div class="stat-card transactions-card">
        <div class="stat-number">{{ clientTransactions.length }}</div>
        <div class="stat-label">Transactions</div>
        <div class="stat-change">Ce mois</div>
      </div>

      <div class="stat-card clients-card">
        <div class="stat-number">{{ getRecentTransactionsCount() }}</div>
        <div class="stat-label">Transactions Récentes</div>
        <div class="stat-change">Aujourd'hui</div>
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="transactions-title">
      Transactions récentes
      <div class="voir-plus" routerLink="/app/transactions">Voir plus</div>
    </div>

    <div class="transactions-container" *ngIf="isAdmin">
      <!-- Table Header -->
      <div class="table-header">
        <div class="header-left">
          <div style="width: 35px;"></div>
          <div class="header-client">Client</div>
        </div>
        <div class="header-right">
                      <div> Opérations</div>
        </div>
      </div>

      <!-- Transaction 1 -->
      <div class="transaction-item">
        <div class="transaction-left">
          <div class="transaction-profile profile-aa">AA</div>
          <div class="client-info">
            <div class="client-name">AYABA Amina</div>
            <div class="client-details">
              <div class="client-detail"><span class="detail-label">Née:</span> 15/03/1985</div>
              <div class="client-detail"><span class="detail-label">Sexe:</span> F</div>
              <div class="client-detail"><span class="detail-label">Tel:</span> +237 691 234 567</div>
              <div class="client-detail"><span class="detail-label">Nat:</span> Camerounaise</div>
            </div>
            <div class="transaction-name">Compte: FR76 1751 2000 3456 7890 1234 567</div>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount positive">
            <div class="amount">+ 25,000 CFA</div>
          </div>
          <div class="transaction-type">DÉPÔT</div>
        </div>
      </div>

      <!-- Transaction 2 -->
      <div class="transaction-item">
        <div class="transaction-left">
          <div class="transaction-profile profile-jm">JM</div>
          <div class="client-info">
            <div class="client-name">MBALLA Jolie</div>
            <div class="client-details">
              <div class="client-detail"><span class="detail-label">Née:</span> 22/08/1990</div>
              <div class="client-detail"><span class="detail-label">Sexe:</span> F</div>
              <div class="client-detail"><span class="detail-label">Tel:</span> +237 677 890 123</div>
              <div class="client-detail"><span class="detail-label">Nat:</span> Camerounaise</div>
            </div>
            <div class="transaction-name">Compte: FR14 2004 1010 0505 0001 3M02 606</div>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount negative">
            <div class="amount">-12,000 CFA</div>
          </div>
          <div class="transaction-type">RETRAIT</div>
        </div>
      </div>

      <!-- Transaction 3 -->
      <div class="transaction-item">
        <div class="transaction-left">
          <div class="transaction-profile profile-kp">KP</div>
          <div class="client-info">
            <div class="client-name">KAMGA Paul</div>
            <div class="client-details">
              <div class="client-detail"><span class="detail-label">Né:</span> 10/12/1978</div>
              <div class="client-detail"><span class="detail-label">Sexe:</span> M</div>
              <div class="client-detail"><span class="detail-label">Tel:</span> +237 654 321 098</div>
              <div class="client-detail"><span class="detail-label">Nat:</span> Camerounaise</div>
            </div>
            <div class="transaction-name">Compte: FR76 3000 6000 0112 3456 7890 189</div>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount positive">
            <div class="amount">+ 75,000 CFA</div>
          </div>
          <div class="transaction-type">DÉPÔT</div>
        </div>
      </div>
    </div>

    <!-- Client Transactions -->
    <div class="transactions-container" *ngIf="!isAdmin">
      <!-- Table Header -->
      <div class="table-header">
        <div class="header-left">
          <div style="width: 35px;"></div>
          <div class="header-client">Transaction</div>
        </div>
        <div class="header-right">
          <div>Montant</div>
        </div>
      </div>

      <!-- Client Transactions -->
      <div class="transaction-item" *ngFor="let transaction of getRecentClientTransactions()">
        <div class="transaction-left">
          <div class="transaction-profile">{{ getClientInitials() }}</div>
          <div class="client-info">
            <div class="client-name">{{ transaction.type === 'deposit' ? 'DÉPÔT' : 'RETRAIT' }}</div>
            <div class="transaction-name">{{ transaction.transactionDate }} {{ transaction.transactionTime }}</div>
            <div class="transaction-name">ID: {{ transaction.id }}</div>
          </div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount" [ngClass]="transaction.type === 'deposit' ? 'positive' : 'negative'">
            <div class="amount">{{ transaction.type === 'deposit' ? '+' : '-' }} {{ transaction.amount | number:'1.0-0' }} CFA</div>
          </div>
          <button class="print-btn" (click)="printInvoice(transaction)">Imprimer Facture</button>
        </div>
      </div>
    </div>
      </div>
    </div>
  `,
  styles: [`
    /* Welcome Container */
    .welcome-container {
      width: 100%;
      height: 150px;
      background: #FF7D0B;
      border-radius: 20px;
      overflow: hidden;
      position: relative;
      margin: 15px 0 25px 0;
    }

    /* Star Decorations */
    .star-1 {
      position: absolute;
      width: 80px;
      height: 60px;
      right: 77px;
      top: 8px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50%;
    }

    .star-2 {
      position: absolute;
      width: 61px;
      height: 61px;
      right: 26px;
      top: -59px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .star-3 {
      position: absolute;
      width: 61px;
      height: 61px;
      right: 167px;
      top: -8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
      transform: matrix(1, 0, 0, -1, 0, 0);
    }

    .star-4 {
      position: absolute;
      width: 80px;
      height: 99px;
      right: 0px;
      top: 78px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .star-5 {
      position: absolute;
      width: 80px;
      height: 181px;
      right: 148px;
      top: 122px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 50%;
    }

    .welcome-text {
      position: absolute;
      left: 80px;
      top: 50%;
      transform: translateY(-50%);
      font-family: 'Irish Grover';
      font-weight: 700;
      font-size: 28px;
      color: #FFFFFF;
      z-index: 10;
    }

    .date-text {
      position: absolute;
      right: 40px;
      top: 40px;
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 16px;
      color: #000000;
      z-index: 20;
    }

    .time-text {
      position: absolute;
      right: 40px;
      top: 65px;
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 16px;
      color: #000000;
      z-index: 20;
    }

    .hand-icon {
      position: absolute;
      left: 30px;
      top: 30px;
      font-size: 32px;
      transform: rotate(105.42deg);
    }

    /* Today Title */
    .today-title {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 24px;
      color: #1F2937;
      margin: 40px 0 25px 0;
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 40px;
    }

    /* Stats Cards */
    .stat-card {
      background: #FFFFFF;
      border-radius: 15px;
      padding: 25px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .stat-card:hover {
      transform: translateY(-2px);
      box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.12);
    }

    .stat-number {
      font-family: 'Work Sans';
      font-weight: 700;
      font-size: 28px;
      line-height: 1.2;
      margin-bottom: 8px;
    }

    .stat-label {
      font-family: 'Inter';
      font-weight: 500;
      font-size: 14px;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }

    .stat-change {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 12px;
      color: #16a34a;
    }

    .clients-card .stat-number {
      color: #3B82F6;
    }

    .accounts-card .stat-number {
      color: #EAB308;
    }

    .cash-card .stat-number {
      color: #22C55E;
    }

    .transactions-card .stat-number {
      color: #8B5CF6;
    }

    /* Transactions Title */
    .transactions-title {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 24px;
      color: #1F2937;
      margin: 40px 0 25px 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Voir Plus */
    .voir-plus {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 15px;
      color: #3B82F6;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }

    .voir-plus:hover {
      background: rgba(59, 130, 246, 0.1);
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
      flex: 1;
    }

    .header-client {
      flex: 1;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 40px;
    }

    .transaction-item {
      padding: 20px 25px;
      display: flex;
      align-items: center;
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
      flex: 1;
    }

    .client-info {
      flex: 1;
    }

    .client-name {
      font-family: 'Poppins';
      font-weight: 600;
      font-size: 16px;
      color: #000000;
      margin-bottom: 4px;
    }

    .client-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2px 16px;
      font-family: 'Inter';
      font-size: 12px;
      color: #6B7280;
    }

    .client-detail {
      display: flex;
      gap: 4px;
    }

    .detail-label {
      font-weight: 500;
      min-width: 35px;
    }

    .transaction-right {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 4px;
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

    .transaction-name {
      font-family: 'Poppins';
      font-weight: 500;
      font-size: 14px;
      color: #ADA7A7;
      margin-top: 4px;
    }

    .amount {
      font-family: 'Poppins';
      font-weight: 500;
      font-size: 16px;
    }

    .transaction-type {
      font-family: 'Poppins';
      font-weight: 500;
      font-size: 16px;
      color: #ADA7A7;
    }

    .transaction-amount.positive .amount {
      color: #16AC10;
    }

    .transaction-amount.negative .amount {
      color: #C40303;
    }

    .print-btn {
      background: #3B82F6;
      color: #FFFFFF;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      margin-top: 8px;
      transition: background 0.3s ease;
    }

    .print-btn:hover {
      background: #2563EB;
    }

    /* Dashboard Layout */
    .dashboard {
      display: flex;
    }
    .main-content {
      flex: 1;
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  currentUser: any;
  isAdmin = false;
  currentDate = 'Chargement...';
  currentTime = 'Chargement...';
  private interval: any;
  clientAccounts: Compte[] = [];
  clientTransactions: Transaction[] = [];

  constructor(private authService: AuthService, private layoutService: LayoutService, private cdr: ChangeDetectorRef) {
    this.updateDateTime();
  }

  ngOnInit() {
    this.layoutService.setTitle('Tableau de bord');
    this.currentUser = this.authService.getCurrentUser();
    this.isAdmin = this.authService.isAdmin();
    this.updateDateTime();
    this.interval = setInterval(() => {
      this.updateDateTime();
      this.cdr.detectChanges();
    }, 1000);

    // Load client data if not admin
    if (!this.isAdmin) {
      this.loadClientData();
    }
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  updateDateTime() {
    const now = new Date();
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

    this.currentDate = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    this.currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  loadClientData() {
    // Mock client accounts
    this.clientAccounts = [
      {
        id: 1,
        numeroCompte: 'CMR0012345678',
        typeCompte: 'Courant',
        dateCreation: '15/01/2023',
        solde: 2500000,
        clientId: 1,
        proprietaire: 'Client',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 2,
        numeroCompte: 'CMR0087654321',
        typeCompte: 'Épargne',
        dateCreation: '22/03/2023',
        solde: 1200000,
        clientId: 1,
        proprietaire: 'Client',
        statut: 'Actif',
        devise: 'CFA'
      }
    ];

    // Mock client transactions
    this.clientTransactions = [
      {
        id: 'TXN001',
        clientName: 'CLIENT',
        firstName: 'Client',
        clientInitials: 'CL',
        birthDate: '01/01/1990',
        gender: 'M',
        address: 'Yaoundé, Cameroun',
        phone: '+237 691 234 567',
        email: 'client@gmail.com',
        nationality: 'Camerounaise',
        transactionDate: '15/03/2023',
        transactionTime: '14:30',
        accountNumber: 'CMR0012345678',
        amount: 25000,
        type: 'deposit'
      },
      {
        id: 'TXN002',
        clientName: 'CLIENT',
        firstName: 'Client',
        clientInitials: 'CL',
        birthDate: '01/01/1990',
        gender: 'M',
        address: 'Yaoundé, Cameroun',
        phone: '+237 691 234 567',
        email: 'client@gmail.com',
        nationality: 'Camerounaise',
        transactionDate: '16/03/2023',
        transactionTime: '09:15',
        accountNumber: 'CMR0012345678',
        amount: 12000,
        type: 'withdrawal'
      },
      {
        id: 'TXN003',
        clientName: 'CLIENT',
        firstName: 'Client',
        clientInitials: 'CL',
        birthDate: '01/01/1990',
        gender: 'M',
        address: 'Yaoundé, Cameroun',
        phone: '+237 691 234 567',
        email: 'client@gmail.com',
        nationality: 'Camerounaise',
        transactionDate: '17/03/2023',
        transactionTime: '11:45',
        accountNumber: 'CMR0087654321',
        amount: 75000,
        type: 'deposit'
      }
    ];
  }

  getClientTotalBalance(): number {
    return this.clientAccounts.reduce((total, account) => total + account.solde, 0);
  }

  getRecentTransactionsCount(): number {
    const today = new Date().toLocaleDateString('fr-FR');
    return this.clientTransactions.filter(t => t.transactionDate === today).length;
  }

  getRecentClientTransactions(): Transaction[] {
    return this.clientTransactions.slice(0, 3); // Return last 3 transactions
  }

  getClientInitials(): string {
    return this.currentUser?.nom?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'CL';
  }

  printInvoice(transaction: Transaction) {
    const invoiceContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ccc;">
        <h1 style="text-align: center; color: #333;">Facture de Transaction</h1>
        <div style="margin: 20px 0;">
          <h3>Informations Client</h3>
          <p><strong>Nom:</strong> ${transaction.clientName} ${transaction.firstName}</p>
          <p><strong>Email:</strong> ${transaction.email}</p>
          <p><strong>Téléphone:</strong> ${transaction.phone}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3>Détails de la Transaction</h3>
          <p><strong>ID Transaction:</strong> ${transaction.id}</p>
          <p><strong>Date:</strong> ${transaction.transactionDate} ${transaction.transactionTime}</p>
          <p><strong>Numéro de compte:</strong> ${transaction.accountNumber}</p>
          <p><strong>Type:</strong> ${transaction.type === 'deposit' ? 'Dépôt' : 'Retrait'}</p>
          <p><strong>Montant:</strong> ${transaction.amount.toLocaleString()} CFA</p>
        </div>
        <div style="text-align: center; margin-top: 40px; color: #666;">
          <p>Merci d'avoir utilisé nos services bancaires.</p>
        </div>
      </div>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(invoiceContent);
      printWindow.document.close();
      printWindow.print();
    }
  }

  logout() {
    this.authService.logout();
  }
}