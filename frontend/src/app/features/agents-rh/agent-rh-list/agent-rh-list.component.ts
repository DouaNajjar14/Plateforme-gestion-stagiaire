import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgentRHService } from '../../../core/services/agent-rh.service';
import { AgentRH, AgentRHRequest, AgentRHUpdateRequest } from '../../../core/models/agent-rh.model';

@Component({
  selector: 'app-agent-rh-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './agent-rh-list.component.html',
  styleUrls: ['./agent-rh-list.component.css']
})
export class AgentRhListComponent implements OnInit {
  agents = signal<AgentRH[]>([]);
  filteredAgents = signal<AgentRH[]>([]);
  isLoading = signal(false);
  searchTerm = '';
  activeFilter: 'actifs' | 'archives' | 'tous' = 'actifs';

  // Modal
  showModal = signal(false);
  showConfirm = signal(false);
  modalMode: 'create' | 'edit' = 'create';
  editingAgent: AgentRH | null = null;
  modalError = signal<string | null>(null);
  isSaving = signal(false);
  confirmAgent: AgentRH | null = null;
  showPassword = false;

  // Form fields
  formNom = '';
  formPrenom = '';
  formEmail = '';
  formTel = '';
  formMotDePasse = '';

  // Toast
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  constructor(private agentService: AgentRHService) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.isLoading.set(true);
    const obs =
      this.activeFilter === 'actifs' ? this.agentService.listerActifs() :
      this.activeFilter === 'archives' ? this.agentService.listerArchives() :
      this.agentService.listerTous();

    obs.subscribe({
      next: (data) => {
        this.agents.set(data);
        this.applyFilter();
        this.isLoading.set(false);
      },
      error: () => {
        this.showToast('Erreur lors du chargement des agents RH', 'error');
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const filtered = this.agents().filter(a =>
      a.nom.toLowerCase().includes(term) ||
      a.prenom.toLowerCase().includes(term) ||
      a.email.toLowerCase().includes(term)
    );
    this.filteredAgents.set(filtered);
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  setFilter(filter: 'actifs' | 'archives' | 'tous'): void {
    this.activeFilter = filter;
    this.loadAgents();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.resetForm();
    this.editingAgent = null;
    this.modalError.set(null);
    this.showModal.set(true);
  }

  openEditModal(agent: AgentRH): void {
    this.modalMode = 'edit';
    this.formNom = agent.nom;
    this.formPrenom = agent.prenom;
    this.formEmail = agent.email;
    this.formTel = agent.tel || '';
    this.formMotDePasse = '';
    this.editingAgent = agent;
    this.modalError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
    this.editingAgent = null;
    this.modalError.set(null);
  }

  resetForm(): void {
    this.formNom = '';
    this.formPrenom = '';
    this.formEmail = '';
    this.formTel = '';
    this.formMotDePasse = '';
    this.showPassword = false;
  }

  saveModal(): void {
    if (!this.formNom.trim() || !this.formPrenom.trim() || !this.formEmail.trim()) {
      this.modalError.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSaving.set(true);
    this.modalError.set(null);

    if (this.modalMode === 'create') {
      if (!this.formMotDePasse.trim()) {
        this.modalError.set('Le mot de passe est obligatoire');
        this.isSaving.set(false);
        return;
      }
      const request: AgentRHRequest = {
        nom: this.formNom.trim(),
        prenom: this.formPrenom.trim(),
        email: this.formEmail.trim(),
        tel: this.formTel.trim(),
        motDePasse: this.formMotDePasse
      };
      this.agentService.creer(request).subscribe({
        next: () => {
          this.showToast('Agent RH créé avec succès', 'success');
          this.closeModal();
          this.loadAgents();
          this.isSaving.set(false);
        },
        error: (err) => {
          this.modalError.set(err.error?.message || 'Erreur lors de la création');
          this.isSaving.set(false);
        }
      });
    } else {
      const request: AgentRHUpdateRequest = {
        nom: this.formNom.trim(),
        prenom: this.formPrenom.trim(),
        email: this.formEmail.trim(),
        tel: this.formTel.trim()
      };
      this.agentService.modifier(this.editingAgent!.id, request).subscribe({
        next: () => {
          this.showToast('Agent RH modifié avec succès', 'success');
          this.closeModal();
          this.loadAgents();
          this.isSaving.set(false);
        },
        error: (err) => {
          this.modalError.set(err.error?.message || 'Erreur lors de la modification');
          this.isSaving.set(false);
        }
      });
    }
  }

  // Archive/Unarchive
  openArchiveConfirm(agent: AgentRH): void {
    this.confirmAgent = agent;
    this.showConfirm.set(true);
  }

  closeConfirm(): void {
    this.showConfirm.set(false);
    this.confirmAgent = null;
  }

  confirmArchive(): void {
    if (!this.confirmAgent) return;

    const action = this.confirmAgent.actif
      ? this.agentService.archiver(this.confirmAgent.id)
      : this.agentService.desarchiver(this.confirmAgent.id);

    const label = this.confirmAgent.actif ? 'archivé' : 'désarchivé';

    action.subscribe({
      next: () => {
        this.showToast(`Agent RH ${label} avec succès`, 'success');
        this.closeConfirm();
        this.loadAgents();
      },
      error: () => {
        this.showToast(`Erreur lors de l'opération`, 'error');
        this.closeConfirm();
      }
    });
  }

  // Toast
  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  get activeCount(): number {
    return this.agents().filter(a => a.actif).length;
  }

  get archivedCount(): number {
    return this.agents().filter(a => !a.actif).length;
  }
}
