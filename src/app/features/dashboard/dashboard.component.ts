import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DepartementService } from '../../core/services/departement.service';
import { AgentRHService } from '../../core/services/agent-rh.service';
import { EncadrantService } from '../../core/services/encadrant.service';
import { Departement } from '../../core/models/departement.model';
import { AgentRH } from '../../core/models/agent-rh.model';
import { Encadrant } from '../../core/models/encadrant.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  totalDepartements = signal(0);
  totalAgentsRH = signal(0);
  totalEncadrants = signal(0);
  userName = '';

  constructor(
    public authService: AuthService,
    private departementService: DepartementService,
    private agentRHService: AgentRHService,
    private encadrantService: EncadrantService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    this.userName = user ? `${user.prenom} ${user.nom}` : '';
    this.loadStats();
  }

  loadStats(): void {
    this.departementService.listerActifs().subscribe({
      next: (list: Departement[]) => this.totalDepartements.set(list.length)
    });
    this.agentRHService.listerActifs().subscribe({
      next: (list: AgentRH[]) => this.totalAgentsRH.set(list.length)
    });
    this.encadrantService.listerActifs().subscribe({
      next: (list: Encadrant[]) => this.totalEncadrants.set(list.length)
    });
  }
}