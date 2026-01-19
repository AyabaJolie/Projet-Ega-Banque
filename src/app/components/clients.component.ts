import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ApiService } from '../services/api.service';
import { LucideAngularModule, Search, Filter, Eye, FileText, Calendar, RefreshCw, Download, Plus, User, Phone, Mail, MapPin, Globe, Calendar as CalendarIcon, Venus } from 'lucide-angular';

// Interface pour les clients
export interface Client {
  id: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: 'M' | 'F';
  adresse: string;
  telephone: string;
  courriel: string;
  nationalite: string;
  dateCreation: string;
  nombreComptes: number;
  statut: 'Actif' | 'Inactif' | 'En attente';
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="main-content">
      <!-- Page Header -->
      <div class="page-header">
        <div class="page-title">Gestion des Clients</div>
        <div class="header-actions">
          <button class="new-client-btn" (click)="openCreateClientModal()">
            <lucide-icon name="plus" class="plus-icon"></lucide-icon>
            Nouveau client
          </button>
         
         
        </div>
      </div>

      <!-- Search and Filter Bar -->
      <div class="search-filter-bar">
        <div class="search-container">
          <lucide-icon name="search" class="search-icon"></lucide-icon>
          <input
            type="text"
            class="search-input"
            placeholder="Nom, prénom, téléphone, email..."
            [(ngModel)]="searchTerm"
            (input)="applyFilters()"
          >
        </div>
        <div class="filter-group">
          <div class="filter-container">
            <label class="filter-label">Sexe</label>
            <select class="filter-select" [(ngModel)]="sexeFilter" (change)="applyFilters()">
              <option value="">Tous</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div class="filter-container">
            <label class="filter-label">Statut</label>
            <select class="filter-select" [(ngModel)]="statutFilter" (change)="applyFilters()">
              <option value="">Tous</option>
              <option value="Actif">Actif</option>
              <option value="Inactif">Inactif</option>
              <option value="En attente">En attente</option>
            </select>
          </div>
          <div class="filter-container">
            <label class="filter-label">Nationalité</label>
            <select class="filter-select" [(ngModel)]="nationaliteFilter" (change)="applyFilters()">
              <option value="">Toutes</option>
              <option *ngFor="let nat of nationalitesUniques" [value]="nat">{{ nat }}</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Clients Table -->
      <div class="table-container">
        <table class="clients-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom & Prénom</th>
              <th>Date de Naissance</th>
              <th>Sexe</th>
              <th>Téléphone</th>
              <th>Email</th>
              <th>Adresse</th>
              <th>Nationalité</th>
              <th>Date Création</th>
              <th>Comptes</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let client of getCurrentPageClients()" class="table-row">
              <td>{{ client.id }}</td>
              <td>
                <div class="client-name">
                  <div class="client-avatar">
                    {{ client.prenom.charAt(0) }}{{ client.nom.charAt(0) }}
                  </div>
                  <div class="name-info">
                    <div class="full-name">{{ client.prenom }} {{ client.nom }}</div>
                    <div class="client-id">CLT-{{ client.id.toString().padStart(6, '0') }}</div>
                  </div>
                </div>
              </td>
              <td class="date-cell">{{ client.dateNaissance }}</td>
              <td>
                <span class="sexe-badge" [ngClass]="getSexeClass(client.sexe)">
                  {{ client.sexe === 'M' ? 'Masculin' : 'Féminin' }}
                </span>
              </td>
              <td class="phone-cell">
                <div class="phone-info">
                  <lucide-icon name="phone" class="phone-icon"></lucide-icon>
                  {{ client.telephone }}
                </div>
              </td>
              <td class="email-cell">
                <div class="email-info">
                  <lucide-icon name="mail" class="email-icon"></lucide-icon>
                  {{ client.courriel }}
                </div>
              </td>
              <td class="address-cell">
                <div class="address-info">
                  <lucide-icon name="map-pin" class="address-icon"></lucide-icon>
                  <span class="address-text">{{ client.adresse }}</span>
                </div>
              </td>
              <td>
                <span class="nationalite-badge">
                  <lucide-icon name="globe" class="nationalite-icon"></lucide-icon>
                  {{ client.nationalite }}
                </span>
              </td>
              <td class="date-cell">{{ client.dateCreation }}</td>
              <td>
                <span class="accounts-badge" [ngClass]="getAccountsClass(client.nombreComptes)">
                  {{ client.nombreComptes }} compte(s)
                </span>
              </td>
              <td>
                <span class="status-badge" [ngClass]="getStatusClass(client.statut)">
                  {{ client.statut }}
                </span>
              </td>
              <td class="actions">
                <button class="action-btn view-btn" (click)="viewClient(client)" title="Voir détails">
                  <lucide-icon name="eye"></lucide-icon>
                </button>
                <button class="action-btn edit-btn" (click)="editClient(client)" title="Modifier">
                  <lucide-icon name="edit-3"></lucide-icon>
                </button>
                <button class="action-btn accounts-btn" (click)="viewClientAccounts(client)" title="Voir comptes">
                  <lucide-icon name="credit-card"></lucide-icon>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <div class="pagination-info">
          Affichage {{ getStartIndex() + 1 }} à {{ getEndIndex() }}
          sur {{ filteredClients.length }} clients
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

      <!-- Modal de création de client -->
      <div *ngIf="showCreateModal" class="modal-overlay">
        <div class="modal-container">
          <div class="modal-header">
            <h2 class="modal-title">Créer un nouveau client</h2>
            <button class="modal-close-btn" (click)="closeCreateClientModal()">
              <lucide-icon name="x"></lucide-icon>
            </button>
          </div>

          <form class="client-form" (ngSubmit)="createClient()" #clientForm="ngForm">
            <div class="form-grid">
              <!-- Nom et Prénom -->
              <div class="form-group">
                <label for="nom" class="form-label">
                  <lucide-icon name="user" class="form-icon"></lucide-icon>
                  Nom *
                </label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  [(ngModel)]="newClient.nom"
                  required
                  class="form-input"
                  placeholder="Entrez le nom"
                >
              </div>

              <div class="form-group">
                <label for="prenom" class="form-label">
                  <lucide-icon name="user" class="form-icon"></lucide-icon>
                  Prénom *
                </label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  [(ngModel)]="newClient.prenom"
                  required
                  class="form-input"
                  placeholder="Entrez le prénom"
                >
              </div>

              <!-- Date de naissance et Sexe -->
              <div class="form-group">
                <label for="dateNaissance" class="form-label">
                  <lucide-icon name="calendar" class="form-icon"></lucide-icon>
                  Date de naissance *
                </label>
                <input
                  type="date"
                  id="dateNaissance"
                  name="dateNaissance"
                  [(ngModel)]="newClient.dateNaissance"
                  required
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label for="sexe" class="form-label">
                  <lucide-icon name="venus-mars" class="form-icon"></lucide-icon>
                  Sexe *
                </label>
                <select
                  id="sexe"
                  name="sexe"
                  [(ngModel)]="newClient.sexe"
                  required
                  class="form-select"
                >
                  <option value="">Sélectionnez</option>
                  <option value="M">Masculin</option>
                  <option value="F">Féminin</option>
                </select>
              </div>

              <!-- Téléphone et Email -->
              <div class="form-group">
                <label for="telephone" class="form-label">
                  <lucide-icon name="phone" class="form-icon"></lucide-icon>
                  Téléphone *
                </label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  [(ngModel)]="newClient.telephone"
                  required
                  class="form-input"
                  placeholder="+237 6XX XXX XXX"
                >
              </div>

              <div class="form-group">
                <label for="courriel" class="form-label">
                  <lucide-icon name="mail" class="form-icon"></lucide-icon>
                  Email *
                </label>
                <input
                  type="email"
                  id="courriel"
                  name="courriel"
                  [(ngModel)]="newClient.courriel"
                  required
                  class="form-input"
                  placeholder="client@email.com"
                >
              </div>

              <!-- Adresse -->
              <div class="form-group full-width">
                <label for="adresse" class="form-label">
                  <lucide-icon name="map-pin" class="form-icon"></lucide-icon>
                  Adresse complète *
                </label>
                <textarea
                  id="adresse"
                  name="adresse"
                  [(ngModel)]="newClient.adresse"
                  required
                  class="form-textarea"
                  rows="3"
                  placeholder="Rue, ville, code postal, pays"
                ></textarea>
              </div>

              <!-- Nationalité -->
              <div class="form-group full-width">
                <label for="nationalite" class="form-label">
                  <lucide-icon name="globe" class="form-icon"></lucide-icon>
                  Nationalité *
                </label>
                <select
                  id="nationalite"
                  name="nationalite"
                  [(ngModel)]="newClient.nationalite"
                  required
                  class="form-select"
                >
                  <option value="">Sélectionnez une nationalité</option>
                  <option value="Camerounaise">Camerounaise</option>
                  <option value="Française">Française</option>
                  <option value="Sénégalaise">Sénégalaise</option>
                  <option value="Ivoirienne">Ivoirienne</option>
                  <option value="Gabonaise">Gabonaise</option>
                  <option value="Congolaise">Congolaise</option>
                  <option value="Américaine">Américaine</option>
                  <option value="Canadienne">Canadienne</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="cancel-btn" (click)="closeCreateClientModal()">
                Annuler
              </button>
              <button type="submit" class="submit-btn" [disabled]="!clientForm.form.valid || isCreating">
                <span *ngIf="isCreating">Création...</span>
                <span *ngIf="!isCreating">Créer le client</span>
              </button>
            </div>
          </form>
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

    .new-client-btn {
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

    .new-client-btn:hover {
      background: #2563EB;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }

    .plus-icon {
      width: 16px;
      height: 16px;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #10B981;
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

    .export-btn:hover {
      background: #059669;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
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

    .export-icon, .refresh-icon {
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
      min-width: 150px;
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

    /* Table Container */
    .table-container {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      overflow-x: auto;
    }

    .clients-table {
      width: 100%;
      border-collapse: collapse;
    }

    .clients-table thead {
      background: #f5f5f5;
    }

    .clients-table th {
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

    .clients-table th:first-child {
      border-top-left-radius: 12px;
    }

    .clients-table th:last-child {
      border-top-right-radius: 12px;
    }

    .clients-table th::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: #3B82F6;
    }

    .clients-table td {
      padding: 16px 12px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      border-bottom: 1px solid #F3F4F6;
    }

    .table-row:hover {
      background: #F9FAFB;
    }

    /* Client Name Cell */
    .client-name {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .client-avatar {
      width: 40px;
      height: 40px;
      background: linear-gradient(135deg, #3B82F6, #8B5CF6);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }

    .name-info {
      display: flex;
      flex-direction: column;
    }

    .full-name {
      font-weight: 600;
      color: #1F2937;
    }

    .client-id {
      font-size: 12px;
      color: #6B7280;
    }

    /* Date Cell */
    .date-cell {
      font-family: 'Inter';
      font-weight: 500;
      color: #374151;
    }

    /* Sexe Badge */
    .sexe-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .masculin {
      background: #DBEAFE;
      color: #1E40AF;
    }

    .feminin {
      background: #FCE7F3;
      color: #9D174D;
    }

    /* Contact Cells */
    .phone-cell, .email-cell, .address-cell {
      font-size: 14px;
    }

    .phone-info, .email-info, .address-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .phone-icon, .email-icon, .address-icon, .nationalite-icon {
      width: 14px;
      height: 14px;
      color: #6B7280;
    }

    .address-text {
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Nationalité Badge */
    .nationalite-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      background: #F3F4F6;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    /* Accounts Badge */
    .accounts-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }

    .accounts-zero {
      background: #F3F4F6;
      color: #6B7280;
    }

    .accounts-few {
      background: #D1FAE5;
      color: #065F46;
    }

    .accounts-many {
      background: #3B82F6;
      color: #FFFFFF;
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

    .inactif {
      background: #FEE2E2;
      color: #DC2626;
    }

    .en-attente {
      background: #FEF3C7;
      color: #92400E;
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
      background: #F0F9FF;
      color: #0EA5E9;
    }

    .edit-btn:hover {
      background: #E0F2FE;
    }

    .accounts-btn {
      background: #F5F3FF;
      color: #8B5CF6;
    }

    .accounts-btn:hover {
      background: #EDE9FE;
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
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }

    .modal-container {
      background: #FFFFFF;
      border-radius: 15px;
      width: 100%;
      max-width: 800px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 32px;
      border-bottom: 1px solid #E5E7EB;
    }

    .modal-title {
      font-family: 'Inter';
      font-weight: 700;
      font-size: 24px;
      color: #1F2937;
      margin: 0;
    }

    .modal-close-btn {
      background: none;
      border: none;
      color: #6B7280;
      cursor: pointer;
      padding: 8px;
      border-radius: 6px;
      transition: all 0.3s ease;
    }

    .modal-close-btn:hover {
      background: #F3F4F6;
      color: #374151;
    }

    .client-form {
      padding: 32px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
      margin-bottom: 32px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .full-width {
      grid-column: 1 / -1;
    }

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #374151;
    }

    .form-icon {
      width: 16px;
      height: 16px;
      color: #6B7280;
    }

    .form-input, .form-select, .form-textarea {
      padding: 12px 16px;
      border: 1px solid #E5E7EB;
      border-radius: 10px;
      font-family: 'Inter';
      font-size: 14px;
      color: #374151;
      background: #FFFFFF;
      transition: all 0.3s ease;
    }

    .form-input:focus, .form-select:focus, .form-textarea:focus {
      outline: none;
      border-color: #3B82F6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding-top: 24px;
      border-top: 1px solid #E5E7EB;
    }

    .cancel-btn {
      padding: 12px 24px;
      border: 1px solid #E5E7EB;
      background: #FFFFFF;
      border-radius: 10px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #374151;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .cancel-btn:hover {
      background: #F9FAFB;
      border-color: #D1D5DB;
    }

    .submit-btn {
      padding: 12px 24px;
      border: none;
      background: #3B82F6;
      border-radius: 10px;
      font-family: 'Inter';
      font-weight: 600;
      font-size: 14px;
      color: #FFFFFF;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .submit-btn:hover:not(:disabled) {
      background: #2563EB;
      transform: translateY(-1px);
    }

    .submit-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `]
})
export class ClientsComponent implements OnInit {
  allClients: Client[] = [];
  filteredClients: Client[] = [];
  currentPage = 1;
  itemsPerPage = 10;
  nationalitesUniques: string[] = [];

  // Filtres
  searchTerm = '';
  sexeFilter = '';
  statutFilter = '';
  nationaliteFilter = '';

  // Modal de création
  showCreateModal = false;
  newClient: any = {
    nom: '',
    prenom: '',
    dateNaissance: '',
    sexe: '',
    adresse: '',
    telephone: '',
    courriel: '',
    nationalite: ''
  };
  isCreating = false;

  // User properties
  currentUser: any;
  isClient = false;

  constructor(private authService: AuthService, private apiService: ApiService) {}

  ngOnInit() {
    this.loadMockData();
    this.extractNationalites();
    this.currentUser = this.authService.getCurrentUser();
    this.isClient = this.authService.isClient();
  }

  loadMockData() {
    // Données de démonstration pour les clients
    this.allClients = [
      {
        id: 1,
        nom: 'AYABA',
        prenom: 'Amina',
        dateNaissance: '15/05/1990',
        sexe: 'F',
        adresse: 'Rue 1.234, Yaoundé, Cameroun',
        telephone: '+237 6 77 88 99 00',
        courriel: 'amina.ayaba@email.com',
        nationalite: 'Camerounaise',
        dateCreation: '10/01/2020',
        nombreComptes: 2,
        statut: 'Actif'
      },
      {
        id: 2,
        nom: 'MBALLA',
        prenom: 'Jolie',
        dateNaissance: '22/08/1985',
        sexe: 'F',
        adresse: 'Avenue Kennedy, Douala, Cameroun',
        telephone: '+237 6 55 44 33 22',
        courriel: 'jolie.mballa@email.com',
        nationalite: 'Camerounaise',
        dateCreation: '15/03/2021',
        nombreComptes: 1,
        statut: 'Actif'
      },
      {
        id: 3,
        nom: 'KAMGA',
        prenom: 'Paul',
        dateNaissance: '30/11/1978',
        sexe: 'M',
        adresse: 'Boulevard du 20 Mai, Yaoundé, Cameroun',
        telephone: '+237 6 99 88 77 66',
        courriel: 'paul.kamga@email.com',
        nationalite: 'Camerounaise',
        dateCreation: '05/07/2019',
        nombreComptes: 3,
        statut: 'Actif'
      },
      {
        id: 4,
        nom: 'NGOUAN',
        prenom: 'Marie',
        dateNaissance: '14/02/2000',
        sexe: 'F',
        adresse: 'Quartier Bastos, Yaoundé, Cameroun',
        telephone: '+237 6 33 44 55 66',
        courriel: 'marie.ngouan@email.com',
        nationalite: 'Française',
        dateCreation: '20/09/2023',
        nombreComptes: 1,
        statut: 'En attente'
      },
      {
        id: 5,
        nom: 'TCHOUA',
        prenom: 'Jean',
        dateNaissance: '08/06/1995',
        sexe: 'M',
        adresse: 'Bonapriso, Douala, Cameroun',
        telephone: '+237 6 22 33 44 55',
        courriel: 'jean.tchoua@email.com',
        nationalite: 'Camerounaise',
        dateCreation: '12/11/2022',
        nombreComptes: 2,
        statut: 'Actif'
      },
      {
        id: 6,
        nom: 'FOUDA',
        prenom: 'Sophie',
        dateNaissance: '25/12/1982',
        sexe: 'F',
        adresse: 'Rue 1.789, Yaoundé, Cameroun',
        telephone: '+237 6 11 22 33 44',
        courriel: 'sophie.fouda@email.com',
        nationalite: 'Sénégalaise',
        dateCreation: '18/05/2021',
        nombreComptes: 0,
        statut: 'Inactif'
      },
      {
        id: 7,
        nom: 'EKOUA',
        prenom: 'David',
        dateNaissance: '19/03/1970',
        sexe: 'M',
        adresse: 'Bonanjo, Douala, Cameroun',
        telephone: '+237 6 66 77 88 99',
        courriel: 'david.ekoua@email.com',
        nationalite: 'Camerounaise',
        dateCreation: '22/02/2018',
        nombreComptes: 4,
        statut: 'Actif'
      },
      {
        id: 8,
        nom: 'DONGMO',
        prenom: 'Sarah',
        dateNaissance: '03/07/1998',
        sexe: 'F',
        adresse: 'Rue 2.345, Yaoundé, Cameroun',
        telephone: '+237 6 44 55 66 77',
        courriel: 'sarah.dongmo@email.com',
        nationalite: 'Ivoirienne',
        dateCreation: '30/08/2023',
        nombreComptes: 1,
        statut: 'En attente'
      },
      {
        id: 9,
        nom: 'NDOUMBE',
        prenom: 'Pierre',
        dateNaissance: '11/09/1988',
        sexe: 'M',
        adresse: 'Akwa, Douala, Cameroun',
        telephone: '+237 6 88 99 00 11',
        courriel: 'pierre.ndoumbe@email.com',
        nationalite: 'Gabonaise',
        dateCreation: '14/04/2022',
        nombreComptes: 2,
        statut: 'Actif'
      },
      {
        id: 10,
        nom: 'TEMGOUA',
        prenom: 'Claire',
        dateNaissance: '29/01/1993',
        sexe: 'F',
        adresse: 'Rue 1.567, Yaoundé, Cameroun',
        telephone: '+237 6 00 11 22 33',
        courriel: 'claire.temgoua@email.com',
        nationalite: 'Camerounaise',
        dateCreation: '09/12/2023',
        nombreComptes: 1,
        statut: 'Actif'
      }
    ];

    this.filteredClients = [...this.allClients];
  }

  extractNationalites() {
    const nationalites = [...new Set(this.allClients.map(client => client.nationalite))];
    this.nationalitesUniques = nationalites.sort();
  }

  applyFilters() {
    this.filteredClients = this.allClients.filter(client => {
      // Filtre par recherche
      const searchMatch = !this.searchTerm ||
        client.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.telephone.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        client.courriel.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Filtre par sexe
      const sexeMatch = !this.sexeFilter ||
        client.sexe === this.sexeFilter;

      // Filtre par statut
      const statutMatch = !this.statutFilter ||
        client.statut === this.statutFilter;

      // Filtre par nationalité
      const nationaliteMatch = !this.nationaliteFilter ||
        client.nationalite === this.nationaliteFilter;

      return searchMatch && sexeMatch && statutMatch && nationaliteMatch;
    });

    this.currentPage = 1; // Revenir à la première page après filtrage
  }

  resetFilters() {
    this.searchTerm = '';
    this.sexeFilter = '';
    this.statutFilter = '';
    this.nationaliteFilter = '';
    this.applyFilters();
  }

  getSexeClass(sexe: string): string {
    return sexe === 'M' ? 'masculin' : 'feminin';
  }

  getStatusClass(statut: string): string {
    const statutMap: {[key: string]: string} = {
      'Actif': 'actif',
      'Inactif': 'inactif',
      'En attente': 'en-attente'
    };
    return statutMap[statut] || 'en-attente';
  }

  getAccountsClass(nombreComptes: number): string {
    if (nombreComptes === 0) return 'accounts-zero';
    if (nombreComptes <= 2) return 'accounts-few';
    return 'accounts-many';
  }

  getCurrentPageClients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredClients.slice(startIndex, endIndex);
  }

  getTotalPages() {
    return Math.ceil(this.filteredClients.length / this.itemsPerPage);
  }

  getStartIndex() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  getEndIndex() {
    const endIndex = this.currentPage * this.itemsPerPage;
    return Math.min(endIndex, this.filteredClients.length);
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

  // Modal methods
  openCreateClientModal() {
    this.showCreateModal = true;
    this.resetNewClientForm();
  }

  closeCreateClientModal() {
    this.showCreateModal = false;
    this.resetNewClientForm();
  }

  resetNewClientForm() {
    this.newClient = {
      nom: '',
      prenom: '',
      dateNaissance: '',
      sexe: '',
      adresse: '',
      telephone: '',
      courriel: '',
      nationalite: ''
    };
    this.isCreating = false;
  }

  createClient() {
    this.isCreating = true;
    
    // Simuler une requête API
    setTimeout(() => {
      const newId = this.allClients.length > 0 ? Math.max(...this.allClients.map(c => c.id)) + 1 : 1;
      const newClient: Client = {
        id: newId,
        nom: this.newClient.nom,
        prenom: this.newClient.prenom,
        dateNaissance: this.formatDate(this.newClient.dateNaissance),
        sexe: this.newClient.sexe,
        adresse: this.newClient.adresse,
        telephone: this.newClient.telephone,
        courriel: this.newClient.courriel,
        nationalite: this.newClient.nationalite,
        dateCreation: new Date().toLocaleDateString('fr-FR'),
        nombreComptes: 0,
        statut: 'En attente'
      };

      this.allClients.unshift(newClient);
      this.applyFilters();
      this.extractNationalites();
      this.closeCreateClientModal();
      
      console.log('Client créé:', newClient);
      // Ici, vous pourriez appeler this.apiService.createClient(newClient)
    }, 1000);
  }

  formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
  }

  // Actions
  viewClient(client: Client) {
    console.log('Voir client:', client);
    // Implémenter la logique pour afficher les détails du client
  }

  editClient(client: Client) {
    console.log('Modifier client:', client);
    // Implémenter la logique pour modifier le client
  }

  viewClientAccounts(client: Client) {
    console.log('Voir comptes du client:', client);
    // Implémenter la logique pour afficher les comptes du client
  }




}