import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="dashboard">
      <div class="side-image">
        <img src="assets/images/image5.png" alt="Login illustration">
      </div>
      
      <div class="login-form">
        <div class="logo-container">
          <img src="assets/images/logo.png" alt="Logo" class="form-logo">
        </div>
        
        <div class="container">
          <div class="content-container">
            <div class="input-fields">
              <div class="text-field">
                <label>Nom</label>
                <div class="input-field focused">
                  <input type="text" [(ngModel)]="formData.nom" name="nom" placeholder="Veuillez entrer votre nom">
                </div>
                <div *ngIf="nomError" class="error-message">{{ nomError }}</div>
              </div>

              <div class="text-field">
                <label>Email</label>
                <div class="input-field">
                  <input type="email" [(ngModel)]="formData.email" name="email" placeholder="Entrer votre adresse mail">
                </div>
                <div *ngIf="emailError" class="error-message">{{ emailError }}</div>
              </div>

              <div class="text-field">
                <label>Mot de passe</label>
                <div class="input-field">
                  <input [type]="showPassword ? 'text' : 'password'" [(ngModel)]="formData.password" name="password" placeholder="entrer votre mot de passe">
                  <div class="eye-icon"
     (click)="togglePassword()"
     [ngClass]="{ 'eye-off': showPassword }">
  <svg viewBox="0 0 24 24">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
  </svg>
</div>

                </div>
                <div *ngIf="passwordError" class="error-message">{{ passwordError }}</div>
              </div>
            </div>
            
            <button class="primary-button" (click)="onLogin()">
              Connexion
            </button>

            <div *ngIf="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard {
      width: 100vw;
      height: 100vh;
      background: #FFC107;
      display: flex;
    }

    .side-image {
      flex: 0.6;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
    }

    .side-image img {
      width: 100%;
      height: auto;
      max-width: 500px;
      object-fit: contain;
    }

    .login-form {
      flex: 1.4;
      background: #FFFFFF;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px;
      position: relative;
    }

    .logo-container {
      margin-bottom: 40px;
    }

    .form-logo {
      width: 250px;
      height: auto;
    }

    .container {
      width: 100%;
      max-width: 600px;
    }

    .content-container {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    .input-fields {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .text-field {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .text-field label {
      font-family: 'Poppins';
      font-weight: 500;
      font-size: 20px;
      color: #9794AA;
    }

    .input-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 25px 30px;
      border: 1px solid #CBCAD7;
      border-radius: 6px;
    }

    .input-field.focused {
      border: 2px solid #407BFF;
      filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.1));
    }

    .input-field input {
      border: none;
      outline: none;
      font-family: 'Poppins';
      font-weight: 500;
      font-size: 20px;
      color: #49475A;
      background: transparent;
      flex: 1;
    }

    .input-field input::placeholder {
      color: #686677;
    }

    .eye-icon {
      width: 24px;
      height: 24px;
      cursor: pointer;
      color: #49475A;
    }

    .primary-button {
      padding: 25px 30px;
      background: #FF5E07;
      border-radius: 6px;
      border: none;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-weight: 700;
      font-size: 28px;
      color: #FFFFFF;
      cursor: pointer;
      width: 100%;
    }

    @media (max-width: 768px) {
      .dashboard {
        flex-direction: column;
      }

      .side-image {
        height: 200px;
      }
    }
   .eye-icon {
  position: relative;
  width: 24px;
  height: 24px;
  cursor: pointer;
}

.eye-icon svg {
  width: 100%;
  height: 100%;
  fill: #666;
}

/* BARRE */
.eye-icon.eye-off::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -4px;
  width: 32px;
  height: 2px;
  background: #666;
  transform: rotate(-45deg);
  z-index: 10;
}

.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 5px;
  font-family: 'Poppins';
  font-weight: 500;
}

  

  `]
})
export class LoginComponent {
  formData = {
    nom: '',
    email: '',
    password: ''
  };

  showPassword = false;
  errorMessage = '';
  nomError = '';
  emailError = '';
  passwordError = '';

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  constructor(private authService: AuthService) {}

  onLogin() {
    // Clear all errors
    this.nomError = '';
    this.emailError = '';
    this.passwordError = '';
    this.errorMessage = '';

    // Validate fields
    let hasError = false;

    if (!this.formData.nom.trim()) {
      this.nomError = 'Le nom est requis';
      hasError = true;
    }

    if (!this.formData.email.trim()) {
      this.emailError = 'L\'email est requis';
      hasError = true;
    } else if (!this.isValidEmail(this.formData.email)) {
      this.emailError = 'Veuillez entrer un email valide';
      hasError = true;
    }

    if (!this.formData.password.trim()) {
      this.passwordError = 'Le mot de passe est requis';
      hasError = true;
    }

    if (hasError) {
      return;
    }

    const success = this.authService.login(this.formData.email, this.formData.password);

    if (!success) {
      this.errorMessage = 'Email ou mot de passe incorrect';
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}