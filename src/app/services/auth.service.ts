import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  nom: string;
  email: string;
  password: string;
  role: 'admin' | 'client';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private users: User[] = [
    {
      nom: 'admin',
      email: 'admin@gmail.com',
      password: 'admin',
      role: 'admin'
    },
    {
      nom: 'client',
      email: 'client@gmail.com',
      password: 'client',
      role: 'client'
    }
  ];

  private currentUser: User | null = null;

  constructor(private router: Router) {}

  login(email: string, password: string): boolean {
    const user = this.users.find(u => u.email === email && u.password === password);
    
    if (user) {
      this.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      // Redirection selon le rôle
      if (user.role === 'admin') {
        this.router.navigate(['/app/dashboard']);
      } else {
        this.router.navigate(['/app/dashboard']);
      }
      
      return true;
    }
    
    return false;
  }

  logout(): void {
    this.currentUser = null;
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
  }

  getCurrentUser(): User | null {
    if (!this.currentUser) {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        this.currentUser = JSON.parse(stored);
      }
    }
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isClient(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'client';
  }

  changePassword(oldPassword: string, newPassword: string): boolean {
    const user = this.getCurrentUser();
    if (user && user.password === oldPassword) {
      user.password = newPassword;
      // Update in users array
      const index = this.users.findIndex(u => u.email === user.email);
      if (index !== -1) {
        this.users[index].password = newPassword;
      }
      // Update localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  getAdminUser(): User | null {
    return this.users.find(u => u.role === 'admin') || null;
  }

  changeAdminPassword(newPassword: string): boolean {
    const admin = this.getAdminUser();
    if (admin) {
      admin.password = newPassword;
      // Update localStorage if admin is current user
      if (this.getCurrentUser()?.email === admin.email) {
        localStorage.setItem('currentUser', JSON.stringify(admin));
      }
      return true;
    }
    return false;
  }
}
