import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { LayoutService } from '../services/layout.service';
import { ApiService, Client } from '../services/api.service';
import { LucideAngularModule, Home, Users, CreditCard, BarChart3, Settings, LogOut, Search, Bell, Plus, Eye, Edit, Trash2, Filter } from 'lucide-angular';

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [RouterModule, CommonModule, LucideAngularModule],
  template: `
    <div class="main-content">
        <!-- Page Header -->
        <div class="page-header">
          <div class="page-title">Gestion des Clients</div>
          <button class="new-client-btn">
            <lucide-icon name="plus" class="plus-icon"></lucide-icon>
            Nouveau Client
          </button>
        </div>
        
        <!-- Filters Section -->
        <div class="filters-section">
          <div class="search-filter">
            <lucide-icon name="search" class="search-icon"></lucide-icon>
            <input type="text" placeholder="Rechercher un client..." class="filter-input">
          </div>
          
          <div class="filter-dropdown">
            <lucide-icon name="filter" class="filter-icon"></lucide-icon>
            <select class="filter-select">
              <option value="">Tous les clients</option>
              <option value="active">Clients actifs</option>
              <option value="inactive">Clients inactifs</option>
            </select>
          </div>
        </div>
        
        <!-- Clients Table -->
        <p>Clients: 7</p>
        <div class="table-container">
          <table class="clients-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Date de naissance</th>
                <th>Sexe</th>
                <th>Adresse</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Nationalité</th>
                <th>Statut</th>
                <th>Solde</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row">
                <td>CL001</td>
                <td>AYABA</td>
                <td>Amina</td>
                <td>15/03/1985</td>
                <td>F</td>
                <td>Yaoundé, Cameroun</td>
                <td>+237 691 234 567</td>
                <td>amina.ayaba@email.com</td>
                <td>Camerounaise</td>
                <td>Actif</td>
                <td class="solde">25000.00 CFA</td>
                <td class="actions">
                  <button class="action-btn view-btn">
                    <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn edit-btn">
                    <lucide-icon name="edit" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn delete-btn">
                    <lucide-icon name="trash-2" class="action-icon"></lucide-icon>
                  </button>
                </td>
              </tr>
              <tr class="table-row">
                <td>CL002</td>
                <td>MBALLA</td>
                <td>Jolie</td>
                <td>22/08/1990</td>
                <td>F</td>
                <td>Douala, Cameroun</td>
                <td>+237 677 890 123</td>
                <td>jolie.mballa@email.com</td>
                <td>Camerounaise</td>
                <td>Actif</td>
                <td class="solde">12000.00 CFA</td>
                <td class="actions">
                  <button class="action-btn view-btn">
                    <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn edit-btn">
                    <lucide-icon name="edit" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn delete-btn">
                    <lucide-icon name="trash-2" class="action-icon"></lucide-icon>
                  </button>
                </td>
              </tr>
              <tr class="table-row">
                <td>CL003</td>
                <td>KAMGA</td>
                <td>Paul</td>
                <td>10/12/1978</td>
                <td>M</td>
                <td>Bafoussam, Cameroun</td>
                <td>+237 654 321 098</td>
                <td>paul.kamga@email.com</td>
                <td>Camerounaise</td>
                <td>Actif</td>
                <td class="solde">75000.00 CFA</td>
                <td class="actions">
                  <button class="action-btn view-btn">
                    <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn edit-btn">
                    <lucide-icon name="edit" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn delete-btn">
                    <lucide-icon name="trash-2" class="action-icon"></lucide-icon>
                  </button>
                </td>
              </tr>
              <tr class="table-row">
                <td>CL004</td>
                <td>NGOUAN</td>
                <td>Marie</td>
                <td>05/06/1988</td>
                <td>F</td>
                <td>Garoua, Cameroun</td>
                <td>+237 699 456 789</td>
                <td>marie.ngouan@email.com</td>
                <td>Camerounaise</td>
                <td>Actif</td>
                <td class="solde">5000.00 CFA</td>
                <td class="actions">
                  <button class="action-btn view-btn">
                    <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn edit-btn">
                    <lucide-icon name="edit" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn delete-btn">
                    <lucide-icon name="trash-2" class="action-icon"></lucide-icon>
                  </button>
                </td>
              </tr>
              <tr class="table-row">
                <td>CL005</td>
                <td>TCHOUA</td>
                <td>Jean</td>
                <td>18/11/1982</td>
                <td>M</td>
                <td>Ngaoundéré, Cameroun</td>
                <td>+237 655 789 012</td>
                <td>jean.tchoua@email.com</td>
                <td>Camerounaise</td>
                <td>Actif</td>
                <td class="solde">30000.00 CFA</td>
                <td class="actions">
                  <button class="action-btn view-btn">
                    <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn edit-btn">
                    <lucide-icon name="edit" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn delete-btn">
                    <lucide-icon name="trash-2" class="action-icon"></lucide-icon>
                  </button>
                </td>
              </tr>
              <tr class="table-row">
                <td>CL006</td>
                <td>FOUDA</td>
                <td>Sophie</td>
                <td>30/04/1995</td>
                <td>F</td>
                <td>Bamenda, Cameroun</td>
                <td>+237 676 543 210</td>
                <td>sophie.fouda@email.com</td>
                <td>Camerounaise</td>
                <td>Actif</td>
                <td class="solde">15000.00 CFA</td>
                <td class="actions">
                  <button class="action-btn view-btn">
                    <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn edit-btn">
                    <lucide-icon name="edit" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn delete-btn">
                    <lucide-icon name="trash-2" class="action-icon"></lucide-icon>
                  </button>
                </td>
              </tr>
              <tr class="table-row">
                <td>CL007</td>
                <td>EKOUA</td>
                <td>David</td>
                <td>12/09/1987</td>
                <td>M</td>
                <td>Maroua, Cameroun</td>
                <td>+237 690 123 456</td>
                <td>david.ekoua@email.com</td>
                <td>Camerounaise</td>
                <td>Actif</td>
                <td class="solde">45000.00 CFA</td>
                <td class="actions">
                  <button class="action-btn view-btn">
                    <lucide-icon name="eye" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn edit-btn">
                    <lucide-icon name="edit" class="action-icon"></lucide-icon>
                  </button>
                  <button class="action-btn delete-btn">
                    <lucide-icon name="trash-2" class="action-icon"></lucide-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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

    .new-client-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #FF7D0B;
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
      background: #E6690A;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(255, 125, 11, 0.4);
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
      background: #FF8D28;
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

    .solde {
      font-weight: 600;
      color: #059669;
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

    .action-icon {
      width: 14px;
      height: 14px;
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
export class ClientsComponent implements OnInit {
  constructor(private authService: AuthService, private layoutService: LayoutService, private apiService: ApiService) {}

  ngOnInit() {
    this.layoutService.setTitle('Clients');
    // No data loading needed, table is hardcoded
  }

  logout() {
    this.authService.logout();
  }
}
