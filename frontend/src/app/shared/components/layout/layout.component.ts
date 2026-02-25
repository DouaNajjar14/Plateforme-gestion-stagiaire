import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  sidebarCollapsed = signal(false);
  currentYear = new Date().getFullYear();

  navItems = [
    {
      label: 'Tableau de Bord',
      icon: 'dashboard',
      route: '/admin/dashboard'
    },
    {
      label: 'Départements',
      icon: 'building',
      route: '/admin/departements'
    },
    {
      label: 'Agents RH',
      icon: 'users',
      route: '/admin/agents-rh'
    },
    {
      label: 'Sujets PFE',
      icon: 'briefcase',
      route: '/admin/sujets-pfe'
    }
  ];

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  toggleSidebar(): void {
    this.sidebarCollapsed.update(v => !v);
  }

  logout(): void {
    this.authService.logout();
  }

  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
