import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { SujetPfeService } from '../../../core/services/sujet-pfe.service';
import { DepartementService } from '../../../core/services/departement.service';
import { Statut, Page, SujetPfe } from '../../../core/models/sujet-pfe.model';
import { Departement } from '../../../core/models/departement.model';

@Component({
  selector: 'app-agent-rh-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './agent-rh-dashboard.component.html',
  styleUrls: ['./agent-rh-dashboard.component.css']
})
export class AgentRhDashboardComponent implements OnInit {
  totalSujets = signal(0);
  sujetsOuverts = signal(0);
  sujetsPourvus = signal(0);
  sujetsFermes = signal(0);
  totalDepartements = signal(0);
  recentSujets = signal<SujetPfe[]>([]);
  userName = '';

  constructor(
    public authService: AuthService,
    private sujetPfeService: SujetPfeService,
    private departementService: DepartementService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.userName = user ? `${user.prenom} ${user.nom}` : '';
    this.loadStats();
  }

  loadStats(): void {
    this.sujetPfeService.listerActifs(0, 1).subscribe({
      next: (page: Page<SujetPfe>) => this.totalSujets.set(page.totalElements)
    });
    this.sujetPfeService.rechercher(Statut.OUVERT, undefined, undefined, 0, 1).subscribe({
      next: (page: Page<SujetPfe>) => this.sujetsOuverts.set(page.totalElements)
    });
    this.sujetPfeService.rechercher(Statut.POURVU, undefined, undefined, 0, 1).subscribe({
      next: (page: Page<SujetPfe>) => this.sujetsPourvus.set(page.totalElements)
    });
    this.sujetPfeService.rechercher(Statut.FERME, undefined, undefined, 0, 1).subscribe({
      next: (page: Page<SujetPfe>) => this.sujetsFermes.set(page.totalElements)
    });
    this.departementService.listerActifs().subscribe({
      next: (list: Departement[]) => this.totalDepartements.set(list.length)
    });
    // Load 5 most recent subjects
    this.sujetPfeService.listerActifs(0, 5).subscribe({
      next: (page: Page<SujetPfe>) => this.recentSujets.set(page.content)
    });
  }

  getStatutLabel(statut: Statut): string {
    const labels: Record<string, string> = {
      OUVERT: 'Ouvert',
      POURVU: 'Pourvu',
      FERME: 'Fermé'
    };
    return labels[statut] || statut;
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }
}
