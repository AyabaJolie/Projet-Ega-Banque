import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Client {
  id?: number;
  nom: string;
  prenom: string;
  dateNaissance: string;
  sexe: string;
  adresse: string;
  telephone: string;
  email: string;
  nationalite: string;
  solde: string;
  statut?: string;
}

export interface Compte {
  id?: number;
  numero: string;
  solde: number;
  clientId: number;
  dateCreation?: Date;
  type?: string;
  statut?: string;
}

export interface Transaction {
  id?: number;
  type: 'VERSEMENT' | 'RETRAIT' | 'VIREMENT';
  montant: number;
  compteId: number;
  compteDestinationId?: number;
  dateTransaction?: Date;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.baseUrl}/clients`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.baseUrl}/clients/${id}`);
  }

  createClient(client: Client): Observable<Client> {
    return this.http.post<Client>(`${this.baseUrl}/clients`, client);
  }

  updateClient(id: number, client: Client): Observable<Client> {
    return this.http.put<Client>(`${this.baseUrl}/clients/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/clients/${id}`);
  }

  // Comptes
  getComptes(): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.baseUrl}/comptes`);
  }

  getCompte(id: number): Observable<Compte> {
    return this.http.get<Compte>(`${this.baseUrl}/comptes/${id}`);
  }

  getComptesByClient(clientId: number): Observable<Compte[]> {
    return this.http.get<Compte[]>(`${this.baseUrl}/clients/${clientId}/comptes`);
  }

  createCompte(compte: Compte): Observable<Compte> {
    return this.http.post<Compte>(`${this.baseUrl}/comptes`, compte);
  }

  updateCompte(id: number, compte: Compte): Observable<Compte> {
    return this.http.put<Compte>(`${this.baseUrl}/comptes/${id}`, compte);
  }

  deleteCompte(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/comptes/${id}`);
  }

  // Transactions
  versement(compteId: number, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/comptes/${compteId}/versement`, { montant });
  }

  retrait(compteId: number, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/comptes/${compteId}/retrait`, { montant });
  }

  virement(compteSourceId: number, compteDestinationId: number, montant: number): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.baseUrl}/comptes/${compteSourceId}/virement`, {
      compteDestinationId,
      montant
    });
  }

  getTransactions(compteId: number, dateDebut?: string, dateFin?: string): Observable<Transaction[]> {
    let url = `${this.baseUrl}/comptes/${compteId}/transactions`;
    const params = [];
    if (dateDebut) params.push(`dateDebut=${dateDebut}`);
    if (dateFin) params.push(`dateFin=${dateFin}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get<Transaction[]>(url);
  }

  imprimerReleve(compteId: number, dateDebut?: string, dateFin?: string): Observable<Blob> {
    let url = `${this.baseUrl}/comptes/${compteId}/releve`;
    const params = [];
    if (dateDebut) params.push(`dateDebut=${dateDebut}`);
    if (dateFin) params.push(`dateFin=${dateFin}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}