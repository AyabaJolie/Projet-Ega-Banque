import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="landing-container">
      <!-- Navigation Bar -->
      <nav class="navbar">
        <div class="nav-content">
          <div class="nav-logo">
            <img src="assets/images/logo.png" alt="EGA BANQUE" class="logo-img">
          </div>
          
          <ul class="nav-menu">
            <li *ngFor="let item of navItems; let i = index" 
                [class.active]="item.active"
                (click)="scrollToSection(item.section)">
              {{item.label}}
            </li>
          </ul>
          
          <div class="nav-actions">
            <button class="login-btn" routerLink="/login">Se connecter</button>
          </div>
        </div>
      </nav>

      <!-- Section Hero -->
      <section id="accueil" class="hero-section">
        <div class="hero-content">
          <div class="hero-left">
            <h1 class="hero-title">Gérez vos comptes et transactions facilement, en toute sécurité et fiabilité</h1>
            <button class="hero-button" routerLink="/login">Commencer maintenant</button>
          </div>
          <div class="hero-right">
            <img src="assets/images/image1.png" alt="Gestion de comptes bancaires">
          </div>
        </div>
      </section>

      <!-- Section A propos -->
      <section id="a-propos" class="about-section">
        <div class="section-header">
          <h2>A PROPOS</h2>
        </div>
        <div class="about-content">
          <div class="about-left">
            <img src="assets/images/image2.png" alt="Application Ega Banque">
          </div>
          <div class="about-right">
            <p>L'application Ega banque simplifie la gestion de vos finances en regroupant tous vos comptes sur une seule plateforme. Elle permet d'effectuer facilement des dépôts, des retraits et des virements, de suivre vos transactions en temps réel et d'accéder à des relevés détaillés. Conçue pour être intuitive, sécurisée et fiable Ega banque vous aide à garder le contrôle de vos finances au quotidien.</p>
          </div>
        </div>
      </section>

      <!-- Section Pourquoi nous -->
      <section id="pourquoi-nous" class="why-section">
        <div class="section-header">
          <h2>Pourquoi nous?</h2>
        </div>
        <div class="why-content">
          <div class="why-left">
            <div class="why-item green">Nous simplifions la gestion de vos comptes</div>
            <div class="why-item red">Vos opérations sont sécurisées et fiables à tout moment.</div>
            <div class="why-item blue">Suivez facilement vos transactions et gardez le contrôle de vos finances.</div>
          </div>
          <div class="why-right">
            <img src="assets/images/image3.png" alt="Équipe Ega Banque">
          </div>
        </div>
      </section>

      <!-- Section Services -->
      <section id="nos-services" class="services-section">
        <div class="section-header">
          <h2>Nos services</h2>
        </div>
        <div class="services-grid">
          <div class="service-card white">
            <div class="service-icon">💳</div>
            <div class="service-divider"></div>
            <h3>Gestion des comptes</h3>
          </div>
          <div class="service-card orange">
            <div class="service-icon">💰</div>
            <div class="service-divider"></div>
            <h3>Retrait rapides</h3>
          </div>
          <div class="service-card white">
            <div class="service-icon">🔄</div>
            <div class="service-divider"></div>
            <h3>Gestion des transactions</h3>
          </div>
          <div class="service-card orange">
            <div class="service-icon">↔️</div>
            <div class="service-divider"></div>
            <h3>Virements, Transferts</h3>
          </div>
          <div class="service-card white">
            <div class="service-icon">🔒</div>
            <div class="service-divider"></div>
            <h3>Dépôts sécurisés</h3>
          </div>
          <div class="service-card orange">
            <div class="service-icon">📄</div>
            <div class="service-divider"></div>
            <h3>Retraits détaillés</h3>
          </div>
        </div>
      </section>

      <!-- Section Contact -->
      <section id="contact" class="contact-section">
        <div class="section-header">
          <h2>Contactez-nous</h2>
        </div>
        <div class="contact-content">
          <div class="contact-left">
            <img src="assets/images/image4.png" alt="Contact">
          </div>
          <div class="contact-right">
            <p class="form-subtitle">Envoyez nous votre message à travers ce formulaire</p>
            <form (ngSubmit)="onSubmit()" #contactForm="ngForm">
              <div class="form-row">
                <input type="text" placeholder="Nom" [(ngModel)]="formData.nom" name="nom" required>
                <input type="text" placeholder="Prénom" [(ngModel)]="formData.prenom" name="prenom" required>
              </div>
              <div class="form-row">
                <select [(ngModel)]="formData.service" name="service" required>
                  <option value="">Sélectionnez un service</option>
                  <option value="compte">Gestion de compte</option>
                  <option value="transaction">Transaction</option>
                </select>
                <input type="tel" placeholder="Téléphone" [(ngModel)]="formData.telephone" name="telephone" required>
              </div>
              <textarea placeholder="Message" [(ngModel)]="formData.message" name="message" required></textarea>
              <p class="form-note" *ngIf="formSubmitted && (!formData.nom || !formData.prenom || !formData.service || !formData.telephone || !formData.message)">*indiquez les informations manquants</p>
              <button type="submit" class="submit-btn" [disabled]="!contactForm.form.valid">Envoyer</button>
            </form>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-left">
            <div class="footer-logo">
              <img src="assets/images/logo.png" alt="Ega Banque">
            </div>
            <p class="footer-tagline">Votre partenaire de confiance pour une gestion bancaire moderne et sécurisée</p>
            <div class="contact-info">
              <div class="contact-item">
                <span class="icon">📍</span>
                <span>Lomé, Togo</span>
              </div>
              <div class="contact-item">
                <span class="icon">📞</span>
                <span>+228 90 90 90 90</span>
              </div>
              <div class="contact-item">
                <span class="icon">✉️</span>
                <span>egabanque@tg.com</span>
              </div>
            </div>
          </div>
          
          <div class="footer-right">
            <h3>Restez connecté</h3>
            <p class="footer-desc">Suivez nos actualités et innovations</p>
            <div class="newsletter-form">
              <input type="email" placeholder="Votre email">
              <button>S'abonner</button>
            </div>
            <div class="social-icons">
              <div class="social-icon facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <div class="social-icon linkedin">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </div>
              <div class="social-icon twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <div class="footer-bottom-content">
            <p>© 2026 EgaBANQUE. Tous droits réservés</p>
            <div class="footer-links">
              <a href="#">Confidentialité</a>
              <a href="#">Conditions</a>
              <a href="#">Sécurité</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    html {
      scroll-behavior: smooth;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .landing-container {
      width: 100%;
      font-family: 'Arial', sans-serif;
    }

    /* Navigation */
    .navbar {
      background: #FFFFFF;
      padding: 15px 40px;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      animation: slideDown 0.8s ease-out;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .nav-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 5%;
    }

    .logo-img {
      height: 100px;
      width: auto;
    }

    .nav-menu {
      display: flex;
      list-style: none;
      gap: 40px;
      font-family: 'Instrument Serif';
    }

    .nav-menu li {
      font-size: 22px;
      color: #000000;
      cursor: pointer;
      position: relative;
      transition: all 0.3s ease;
    }

    .nav-menu li:hover {
      color: #FF8D28;
      transform: translateY(-2px);
    }

    .nav-menu li.active {
      color: #FF8D28;
    }

    .login-btn {
      background: #FF8D28;
      color: #000000;
      border: none;
      padding: 15px 25px;
      border-radius: 19px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 28px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      transition: all 0.3s ease;
    }

    .login-btn:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(255, 141, 40, 0.3);
    }

    /* Hero Section */
    .hero-section {
      background: #FFCC00;
      border-radius: 100px;
      padding: 80px 40px;
      position: relative;
      margin-top: 130px;
    }

    .hero-content {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 60px;
    }

    .hero-left {
      flex: 1;
    }

    .hero-right {
      flex: 1;
    }

    .hero-right img {
      width: 100%;
      max-width: 836px;
      border-radius: 20px;
      animation: fadeInRight 1s ease-out 0.6s both;
    }

    @keyframes fadeInRight {
      from {
        opacity: 0;
        transform: translateX(50px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    .hero-title {
      font-family: 'Irish Grover';
      font-size: 54px;
      color: #084506;
      margin-bottom: 50px;
      line-height: 1.4;
      font-weight: bold;
      animation: fadeInUp 1s ease-out 0.3s both;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .hero-button {
      background: #FF8D28;
      color: #000000;
      border: none;
      padding: 18px 45px;
      border-radius: 79px;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 30px;
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
      position: relative;
      overflow: hidden;
    }

    .hero-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      transition: left 0.5s;
    }

    .hero-button:hover::before {
      left: 100%;
    }

    /* Section Headers */
    .section-header {
      background: #FFCC00;
      padding: 34px 0;
      margin: 60px 0 40px;
    }

    .section-header h2 {
      font-family: 'Joti One';
      font-size: 36px;
      color: #084506;
      text-align: center;
    }

    /* About Section */
    .about-section {
      background: #FFFFFF;
      padding: 0 40px 80px;
    }

    .about-content {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 60px;
      position: relative;
    }

    .about-left {
      flex: 1;
    }

    .about-left img {
      width: 100%;
      max-width: 900px;
      border-radius: 200px;
    }

    .about-right {
      flex: 1;
    }

    .about-right p {
      font-family: 'Fenix';
      font-size: 36px;
      line-height: 50px;
      color: #000000;
      text-align: center;
    }

    /* Why Section */
    .why-section {
      background: #FFFFFF;
      padding: 0 40px 80px;
    }

    .why-content {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 60px;
    }

    .why-left {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 40px;
    }

    .why-right {
      flex: 1;
    }

    .why-right img {
      width: 100%;
      border-radius: 59px;
    }

    .why-item {
      font-family: 'Fenix';
      font-size: 40px;
      line-height: 43px;
      text-align: center;
      padding: 20px;
      border-radius: 10px;
    }

    .why-item.green {
      color: #354506;
      background: #EDE9FF;
    }

    .why-item.red {
      color: #45060A;
      background: #F3E4E4;
    }

    .why-item.blue {
      color: #130645;
      background: #F0F0F0;
    }

    /* Services Section */
    .services-section {
      background: #F6F8F7;
      padding: 0 40px 80px;
    }

    .services-grid {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }

    .service-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 15px;
      border-radius: 3px;
      box-shadow: 0 0 27px rgba(17, 24, 39, 0.05);
      text-align: center;
    }

    .service-card.white {
      background: #FFFFFF;
      color: #C35B00;
    }

    .service-card.orange {
      background: #C35B00;
      color: #FFFFFF;
    }

    .service-icon {
      width: 30px;
      height: 30px;
      margin-bottom: 15px;
    }

    .service-divider {
      width: 44px;
      height: 1.5px;
      background: #E0E3EB;
      margin-bottom: 15px;
    }

    .service-card h3 {
      font-family: 'Work Sans';
      font-size: 16px;
      font-weight: 600;
    }

    /* Contact Section */
    .contact-section {
      background: #F4F4F4;
      padding: 0 40px 80px;
    }

    .contact-content {
      width: 100%;
      display: flex;
      gap: 60px;
    }

    .contact-left {
      flex: 1;
    }

    .contact-left img {
      width: 100%;
      max-width: 502px;
    }

    .contact-right {
      flex: 1;
    }

    .form-subtitle {
      font-family: 'Work Sans';
      font-size: 14.6px;
      color: #292E3D;
      text-align: center;
      margin-bottom: 30px;
    }

    .form-row {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .contact-right input,
    .contact-right select,
    .contact-right textarea {
      flex: 1;
      padding: 7px 6px;
      border: 0.7px solid #E0E3EB;
      border-radius: 3px;
      background: #FFFFFF;
      font-family: 'Work Sans';
      font-size: 13px;
      color: #A3AAC2;
    }

    .contact-right textarea {
      width: 100%;
      height: 99px;
      resize: vertical;
      margin-bottom: 10px;
    }

    .form-note {
      font-family: 'Work Sans';
      font-size: 11.7px;
      color: #C40303;
      margin-bottom: 20px;
    }

    .submit-btn {
      background: #128B0E;
      color: #FFFFFF;
      border: none;
      padding: 12px 15px;
      border-radius: 1.5px;
      font-family: 'Work Sans';
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }

    /* Footer */
    .footer {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      padding: 80px 40px 0;
      border-top: 1px solid #e9ecef;
    }

    .footer-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      gap: 80px;
      padding-bottom: 60px;
    }

    .footer-left {
      flex: 1;
    }

    .footer-logo img {
      width: 140px;
      height: auto;
      margin-bottom: 20px;
    }

    .footer-tagline {
      font-family: 'Work Sans';
      font-size: 16px;
      color: #6c757d;
      line-height: 1.6;
      margin-bottom: 30px;
      max-width: 300px;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .contact-item .icon {
      font-size: 18px;
      width: 24px;
    }

    .contact-item span:last-child {
      font-family: 'Work Sans';
      font-size: 15px;
      color: #495057;
      font-weight: 500;
    }

    .footer-right {
      flex: 1;
      max-width: 400px;
    }

    .footer-right h3 {
      font-family: 'Work Sans';
      font-size: 20px;
      font-weight: 600;
      color: #084506;
      margin-bottom: 10px;
    }

    .footer-desc {
      font-family: 'Work Sans';
      font-size: 15px;
      color: #6c757d;
      margin-bottom: 25px;
      line-height: 1.5;
    }

    .newsletter-form {
      display: flex;
      gap: 12px;
      margin-bottom: 30px;
    }

    .newsletter-form input {
      flex: 1;
      padding: 14px 18px;
      border: 1px solid #dee2e6;
      border-radius: 8px;
      background: #ffffff;
      font-family: 'Work Sans';
      font-size: 15px;
      transition: border-color 0.3s ease;
    }

    .newsletter-form input:focus {
      outline: none;
      border-color: #FF8D28;
    }

    .newsletter-form button {
      background: #FF8D28;
      color: #ffffff;
      border: none;
      padding: 14px 24px;
      border-radius: 8px;
      font-family: 'Work Sans';
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .newsletter-form button:hover {
      background: #e67e1a;
      transform: translateY(-1px);
    }

    .social-icons {
      display: flex;
      gap: 15px;
    }

    .social-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .social-icon:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    }

    .social-icon.facebook {
      background: linear-gradient(135deg, #1877F2, #42a5f5);
    }

    .social-icon.linkedin {
      background: linear-gradient(135deg, #0A66C2, #1976d2);
    }

    .social-icon.twitter {
      background: linear-gradient(135deg, #1DA1F2, #42a5f5);
    }

    .footer-bottom {
      background: rgba(8, 69, 6, 0.05);
      padding: 20px 40px;
      margin: 0 -40px;
      border-top: 1px solid #e9ecef;
    }

    .footer-bottom-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-bottom p {
      font-family: 'Work Sans';
      font-size: 14px;
      color: #6c757d;
      margin: 0;
    }

    .footer-links {
      display: flex;
      gap: 25px;
    }

    .footer-links a {
      font-family: 'Work Sans';
      font-size: 14px;
      color: #6c757d;
      text-decoration: none;
      transition: color 0.3s ease;
    }

    .footer-links a:hover {
      color: #084506;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .nav-content {
        flex-direction: column;
        gap: 20px;
      }
      
      .nav-menu {
        gap: 20px;
      }
      
      .hero-title {
        font-size: 28px;
      }
      
      .hero-content,
      .about-content,
      .why-content,
      .contact-content {
        flex-direction: column;
      }
      
      .services-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      
      .footer-content {
        flex-direction: column;
      }
    }
  `]
})
export class LandingComponent {
  navItems = [
    { label: 'Accueil', active: true, section: 'accueil' },
    { label: 'A propos', active: false, section: 'a-propos' },
    { label: 'Pourquoi nous?', active: false, section: 'pourquoi-nous' },
    { label: 'Nos services', active: false, section: 'nos-services' },
    { label: 'Contact', active: false, section: 'contact' }
  ];

  formData = {
    nom: '',
    prenom: '',
    service: '',
    telephone: '',
    message: ''
  };

  formSubmitted = false;

  scrollToSection(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  selectNavItem(index: number) {
    this.navItems.forEach((item, i) => {
      item.active = i === index;
    });
  }

  onSubmit() {
    this.formSubmitted = true;
    console.log('Formulaire soumis:', this.formData);

    // Check if all required fields are filled
    if (!this.formData.nom || !this.formData.prenom || !this.formData.service || !this.formData.telephone || !this.formData.message) {
      // Don't show success message if form is incomplete
      return;
    }

    alert('Message envoyé avec succès!');
    this.resetForm();
    this.formSubmitted = false;
  }

  resetForm() {
    this.formData = {
      nom: '',
      prenom: '',
      service: '',
      telephone: '',
      message: ''
    };
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;

    this.navItems.forEach((item, index) => {
      const element = document.getElementById(item.section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const elementTop = rect.top + scrollPosition;
        const elementBottom = elementTop + rect.height;
        const windowHeight = window.innerHeight;
        const scrollCenter = scrollPosition + windowHeight / 2;

        if (scrollCenter >= elementTop && scrollCenter <= elementBottom) {
          this.selectNavItem(index);
        }
      }
    });
  }
}
