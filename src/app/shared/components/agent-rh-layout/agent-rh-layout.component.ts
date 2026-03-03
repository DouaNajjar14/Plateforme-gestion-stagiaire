import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-agent-rh-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './agent-rh-layout.component.html',
  styleUrls: ['./agent-rh-layout.component.css']
})
export class AgentRhLayoutComponent {
  sidebarCollapsed = signal(false);
  currentYear = new Date().getFullYear();

  navItems = [
    {
      label: 'Tableau de Bord',
      icon: 'dashboard',
      route: '/agent-rh/dashboard'
    },
    {
      label: 'Sujets PFE',
      icon: 'briefcase',
      route: '/agent-rh/sujets-pfe'
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
