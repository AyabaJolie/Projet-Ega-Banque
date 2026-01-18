 import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LayoutService } from '../services/layout.service';
import { ApiService } from '../services/api.service';
import { LucideAngularModule, Home, Users, CreditCard, BarChart3, User, Settings, LogOut, Search, Bell, Plus, Eye, Edit, Trash2, Filter, Lock, Unlock } from 'lucide-angular';

// Interface pour les comptes
export interface Compte {
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
  selector: 'app-comptes',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title">Gestion des Comptes</div>
          <button class="new-account-btn" (click)="openNewAccountModal()">
            <lucide-icon name="plus" class="plus-icon"></lucide-icon>
            Nouveau Compte
          </button>
        </div>
        
        <!-- Filters Section -->
        <div class="filters-section">
          <div class="search-filter">
            <lucide-icon name="search" class="search-icon"></lucide-icon>
            <input type="text" placeholder="Rechercher un compte..." class="filter-input" [(ngModel)]="searchTerm" (input)="applyFilters()">
          </div>
          
          <div class="filter-dropdown">
            <lucide-icon name="filter" class="filter-icon"></lucide-icon>
            <select class="filter-select" [(ngModel)]="typeFilter" (change)="applyFilters()">
              <option value="">Tous les types</option>
              <option value="Courant">Courant</option>
              <option value="Épargne">Épargne</option>
             
            </select>
          </div>

          <div class="filter-dropdown">
            <lucide-icon name="filter" class="filter-icon"></lucide-icon>
            <select class="filter-select" [(ngModel)]="statutFilter" (change)="applyFilters()">
              <option value="">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
             
            </select>
          </div>
        </div>
        
        
        
        <!-- Comptes Table -->
        <div class="table-container">
          <table class="comptes-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Numéro de compte</th>
                <th>Type de compte</th>
                <th>Date de création</th>
                <th>Solde</th>
                <th>Propriétaire</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
  <tr class="table-row">
    <td>CPT001</td>
    <td class="account-number">TG53 3001 0000 1234 5678</td>
    <td><span class="account-type-badge courant">Courant</span></td>
    <td>2024-03-12</td>
    <td class="solde">250 000 FCFA</td>
    <td>Kossi AGBESSI</td>
    <td><span class="status-badge actif">Actif</span></td>
    <td class="actions">
      <button class="action-btn view-btn"><lucide-icon name="eye"></lucide-icon></button>
      <button class="action-btn edit-btn"><lucide-icon name="edit"></lucide-icon></button>
      <button class="action-btn delete-btn"><lucide-icon name="trash-2"></lucide-icon></button>
      <button class="action-btn block-btn" title="Bloquer le compte">
        <lucide-icon name="lock"></lucide-icon>
      </button>
    </td>
  </tr>

  <tr class="table-row">
    <td>CPT002</td>
    <td class="account-number">BJ29 3000 2000 9876 5432</td>
    <td><span class="account-type-badge epargne">Épargne</span></td>
    <td>2023-11-05</td>
    <td class="solde">1 200 000 FCFA</td>
    <td>Aïcha SOGLO</td>
    <td><span class="status-badge actif">Actif</span></td>
    <td class="actions">
      <button class="action-btn view-btn"><lucide-icon name="eye"></lucide-icon></button>
      <button class="action-btn edit-btn"><lucide-icon name="edit"></lucide-icon></button>
      <button class="action-btn delete-btn"><lucide-icon name="trash-2"></lucide-icon></button>
      <button class="action-btn block-btn" title="Bloquer le compte">
        <lucide-icon name="lock"></lucide-icon>
      </button>
    </td>
  </tr>

  <tr class="table-row">
    <td>CPT003</td>
    <td class="account-number">CI05 0100 0100 4567 8901</td>
    <td><span class="account-type-badge courant">Courant</span></td>
    <td>2022-07-19</td>
    <td class="solde">450 000 FCFA</td>
    <td>Yao KOUASSI</td>
    <td><span class="status-badge bloque">Bloqué</span></td>
    <td class="actions">
      <button class="action-btn view-btn"><lucide-icon name="eye"></lucide-icon></button>
      <button class="action-btn edit-btn"><lucide-icon name="edit"></lucide-icon></button>
      <button class="action-btn delete-btn"><lucide-icon name="trash-2"></lucide-icon></button>
      <button class="action-btn block-btn" title="Débloquer le compte">
        <lucide-icon name="unlock"></lucide-icon>
      </button>
    </td>
  </tr>

  <tr class="table-row">
    <td>CPT004</td>
    <td class="account-number">SN08 0010 0001 2345 6789</td>
    <td><span class="account-type-badge epargne">Épargne</span></td>
    <td>2021-02-28</td>
    <td class="solde">3 000 000 FCFA</td>
    <td>Mamadou DIOP</td>
    <td><span class="status-badge actif">Actif</span></td>
    <td class="actions">
      <button class="action-btn view-btn"><lucide-icon name="eye"></lucide-icon></button>
      <button class="action-btn edit-btn"><lucide-icon name="edit"></lucide-icon></button>
      <button class="action-btn delete-btn"><lucide-icon name="trash-2"></lucide-icon></button>
      <button class="action-btn block-btn"><lucide-icon name="lock"></lucide-icon></button>
    </td>
  </tr>

  <tr class="table-row">
    <td>CPT005</td>
    <td class="account-number">TG76 3001 0000 1122 3344</td>
    <td><span class="account-type-badge courant">Courant</span></td>
    <td>2024-06-01</td>
    <td class="solde">98 000 FCFA</td>
    <td>Ama MENSAH</td>
    <td><span class="status-badge actif">Actif</span></td>
    <td class="actions">
      <button class="action-btn view-btn"><lucide-icon name="eye"></lucide-icon></button>
      <button class="action-btn edit-btn"><lucide-icon name="edit"></lucide-icon></button>
      <button class="action-btn delete-btn"><lucide-icon name="trash-2"></lucide-icon></button>
      <button class="action-btn block-btn"><lucide-icon name="lock"></lucide-icon></button>
    </td>
  </tr>

  <tr class="table-row">
    <td>CPT006</td>
    <td class="account-number">BF91 4000 5000 6677 8899</td>
    <td><span class="account-type-badge epargne">Épargne</span></td>
    <td>2020-09-14</td>
    <td class="solde">1 750 000 FCFA</td>
    <td>Issa OUEDRAOGO</td>
    <td><span class="status-badge bloque">Bloqué</span></td>
    <td class="actions">
      <button class="action-btn view-btn"><lucide-icon name="eye"></lucide-icon></button>
      <button class="action-btn edit-btn"><lucide-icon name="edit"></lucide-icon></button>
      <button class="action-btn delete-btn"><lucide-icon name="trash-2"></lucide-icon></button>
      <button class="action-btn block-btn"><lucide-icon name="unlock"></lucide-icon></button>
    </td>
  </tr>

  <tr class="table-row">
    <td>CPT007</td>
    <td class="account-number">CM42 1000 2000 3344 5566</td>
    <td><span class="account-type-badge courant">Courant</span></td>
    <td>2023-01-10</td>
    <td class="solde">610 000 FCFA</td>
    <td>Chantal NKOMO</td>
    <td><span class="status-badge actif">Actif</span></td>
    <td class="actions">
      <button class="action-btn view-btn"><lucide-icon name="eye"></lucide-icon></button>
      <button class="action-btn edit-btn"><lucide-icon name="edit"></lucide-icon></button>
      <button class="action-btn delete-btn"><lucide-icon name="trash-2"></lucide-icon></button>
      <button class="action-btn block-btn"><lucide-icon name="lock"></lucide-icon></button>
    </td>
  </tr>
</tbody>

          </table>
        </div>
        
        <!-- Pagination -->
        <div class="pagination">
          <div class="pagination-info">
            Affichage {{ getStartIndex() + 1 }} à {{ getEndIndex() }}
            sur {{ filteredComptes.length }} comptes
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

    /* Filters Section */
    .filters-section {
      display: flex;
      gap: 20px;
      margin-bottom: 30px;
    }

    .search-filter {
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

    .filter-input {
      flex: 1;
      height: 40px;
      border: none;
      outline: none;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
    }

    .filter-input::placeholder {
      color: #9CA3AF;
    }

    .filter-dropdown {
      display: flex;
      align-items: center;
      background: #FFFFFF;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      padding: 0 14px;
      gap: 10px;
      min-width: 200px;
    }

    .filter-icon {
      width: 16px;
      height: 16px;
      color: #6B7280;
    }

    .filter-select {
      height: 40px;
      border: none;
      outline: none;
      background: transparent;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      cursor: pointer;
    }

    /* Table Container */
    .table-container {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      overflow-x: auto;
    }

    .comptes-table {
      width: 100%;
      border-collapse: collapse;
    }

    .comptes-table thead {
      background: #f5f5f5;
    }

    .comptes-table th {
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

    .comptes-table th:first-child {
      border-top-left-radius: 12px;
    }

    .comptes-table th:last-child {
      border-top-right-radius: 12px;
    }

    .comptes-table th::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #3B82F6;
    }

    .comptes-table td {
      padding: 16px 12px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
    }

    .table-row:hover {
      background: #F9FAFB;
    }

    .account-number {
      font-family: 'Inter';
      font-weight: 600;
      color: #1F2937;
      letter-spacing: 1px;
    }

    .solde {
      font-weight: 600;
      color: #059669;
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

    /* Status Badges */
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .actif {
      background: #D1FAE5;
      color: #065F46;
    }

    .bloque {
      background: #FEE2E2;
      color: #DC2626;
    }

    .inactif {
      background: #F3F4F6;
      color: #6B7280;
    }

    .actions {
      display: flex;
      gap: 8px;
    }

    .action-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .view-btn {
      background: #EBF8FF;
      color: #3B82F6;
    }

    .view-btn:hover {
      background: #DBEAFE;
    }

    .edit-btn {
      background: #FEF3C7;
      color: #D97706;
    }

    .edit-btn:hover {
      background: #FDE68A;
    }

    .delete-btn {
      background: #FEE2E2;
      color: #DC2626;
    }

    .delete-btn:hover {
      background: #FECACA;
    }

    .block-btn {
      background: #F3E8FF;
      color: #7C3AED;
    }

    .block-btn:hover {
      background: #E9D5FF;
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
    /* Dashboard Layout */
    .dashboard {
      display: flex;
    }
    .sidebar {
      width: 250px;
      height: 100vh;
      background: #FFFFFF;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 20px 0;
    }
    .logo {
      width: 80px;
      height: 80px;
      margin-bottom: 30px;
    }
    /* Menu Items */
    .menu-item {
      width: 100%;
      padding: 15px 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      cursor: pointer;
      transition: all 0.3s ease;
      border-radius: 0 20px 20px 0;
      margin-bottom: 5px;
    }
    .menu-item:hover {
      background: #F3F4F6;
      transform: translateX(5px);
    }
    .menu-item .menu-icon {
      width: 20px;
      height: 20px;
      color: #6B7280;
    }
    .menu-item span {
      font-family: 'Work Sans';
      font-weight: 500;
      font-size: 16px;
      color: #374151;
    }
    .main-content {
      flex: 1;
    }
  `]
})
export class ComptesComponent implements OnInit {
  allComptes: Compte[] = [];
  filteredComptes: Compte[] = [];
  currentPage = 1;
  itemsPerPage = 10;

  // Filtres
  searchTerm = '';
  typeFilter = '';
  statutFilter = '';

  // User properties
  currentUser: any;
  isClient = false;

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.loadMockData();
    this.currentUser = this.authService.getCurrentUser();
    this.isClient = this.authService.isClient();
    if (this.isClient) {
      this.filterClientAccounts();
    }
  }

  loadMockData() {
    // Données de démonstration pour les comptes
    this.allComptes = [
      {
        id: 1,
        numeroCompte: 'CMR0012345678',
        typeCompte: 'Courant',
        dateCreation: '15/01/2023',
        solde: 2500000,
        clientId: 1,
        proprietaire: 'AYABA Amina',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 2,
        numeroCompte: 'CMR0087654321',
        typeCompte: 'Épargne',
        dateCreation: '22/03/2023',
        solde: 1200000,
        clientId: 2,
        proprietaire: 'MBALLA Jolie',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 3,
        numeroCompte: 'CMR0056789012',
        typeCompte: 'Entreprise',
        dateCreation: '10/05/2023',
        solde: 7500000,
        clientId: 3,
        proprietaire: 'KAMGA Paul',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 4,
        numeroCompte: 'CMR0098765432',
        typeCompte: 'Jeune',
        dateCreation: '05/07/2023',
        solde: 500000,
        clientId: 4,
        proprietaire: 'NGOUAN Marie',
        statut: 'Bloqué',
        devise: 'CFA'
      },
      {
        id: 5,
        numeroCompte: 'CMR0034567890',
        typeCompte: 'Courant',
        dateCreation: '18/09/2023',
        solde: 3000000,
        clientId: 5,
        proprietaire: 'TCHOUA Jean',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 6,
        numeroCompte: 'CMR0076543210',
        typeCompte: 'Épargne',
        dateCreation: '30/11/2023',
        solde: 1500000,
        clientId: 6,
        proprietaire: 'FOUDA Sophie',
        statut: 'Inactif',
        devise: 'CFA'
      },
      {
        id: 7,
        numeroCompte: 'CMR0023456789',
        typeCompte: 'Courant',
        dateCreation: '12/02/2024',
        solde: 4500000,
        clientId: 7,
        proprietaire: 'EKOUA David',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 8,
        numeroCompte: 'CMR0045678901',
        typeCompte: 'Entreprise',
        dateCreation: '25/04/2024',
        solde: 8500000,
        clientId: 1,
        proprietaire: 'AYABA Amina',
        statut: 'Actif',
        devise: 'CFA'
      },
      {
        id: 9,
        numeroCompte: 'CMR0067890123',
        typeCompte: 'Épargne',
        dateCreation: '08/06/2024',
        solde: 2200000,
        clientId: 3,
        proprietaire: 'KAMGA Paul',
        statut: 'Supprimé',
        devise: 'CFA'
      },
      {
        id: 10,
        numeroCompte: 'CMR0011112222',
        typeCompte: 'Jeune',
        dateCreation: '20/08/2024',
        solde: 800000,
        clientId: 4,
        proprietaire: 'NGOUAN Marie',
        statut: 'Actif',
        devise: 'CFA'
      }
    ];

    this.filteredComptes = [...this.allComptes];
  }

  filterClientAccounts() {
    // For client, show only their accounts (assuming clientId = 1 for client@gmail.com)
    this.filteredComptes = this.allComptes.filter(compte => compte.clientId === 1);
  }

  applyFilters() {
    this.filteredComptes = this.allComptes.filter(compte => {
      // Filtre par recherche
      const searchMatch = !this.searchTerm || 
        compte.numeroCompte.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        compte.proprietaire.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtre par type
      const typeMatch = !this.typeFilter || compte.typeCompte === this.typeFilter;
      
      // Filtre par statut
      const statutMatch = !this.statutFilter || compte.statut === this.statutFilter;
      
      return searchMatch && typeMatch && statutMatch;
    });
    
    this.currentPage = 1; // Revenir à la première page après filtrage
  }

  getAccountTypeClass(type: string): string {
    const typeMap: {[key: string]: string} = {
      'Courant': 'account-type-courant',
      'Épargne': 'account-type-epargne',
      'Entreprise': 'account-type-entreprise',
      'Jeune': 'account-type-jeune'
    };
    return typeMap[type] || 'account-type-courant';
  }

  getStatusClass(statut: string): string {
    const statutMap: {[key: string]: string} = {
      'Actif': 'status-actif',
      'Bloqué': 'status-bloque',
      'Inactif': 'status-inactif',
      'Supprimé': 'status-supprime'
    };
    return statutMap[statut] || 'status-inactif';
  }

  getCurrentPageComptes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredComptes.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.filteredComptes.length / this.itemsPerPage);
  }

  getStartIndex() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex() {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredComptes.length);
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

  getTotalSolde(): number {
    return this.filteredComptes
      .filter(compte => compte.statut !== 'Supprimé')
      .reduce((total, compte) => total + compte.solde, 0);
  }

  getActiveComptesCount(): number {
    return this.filteredComptes.filter(compte => compte.statut === 'Actif').length;
  }

  getBlockedComptesCount(): number {
    return this.filteredComptes.filter(compte => compte.statut === 'Bloqué').length;
  }

  viewCompte(compte: Compte) {
    console.log('Voir compte:', compte);
    // Implémenter la logique pour afficher les détails
  }

  editCompte(compte: Compte) {
    console.log('Modifier compte:', compte);
    // Implémenter la logique d'édition
  }

  deleteCompte(compte: Compte) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le compte ${compte.numeroCompte} ?`)) {
      console.log('Supprimer compte:', compte);
      // Implémenter la logique de suppression
    }
  }

  toggleBlockCompte(compte: Compte) {
    const newStatus = compte.statut === 'Bloqué' ? 'Actif' : 'Bloqué';
    const message = compte.statut === 'Bloqué' 
      ? `Débloquer le compte ${compte.numeroCompte} ?`
      : `Bloquer le compte ${compte.numeroCompte} ?`;
    
    if (confirm(message)) {
      compte.statut = newStatus;
      console.log('Changement de statut:', compte);
      // Implémenter la logique de blocage/déblocage
    }
  }

  openNewAccountModal() {
    console.log('Ouvrir modal nouveau compte');
    // Implémenter l'ouverture d'un modal pour créer un nouveau compte
  }

  logout() {
    this.authService.logout();
  }
}