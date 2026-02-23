import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <header class="header">
        <div class="logo">
          <span class="logo-text">ooredoo</span>
          <span class="logo-badge">GESTION DES STAGES</span>
        </div>
        <div class="user-info">
          <span class="welcome">Bienvenue, {{ authService.currentUser()?.prenom }} {{ authService.currentUser()?.nom }}</span>
          <span class="role">{{ authService.currentUser()?.role }}</span>
          <button class="logout-btn" (click)="logout()">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Déconnexion
          </button>
        </div>
      </header>
      <main class="content">
        <h1>Tableau de Bord Admin</h1>
        <p>Bienvenue dans votre espace de gestion des stagiaires.</p>
      </main>
    </div>
  `,
  styles: [`
    .dashboard {
      min-height: 100vh;
      background: #f3f4f6;
    }
    .header {
      background: white;
      padding: 1rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .logo-text {
      color: #ED1C24;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .logo-badge {
      background: #ED1C24;
      color: white;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .user-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .welcome {
      font-weight: 500;
    }
    .role {
      background: #ED1C24;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
    }
    .logout-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 1px solid #ED1C24;
      color: #ED1C24;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }
    .logout-btn:hover {
      background: #ED1C24;
      color: white;
    }
    .logout-btn svg {
      width: 18px;
      height: 18px;
    }
    .content {
      padding: 2rem;
    }
    .content h1 {
      color: #1f2937;
      margin-bottom: 0.5rem;
    }
    .content p {
      color: #6b7280;
    }
  `]
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}

  logout(): void {
    this.authService.logout();
  }
}
""