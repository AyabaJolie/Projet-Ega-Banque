import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LucideAngularModule, ArrowLeft, Eye, Edit, Trash2, Lock, Unlock } from 'lucide-angular';

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
  selector: 'app-account-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="account-detail-container">
      <div class="header">
        <button class="back-btn" routerLink="client-comptes">
          <lucide-icon name="arrow-left" class="back-icon"></lucide-icon>
          Retour aux comptes
        </button>
        <h1>Détails du Compte</h1>
      </div>

      <div *ngIf="compte" class="account-details">
        <div class="detail-card">
          <h2>Informations Générales</h2>
          <div class="detail-grid">
            <div class="detail-item">
              <label>ID du Compte</label>
              <span>{{ compte.id }}</span>
            </div>
            <div class="detail-item">
              <label>Numéro de Compte</label>
              <span class="account-number">{{ compte.numeroCompte }}</span>
            </div>
            <div class="detail-item">
              <label>Type de Compte</label>
              <span class="account-type-badge" [ngClass]="getAccountTypeClass(compte.typeCompte)">
                {{ compte.typeCompte }}
              </span>
            </div>
            <div class="detail-item">
              <label>Date de Création</label>
              <span>{{ compte.dateCreation }}</span>
            </div>
            <div class="detail-item">
              <label>Solde</label>
              <span class="solde">{{ compte.solde | number }} {{ compte.devise }}</span>
            </div>
            <div class="detail-item">
              <label>Propriétaire</label>
              <span>{{ compte.proprietaire }}</span>
            </div>
            <div class="detail-item">
              <label>Statut</label>
              <span class="status-badge" [ngClass]="getStatusClass(compte.statut)">
                {{ compte.statut }}
              </span>
            </div>
            <div class="detail-item">
              <label>Devise</label>
              <span>{{ compte.devise }}</span>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <h3>Actions</h3>
          <div class="actions-grid">
            <button class="action-btn edit-btn" (click)="editCompte()">
              <lucide-icon name="edit"></lucide-icon>
              Modifier
            </button>
            <button class="action-btn delete-btn" (click)="deleteCompte()">
              <lucide-icon name="trash-2"></lucide-icon>
              Supprimer
            </button>
            <button class="action-btn block-btn" (click)="toggleBlockCompte()">
              <lucide-icon [name]="compte.statut === 'Bloqué' ? 'unlock' : 'lock'"></lucide-icon>
              {{ compte.statut === 'Bloqué' ? 'Débloquer' : 'Bloquer' }}
            </button>
          </div>
        </div>
      </div>

      <div *ngIf="!compte" class="no-account">
        <p>Compte non trouvé.</p>
      </div>
    </div>
  `,
  styles: [`
    .account-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      font-family: 'Inter', sans-serif;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 30px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #F3F4F6;
      color: #374151;
      border: none;
      border-radius: 8px;
      padding: 10px 16px;
      font-family: 'Inter';
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .back-btn:hover {
      background: #E5E7EB;
    }

    .back-icon {
      width: 16px;
      height: 16px;
    }

    .header h1 {
      font-size: 28px;
      color: #1F2937;
      margin: 0;
    }

    .account-details {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .detail-card {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      padding: 30px;
    }

    .detail-card h2 {
      font-size: 24px;
      color: #1F2937;
      margin-bottom: 20px;
      border-bottom: 2px solid #3B82F6;
      padding-bottom: 10px;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .detail-item label {
      font-weight: 600;
      color: #6B7280;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .detail-item span {
      font-size: 16px;
      color: #1F2937;
      font-weight: 500;
    }

    .account-number {
      font-family: 'Inter';
      font-weight: 600;
      color: #1F2937;
      letter-spacing: 1px;
      font-size: 18px;
    }

    .solde {
      font-weight: 600;
      color: #059669;
      font-size: 18px;
    }

    .account-type-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
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

    .status-badge {
      display: inline-block;
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 14px;
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
    }

    .actions-section {
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
      padding: 30px;
    }

    .actions-section h3 {
      font-size: 20px;
      color: #1F2937;
      margin-bottom: 20px;
    }

    .actions-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .action-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 20px;
      border: none;
      border-radius: 10px;
      font-family: 'Inter';
      font-size: 14px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
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

    .no-account {
      text-align: center;
      padding: 50px;
      background: #FFFFFF;
      border-radius: 15px;
      box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.08);
    }

    .no-account p {
      font-size: 18px;
      color: #6B7280;
    }
  `]
})
export class AccountDetailComponent implements OnInit {
  compte: Compte | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // In a real app, this would fetch from a service
      // For now, we'll simulate with mock data
      this.loadMockAccount(+id);
    }
  }

  loadMockAccount(id: number) {
    // Mock account data - in real app, fetch from API
    const mockAccounts: Compte[] = [
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
      // Add more mock accounts as needed
    ];

    this.compte = mockAccounts.find(acc => acc.id === id) || null;
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

  getStatusClass(statut: string): string {
    const statutMap: {[key: string]: string} = {
      'Actif': 'actif',
      'Bloqué': 'bloque',
      'Inactif': 'inactif',
      'Supprimé': 'supprime'
    };
    return statutMap[statut] || 'inactif';
  }

  editCompte() {
    console.log('Modifier compte:', this.compte);
    // Implement edit logic
  }

  deleteCompte() {
    if (confirm(`Êtes-vous sûr de vouloir supprimer le compte ${this.compte?.numeroCompte} ?`)) {
      console.log('Supprimer compte:', this.compte);
      // Implement delete logic
    }
  }

  toggleBlockCompte() {
    if (this.compte) {
      const newStatus = this.compte.statut === 'Bloqué' ? 'Actif' : 'Bloqué';
      const message = this.compte.statut === 'Bloqué'
        ? `Débloquer le compte ${this.compte.numeroCompte} ?`
        : `Bloquer le compte ${this.compte.numeroCompte} ?`;

      if (confirm(message)) {
        this.compte.statut = newStatus;
        console.log('Changement de statut:', this.compte);
        // Implement block/unblock logic
      }
    }
  }
}
