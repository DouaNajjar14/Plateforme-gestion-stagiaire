import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SujetPfeService } from '../../../core/services/sujet-pfe.service';
import { DepartementService } from '../../../core/services/departement.service';
import { SujetPfe, SujetPfeRequest, Niveau, Statut, Page } from '../../../core/models/sujet-pfe.model';
import { Departement } from '../../../core/models/departement.model';

@Component({
  selector: 'app-sujet-pfe-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sujet-pfe-list.component.html',
  styleUrls: ['./sujet-pfe-list.component.css']
})
export class SujetPfeListComponent implements OnInit {
  sujets = signal<SujetPfe[]>([]);
  departements = signal<Departement[]>([]);
  isLoading = signal(false);
  activeFilter: 'actifs' | 'archives' | 'tous' = 'actifs';

  // Pagination
  currentPage = 0;
  totalPages = 0;
  totalElements = 0;
  pageSize = 10;

  // Search/filter
  searchTitre = '';
  searchStatut: Statut | '' = '';
  searchDepartementId = '';

  // Modal
  showModal = signal(false);
  showConfirm = signal(false);
  showDetail = signal(false);
  modalMode: 'create' | 'edit' = 'create';
  editingSujet: SujetPfe | null = null;
  detailSujet: SujetPfe | null = null;
  confirmSujet: SujetPfe | null = null;
  confirmAction: 'archiver' | 'desarchiver' | 'fermer' = 'archiver';
  modalError = signal<string | null>(null);
  isSaving = signal(false);

  // Form fields
  formTitre = '';
  formMission = '';
  formSpecialite = '';
  formCompetences = '';
  formNombreStagiaires = 1;
  formNiveau: Niveau = Niveau.L3;
  formDureeEnMois = 1;
  formDepartementId = '';

  // Enums for template
  niveaux = Object.values(Niveau);
  statuts = Object.values(Statut);

  // Toast
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  constructor(
    private sujetService: SujetPfeService,
    private departementService: DepartementService
  ) {}

  ngOnInit(): void {
    this.loadSujets();
    this.loadDepartements();
  }

  loadDepartements(): void {
    this.departementService.listerActifs().subscribe({
      next: (data) => this.departements.set(data),
      error: () => {}
    });
  }

  loadSujets(): void {
    this.isLoading.set(true);

    // If searching, use rechercher endpoint
    if (this.searchTitre || this.searchStatut || this.searchDepartementId) {
      this.sujetService.rechercher(
        this.searchStatut as Statut || undefined,
        this.searchDepartementId || undefined,
        this.searchTitre || undefined,
        this.currentPage,
        this.pageSize
      ).subscribe({
        next: (page) => this.handlePageResponse(page),
        error: () => {
          this.showToast('Erreur lors du chargement', 'error');
          this.isLoading.set(false);
        }
      });
      return;
    }

    const obs =
      this.activeFilter === 'actifs' ? this.sujetService.listerActifs(this.currentPage, this.pageSize) :
      this.activeFilter === 'archives' ? this.sujetService.listerArchives(this.currentPage, this.pageSize) :
      this.sujetService.listerTous(this.currentPage, this.pageSize);

    obs.subscribe({
      next: (page) => this.handlePageResponse(page),
      error: () => {
        this.showToast('Erreur lors du chargement des sujets PFE', 'error');
        this.isLoading.set(false);
      }
    });
  }

  handlePageResponse(page: Page<SujetPfe>): void {
    this.sujets.set(page.content);
    this.totalPages = page.totalPages;
    this.totalElements = page.totalElements;
    this.isLoading.set(false);
  }

  setFilter(filter: 'actifs' | 'archives' | 'tous'): void {
    this.activeFilter = filter;
    this.currentPage = 0;
    this.clearSearch();
    this.loadSujets();
  }

  clearSearch(): void {
    this.searchTitre = '';
    this.searchStatut = '';
    this.searchDepartementId = '';
  }

  onSearch(): void {
    this.currentPage = 0;
    this.loadSujets();
  }

  goToPage(page: number): void {
    if (page < 0 || page >= this.totalPages) return;
    this.currentPage = page;
    this.loadSujets();
  }

  // Modal
  openCreateModal(): void {
    this.modalMode = 'create';
    this.resetForm();
    this.editingSujet = null;
    this.modalError.set(null);
    this.showModal.set(true);
  }

  openEditModal(sujet: SujetPfe): void {
    this.modalMode = 'edit';
    this.formTitre = sujet.titre;
    this.formMission = sujet.mission;
    this.formSpecialite = sujet.specialite;
    this.formCompetences = sujet.competencesRequises;
    this.formNombreStagiaires = sujet.nombreStagiaires;
    this.formNiveau = sujet.niveauAcademique;
    this.formDureeEnMois = sujet.dureeEnMois;
    this.formDepartementId = sujet.departementId;
    this.editingSujet = sujet;
    this.modalError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.resetForm();
    this.editingSujet = null;
    this.modalError.set(null);
  }

  resetForm(): void {
    this.formTitre = '';
    this.formMission = '';
    this.formSpecialite = '';
    this.formCompetences = '';
    this.formNombreStagiaires = 1;
    this.formNiveau = Niveau.L3;
    this.formDureeEnMois = 1;
    this.formDepartementId = '';
  }

  saveModal(): void {
    if (!this.formTitre.trim() || !this.formMission.trim() || !this.formSpecialite.trim() ||
        !this.formCompetences.trim() || !this.formDepartementId) {
      this.modalError.set('Veuillez remplir tous les champs obligatoires');
      return;
    }

    this.isSaving.set(true);
    this.modalError.set(null);

    const request: SujetPfeRequest = {
      titre: this.formTitre.trim(),
      mission: this.formMission.trim(),
      specialite: this.formSpecialite.trim(),
      competencesRequises: this.formCompetences.trim(),
      nombreStagiaires: this.formNombreStagiaires,
      niveauAcademique: this.formNiveau,
      dureeEnMois: this.formDureeEnMois,
      departementId: this.formDepartementId
    };

    const obs = this.modalMode === 'create'
      ? this.sujetService.creer(request)
      : this.sujetService.modifier(this.editingSujet!.id, request);

    const label = this.modalMode === 'create' ? 'créé' : 'modifié';

    obs.subscribe({
      next: () => {
        this.showToast(`Sujet PFE ${label} avec succès`, 'success');
        this.closeModal();
        this.loadSujets();
        this.isSaving.set(false);
      },
      error: (err) => {
        this.modalError.set(err.error?.message || `Erreur lors de l'opération`);
        this.isSaving.set(false);
      }
    });
  }

  // Detail
  openDetail(sujet: SujetPfe): void {
    this.detailSujet = sujet;
    this.showDetail.set(true);
  }

  closeDetail(): void {
    this.showDetail.set(false);
    this.detailSujet = null;
  }

  // Confirm actions
  openConfirm(sujet: SujetPfe, action: 'archiver' | 'desarchiver' | 'fermer'): void {
    this.confirmSujet = sujet;
    this.confirmAction = action;
    this.showConfirm.set(true);
  }

  closeConfirm(): void {
    this.showConfirm.set(false);
    this.confirmSujet = null;
  }

  executeConfirm(): void {
    if (!this.confirmSujet) return;

    const obs =
      this.confirmAction === 'archiver' ? this.sujetService.archiver(this.confirmSujet.id) :
      this.confirmAction === 'desarchiver' ? this.sujetService.desarchiver(this.confirmSujet.id) :
      this.sujetService.fermer(this.confirmSujet.id);

    const labels: Record<string, string> = {
      archiver: 'archivé',
      desarchiver: 'désarchivé',
      fermer: 'fermé'
    };

    obs.subscribe({
      next: () => {
        this.showToast(`Sujet PFE ${labels[this.confirmAction]} avec succès`, 'success');
        this.closeConfirm();
        this.loadSujets();
      },
      error: () => {
        this.showToast('Erreur lors de l\'opération', 'error');
        this.closeConfirm();
      }
    });
  }

  // Helpers
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

  getNiveauLabel(niveau: Niveau): string {
    const labels: Record<string, string> = {
      L3: 'Licence 3',
      M2: 'Master 2',
      CY3: 'Cycle Ingénieur 3'
    };
    return labels[niveau] || niveau;
  }

  getStatutLabel(statut: Statut): string {
    const labels: Record<string, string> = {
      OUVERT: 'Ouvert',
      POURVU: 'Pourvu',
      FERME: 'Fermé'
    };
    return labels[statut] || statut;
  }

  getConfirmTitle(): string {
    const titles: Record<string, string> = {
      archiver: 'Archiver ce sujet ?',
      desarchiver: 'Désarchiver ce sujet ?',
      fermer: 'Fermer ce sujet ?'
    };
    return titles[this.confirmAction];
  }

  getConfirmText(): string {
    const texts: Record<string, string> = {
      archiver: `Le sujet "${this.confirmSujet?.titre}" sera archivé et ne sera plus visible dans la liste active.`,
      desarchiver: `Le sujet "${this.confirmSujet?.titre}" sera désarchivé et redeviendra visible.`,
      fermer: `Le sujet "${this.confirmSujet?.titre}" sera fermé et ne pourra plus recevoir de candidatures.`
    };
    return texts[this.confirmAction];
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    for (let i = start; i < end; i++) {
      pages.push(i);
    }
    return pages;
  }
}
