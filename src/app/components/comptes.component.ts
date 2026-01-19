import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { LayoutService } from '../services/layout.service';
import { ApiService } from '../services/api.service';
import { LucideAngularModule, Home, Users, CreditCard, BarChart3, User, Settings, LogOut, Search, Bell, Plus, Eye, Edit, Trash2, Filter, Lock, Unlock, X } from 'lucide-angular';

// Interface pour le propriétaire
export interface Proprietaire {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  adresse: string;
  telephone: string;
  email: string;
  nationalite: string;
}

// Interface pour les comptes
export interface Compte {
  id: number;
  numeroCompte: string;
  typeCompte: 'Épargne' | 'Courant';
  dateCreation: string;
  solde: number;
  clientId: number;
  proprietaire: Proprietaire;
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
          </div>
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
                placeholder="Numéro, nom, prénom, email..."
                [(ngModel)]="searchTerm"
                (input)="applyFilters()"
              >
            </div>
          </div>
          <div class="filter-group">
            <div class="filter-container">
              <label class="filter-label">Type de compte</label>
              <select class="filter-select" [(ngModel)]="typeFilter" (change)="applyFilters()">
                <option value="">Tous les types</option>
                <option value="Courant">Courant</option>
                <option value="Épargne">Épargne</option>
               
              </select>
            </div>
            <div class="filter-container">
              <label class="filter-label">Statut</label>
              <select class="filter-select" [(ngModel)]="statutFilter" (change)="applyFilters()">
                <option value="">Tous les statuts</option>
                <option value="Actif">Actif</option>
                <option value="Bloqué">Bloqué</option>
                <option value="Inactif">Inactif</option>
                <option value="Supprimé">Supprimé</option>
              </select>
            </div>
            <div class="filter-container">
              <label class="filter-label">Devise</label>
              <select class="filter-select" [(ngModel)]="deviseFilter" (change)="applyFilters()">
                <option value="">Toutes</option>
                <option value="CFA">CFA</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- Stats des filtres -->
        <div class="filter-stats">
          <div class="stat-card">
            <div class="stat-value">{{ filteredComptes.length }}</div>
            <div class="stat-label">Comptes filtrés</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getTotalSolde() | number }}</div>
            <div class="stat-label">Solde total (CFA)</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">{{ getActiveComptesCount() }}</div>
            <div class="stat-label">Comptes actifs</div>
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
              
              </tr>
            </thead>
            <tbody>
              <tr class="table-row" *ngFor="let compte of getCurrentPageComptes(); trackBy: trackById">
                <td>{{ compte.id }}</td>
                <td class="account-number">{{ compte.numeroCompte }}</td>
                <td><span class="account-type-badge" [ngClass]="getAccountTypeClass(compte.typeCompte)">{{ compte.typeCompte }}</span></td>
                <td>{{ compte.dateCreation }}</td>
                <td class="solde">{{ compte.solde | number }} {{ compte.devise }}</td>
                <td>
                  <div class="proprietaire-info">
                    <div class="proprietaire-nom">{{ compte.proprietaire.nom }} {{ compte.proprietaire.prenom }}</div>
                    <div class="proprietaire-contact">{{ compte.proprietaire.telephone }}</div>
                  </div>
                </td>
                <td><span class="status-badge" [ngClass]="getStatusClass(compte.statut)">{{ compte.statut }}</span></td>
                
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

        <!-- Account Details Modal -->
        <div *ngIf="showAccountModal" class="modal-overlay" (click)="closeModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Détails du Compte</h2>
              <button class="close-btn" (click)="closeModal()">&times;</button>
            </div>
            <div class="modal-body" *ngIf="selectedAccount">
              <div class="modal-section">
                <h3>Informations du compte</h3>
                <div class="detail-row">
                  <label>Numéro de compte:</label>
                  <span>{{ selectedAccount.numeroCompte }}</span>
                </div>
                <div class="detail-row">
                  <label>Type de compte:</label>
                  <span>{{ selectedAccount.typeCompte }}</span>
                </div>
                <div class="detail-row">
                  <label>Date de création:</label>
                  <span>{{ selectedAccount.dateCreation }}</span>
                </div>
                <div class="detail-row">
                  <label>Solde:</label>
                  <span>{{ selectedAccount.solde | number }} {{ selectedAccount.devise }}</span>
                </div>
                <div class="detail-row">
                  <label>Statut:</label>
                  <span class="status-badge" [ngClass]="getStatusClass(selectedAccount.statut)">{{ selectedAccount.statut }}</span>
                </div>
              </div>

              <div class="modal-section">
                <h3>Informations du propriétaire</h3>
                <div class="detail-row">
                  <label>Nom complet:</label>
                  <span>{{ selectedAccount.proprietaire.nom }} {{ selectedAccount.proprietaire.prenom }}</span>
                </div>
                <div class="detail-row">
                  <label>Date de naissance:</label>
                  <span>{{ selectedAccount.proprietaire.dateNaissance }}</span>
                </div>
                <div class="detail-row">
                  <label>Sexe:</label>
                  <span>{{ selectedAccount.proprietaire.sexe === 'M' ? 'Masculin' : 'Féminin' }}</span>
                </div>
                <div class="detail-row">
                  <label>Adresse:</label>
                  <span>{{ selectedAccount.proprietaire.adresse }}</span>
                </div>
                <div class="detail-row">
                  <label>Téléphone:</label>
                  <span>{{ selectedAccount.proprietaire.telephone }}</span>
                </div>
                <div class="detail-row">
                  <label>Email:</label>
                  <span>{{ selectedAccount.proprietaire.email }}</span>
                </div>
                <div class="detail-row">
                  <label>Nationalité:</label>
                  <span>{{ selectedAccount.proprietaire.nationalite }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Create Account Modal -->
        <div *ngIf="showCreateAccountModal" class="modal-overlay" (click)="closeCreateModal()">
          <div class="modal-content wide-modal" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <h2>Créer un Nouveau Compte</h2>
              <button class="close-btn" (click)="closeCreateModal()">&times;</button>
            </div>
            <div class="modal-body">
              <form (ngSubmit)="createAccount()" #accountForm="ngForm">
                <div class="form-section">
                  <h3>Informations du compte</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="numeroCompte">Numéro de compte *</label>
                      <input type="text" id="numeroCompte" name="numeroCompte" 
                             [(ngModel)]="newAccount.numeroCompte" required 
                             class="form-input" placeholder="CMR0012345678">
                    </div>
                    <div class="form-group">
                      <label for="typeCompte">Type de compte *</label>
                      <select id="typeCompte" name="typeCompte" 
                              [(ngModel)]="newAccount.typeCompte" required 
                              class="form-select">
                        <option value="Courant">Courant</option>
                        <option value="Épargne">Épargne</option>
                     
                      </select>
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="dateCreation">Date de création</label>
                      <input type="date" id="dateCreation" name="dateCreation" 
                             [(ngModel)]="newAccount.dateCreation" 
                             class="form-input">
                    </div>
                    <div class="form-group">
                      <label for="solde">Solde initial *</label>
                      <input type="number" id="solde" name="solde" 
                             [(ngModel)]="newAccount.solde" required 
                             class="form-input" placeholder="0">
                    </div>
                    <div class="form-group">
                      <label for="devise">Devise *</label>
                      <select id="devise" name="devise" 
                              [(ngModel)]="newAccount.devise" required 
                              class="form-select">
                        <option value="CFA">CFA</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="form-section">
                  <h3>Informations du propriétaire</h3>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="nom">Nom *</label>
                      <input type="text" id="nom" name="nom" 
                             [(ngModel)]="newAccount.proprietaire!.nom" required 
                             class="form-input">
                    </div>
                    <div class="form-group">
                      <label for="prenom">Prénom *</label>
                      <input type="text" id="prenom" name="prenom" 
                             [(ngModel)]="newAccount.proprietaire!.prenom" required 
                             class="form-input">
                    </div>
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="dateNaissance">Date de naissance *</label>
                      <input type="date" id="dateNaissance" name="dateNaissance" 
                             [(ngModel)]="newAccount.proprietaire!.dateNaissance" required 
                             class="form-input">
                    </div>
                    <div class="form-group">
                      <label for="sexe">Sexe *</label>
                      <select id="sexe" name="sexe" 
                              [(ngModel)]="newAccount.proprietaire!.sexe" required 
                              class="form-select">
                        <option value="M">Masculin</option>
                        <option value="F">Féminin</option>
                      </select>
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="adresse">Adresse *</label>
                    <input type="text" id="adresse" name="adresse" 
                           [(ngModel)]="newAccount.proprietaire!.adresse" required 
                           class="form-input" placeholder="Rue, Ville, Code postal">
                  </div>
                  <div class="form-row">
                    <div class="form-group">
                      <label for="telephone">Téléphone *</label>
                      <input type="tel" id="telephone" name="telephone" 
                             [(ngModel)]="newAccount.proprietaire!.telephone" required 
                             class="form-input" placeholder="+237 6XX XX XX XX">
                    </div>
                    <div class="form-group">
                      <label for="email">Email *</label>
                      <input type="email" id="email" name="email" 
                             [(ngModel)]="newAccount.proprietaire!.email" required 
                             class="form-input" placeholder="exemple@email.com">
                    </div>
                  </div>
                  <div class="form-group">
                    <label for="nationalite">Nationalité *</label>
                    <input type="text" id="nationalite" name="nationalite" 
                           [(ngModel)]="newAccount.proprietaire!.nationalite" required 
                           class="form-input" placeholder="Camerounaise">
                  </div>
                </div>

                <div class="form-actions">
                  <button type="button" class="cancel-btn" (click)="closeCreateModal()">Annuler</button>
                  <button type="submit" class="submit-btn" [disabled]="!accountForm.valid">
                    Créer le compte
                  </button>
                </div>
              </form>
            </div>
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

    /* Search and Filter Bar */
    .search-filter-bar {
      background: #FFFFFF;
      border-radius: 10px;
      padding: 20px;
      margin-bottom: 20px;
      box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.06);
    }

    .search-container {
      margin-bottom: 20px;
    }

    .search-label {
      display: block;
      font-family: 'Inter';
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .search-input-wrapper {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      width: 16px;
      height: 16px;
      color: #9CA3AF;
    }

    .search-input {
      width: 100%;
      height: 40px;
      padding: 0 40px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
    }

    .search-input:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .filter-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .filter-container {
      display: flex;
      flex-direction: column;
    }

    .filter-label {
      font-family: 'Inter';
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .filter-select {
      height: 40px;
      padding: 0 12px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      cursor: pointer;
    }

    .filter-select:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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

    .proprietaire-info {
      display: flex;
      flex-direction: column;
    }

    .proprietaire-nom {
      font-weight: 600;
      color: #1F2937;
    }

    .proprietaire-contact {
      font-size: 12px;
      color: #6B7280;
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

    .supprime {
      background: #F3F4F6;
      color: #6B7280;
      text-decoration: line-through;
    }

    /* Actions */
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
      box-shadow: 0px 10px 40px rgba(0, 0, 0, 0.2);
      max-width: 600px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    }

    .wide-modal {
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
      font-size: 24px;
      color: #1F2937;
      margin: 0;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 28px;
      color: #6B7280;
      cursor: pointer;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.3s ease;
    }

    .close-btn:hover {
      background: #F3F4F6;
      color: #374151;
    }

    .modal-body {
      padding: 30px;
    }

    .modal-section {
      margin-bottom: 30px;
    }

    .modal-section:last-child {
      margin-bottom: 0;
    }

    .modal-section h3 {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 18px;
      color: #374151;
      margin: 0 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #F3F4F6;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #F3F4F6;
    }

    .detail-row:last-child {
      border-bottom: none;
    }

    .detail-row label {
      font-family: 'Inter';
      font-weight: 600;
      color: #6B7280;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-row span {
      font-family: 'Inter';
      font-weight: 500;
      color: #1F2937;
      font-size: 16px;
    }

    /* Create Account Form */
    .form-section {
      margin-bottom: 30px;
    }

    .form-section h3 {
      font-family: 'Inter';
      font-weight: 600;
      font-size: 18px;
      color: #374151;
      margin: 0 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #F3F4F6;
    }

    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-family: 'Inter';
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .form-group label::after {
      content: ' *';
      color: #DC2626;
      display: none;
    }

    .form-group label.required::after {
      display: inline;
    }

    .form-input,
    .form-select {
      height: 40px;
      padding: 0 12px;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
    }

    .form-input:focus,
    .form-select:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 20px;
      border-top: 1px solid #E5E7EB;
    }

    .cancel-btn {
      padding: 10px 20px;
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      border-radius: 8px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: #F9FAFB;
    }

    .submit-btn {
      padding: 10px 24px;
      background: #3B82F6;
      border: none;
      border-radius: 8px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #FFFFFF;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #2563EB;
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
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
  deviseFilter = '';

  // User properties
  currentUser: any;
  isClient = false;

  // Modal properties
  showAccountModal = false;
  selectedAccount: Compte | null = null;
  showCreateAccountModal = false;

  // New account form
  newAccount: Partial<Compte> = {
    typeCompte: 'Courant',
    devise: 'CFA',
    statut: 'Actif',
    proprietaire: {
      id: 0,
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: 'M',
      adresse: '',
      telephone: '',
      email: '',
      nationalite: 'Camerounaise'
    }
  };

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
        proprietaire: {
          id: 1,
          nom: 'AYABA',
          prenom: 'Amina',
          dateNaissance: '15/05/1985',
          sexe: 'F',
          adresse: 'Rue 123, Yaoundé',
          telephone: '+237 6 12 34 56 78',
          email: 'amina.ayaba@email.com',
          nationalite: 'Camerounaise'
        },
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
        proprietaire: {
          id: 2,
          nom: 'MBALLA',
          prenom: 'Jolie',
          dateNaissance: '22/08/1990',
          sexe: 'F',
          adresse: 'Avenue 456, Douala',
          telephone: '+237 6 23 45 67 89',
          email: 'jolie.mballa@email.com',
          nationalite: 'Camerounaise'
        },
        statut: 'Actif',
        devise: 'CFA'
      },

      {
        id: 5,
        numeroCompte: 'CMR0034567890',
        typeCompte: 'Courant',
        dateCreation: '18/09/2023',
        solde: 3000000,
        clientId: 5,
        proprietaire: {
          id: 5,
          nom: 'TCHOUA',
          prenom: 'Jean',
          dateNaissance: '18/12/1980',
          sexe: 'M',
          adresse: 'Rue 202, Garoua',
          telephone: '+237 6 56 78 90 12',
          email: 'jean.tchoua@email.com',
          nationalite: 'Camerounaise'
        },
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
        proprietaire: {
          id: 6,
          nom: 'FOUDA',
          prenom: 'Sophie',
          dateNaissance: '30/06/1995',
          sexe: 'F',
          adresse: 'Avenue 303, Maroua',
          telephone: '+237 6 67 89 01 23',
          email: 'sophie.fouda@email.com',
          nationalite: 'Camerounaise'
        },
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
        proprietaire: {
          id: 7,
          nom: 'EKOUA',
          prenom: 'David',
          dateNaissance: '12/09/1970',
          sexe: 'M',
          adresse: 'Boulevard 404, Ngaoundéré',
          telephone: '+237 6 78 90 12 34',
          email: 'david.ekoua@email.com',
          nationalite: 'Camerounaise'
        },
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
        proprietaire: {
          id: 3,
          nom: 'KAMGA',
          prenom: 'Paul',
          dateNaissance: '10/11/1975',
          sexe: 'M',
          adresse: 'Boulevard 789, Yaoundé',
          telephone: '+237 6 34 56 78 90',
          email: 'paul.kamga@email.com',
          nationalite: 'Camerounaise'
        },
        statut: 'Supprimé',
        devise: 'USD'
      },
     
    ];

    this.filteredComptes = [...this.allComptes];
  }

  filterClientAccounts() {
    this.filteredComptes = this.allComptes.filter(compte => compte.clientId === 1);
  }

  applyFilters() {
    this.filteredComptes = this.allComptes.filter(compte => {
      // Filtre par recherche
      const searchMatch = !this.searchTerm ||
        compte.numeroCompte.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        compte.proprietaire.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        compte.proprietaire.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        compte.proprietaire.email.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtre par type
      const typeMatch = !this.typeFilter || compte.typeCompte === this.typeFilter;

      // Filtre par statut
      const statutMatch = !this.statutFilter || compte.statut === this.statutFilter;

      // Filtre par devise
      const deviseMatch = !this.deviseFilter || compte.devise === this.deviseFilter;

      return searchMatch && typeMatch && statutMatch && deviseMatch;
    });

    this.currentPage = 1;
  }

  hasActiveFilters(): boolean {
    return !!this.searchTerm || !!this.typeFilter || !!this.statutFilter || !!this.deviseFilter;
  }

  removeFilter(filterType: 'search' | 'type' | 'statut' | 'devise') {
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
      case 'devise':
        this.deviseFilter = '';
        break;
    }
    this.applyFilters();
  }

  resetFilters() {
    this.searchTerm = '';
    this.typeFilter = '';
    this.statutFilter = '';
    this.deviseFilter = '';
    this.applyFilters();
  }

  
  getStatusClass(statut: string): string {
    const statutMap: {[key: string]: string} = {
      'Actif': 'actif',
      'Bloqué': 'bloque',
      'Inactif': 'inactif',
      'Supprimé': 'supprime'
    };
    return statutMap[statut] || 'inactif';
  }

  getAccountTypeClass(type: string): string {
    const typeMap: {[key: string]: string} = {
      'Courant': 'courant',
      'Épargne': 'epargne'
    };
    return typeMap[type] || 'courant';
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
      .filter(compte => compte.statut !== 'Supprimé' && compte.devise === 'CFA')
      .reduce((total, compte) => total + compte.solde, 0);
  }

  getActiveComptesCount(): number {
    return this.filteredComptes.filter(compte => compte.statut === 'Actif').length;
  }

  getBlockedComptesCount(): number {
    return this.filteredComptes.filter(compte => compte.statut === 'Bloqué').length;
  }

  viewCompte(compte: Compte) {
    this.selectedAccount = compte;
    this.showAccountModal = true;
  }

  closeModal() {
    this.showAccountModal = false;
    this.selectedAccount = null;
  }

  editCompte(compte: Compte) {
    console.log('Modifier compte:', compte);
  }

  deleteCompte(compte: Compte) {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le compte ${compte.numeroCompte} ?`)) {
      console.log('Supprimer compte:', compte);
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
    }
  }

  openNewAccountModal() {
    this.showCreateAccountModal = true;
    // Set default date to today
    if (!this.newAccount.dateCreation) {
      this.newAccount.dateCreation = new Date().toISOString().split('T')[0];
    }
  }

  closeCreateModal() {
    this.showCreateAccountModal = false;
    this.newAccount = {
      typeCompte: 'Courant',
      devise: 'CFA',
      statut: 'Actif',
      proprietaire: {
        id: 0,
        nom: '',
        prenom: '',
        dateNaissance: '',
        sexe: 'M',
        adresse: '',
        telephone: '',
        email: '',
        nationalite: 'Camerounaise'
      }
    };
  }

  createAccount() {
    if (this.validateAccountForm()) {
      const newId = Math.max(...this.allComptes.map(c => c.id)) + 1;
      const compte: Compte = {
        id: newId,
        numeroCompte: this.newAccount.numeroCompte!,
        typeCompte: this.newAccount.typeCompte!,
        dateCreation: this.formatDate(this.newAccount.dateCreation || new Date().toISOString()),
        solde: this.newAccount.solde!,
        clientId: this.currentUser?.id || 1,
        proprietaire: this.newAccount.proprietaire!,
        statut: this.newAccount.statut || 'Actif',
        devise: this.newAccount.devise!
      };

      this.allComptes.push(compte);
      this.applyFilters();
      this.closeCreateModal();
      console.log('Nouveau compte créé:', compte);
      alert('Compte créé avec succès!');
    }
  }

  validateAccountForm(): boolean {
    const requiredFields = [
      this.newAccount.numeroCompte,
      this.newAccount.typeCompte,
      this.newAccount.solde,
      this.newAccount.proprietaire?.nom,
      this.newAccount.proprietaire?.prenom,
      this.newAccount.proprietaire?.dateNaissance,
      this.newAccount.proprietaire?.adresse,
      this.newAccount.proprietaire?.telephone,
      this.newAccount.proprietaire?.email,
      this.newAccount.proprietaire?.nationalite
    ];

    return requiredFields.every(field => field && field.toString().trim() !== '');
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  trackById(index: number, item: Compte): number {
    return item.id;
  }

  logout() {
    this.authService.logout();
  }
}
