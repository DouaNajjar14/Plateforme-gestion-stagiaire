import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DepartementService } from '../../../core/services/departement.service';
import { Departement } from '../../../core/models/departement.model';

@Component({
  selector: 'app-departement-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './departement-list.component.html',
  styleUrls: ['./departement-list.component.css']
})
export class DepartementListComponent implements OnInit {
  departements = signal<Departement[]>([]);
  filteredDepartements = signal<Departement[]>([]);
  isLoading = signal(false);
  searchTerm = '';
  activeFilter: 'actifs' | 'archives' | 'tous' = 'actifs';

  // Modal state
  showModal = signal(false);
  showDeleteConfirm = signal(false);
  modalMode: 'create' | 'edit' = 'create';
  editingDepartement: Departement | null = null;
  departementNom = '';
  modalError = signal<string | null>(null);
  isSaving = signal(false);
  deletingDepartement: Departement | null = null;

  // Toast
  toastMessage = signal<string | null>(null);
  toastType = signal<'success' | 'error'>('success');

  constructor(private departementService: DepartementService) {}

  ngOnInit(): void {
    this.loadDepartements();
  }

  loadDepartements(): void {
    this.isLoading.set(true);
    const obs =
      this.activeFilter === 'actifs' ? this.departementService.listerActifs() :
      this.activeFilter === 'archives' ? this.departementService.listerArchives() :
      this.departementService.listerTous();

    obs.subscribe({
      next: (data) => {
        this.departements.set(data);
        this.applyFilter();
        this.isLoading.set(false);
      },
      error: () => {
        this.showToast('Erreur lors du chargement des départements', 'error');
        this.isLoading.set(false);
      }
    });
  }

  applyFilter(): void {
    const term = this.searchTerm.toLowerCase().trim();
    const filtered = this.departements().filter(d =>
      d.nom.toLowerCase().includes(term)
    );
    this.filteredDepartements.set(filtered);
  }

  onSearchChange(): void {
    this.applyFilter();
  }

  setFilter(filter: 'actifs' | 'archives' | 'tous'): void {
    this.activeFilter = filter;
    this.loadDepartements();
  }

  // Modal operations
  openCreateModal(): void {
    this.modalMode = 'create';
    this.departementNom = '';
    this.editingDepartement = null;
    this.modalError.set(null);
    this.showModal.set(true);
  }

  openEditModal(dept: Departement): void {
    this.modalMode = 'edit';
    this.departementNom = dept.nom;
    this.editingDepartement = dept;
    this.modalError.set(null);
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
    this.departementNom = '';
    this.editingDepartement = null;
    this.modalError.set(null);
  }

  saveModal(): void {
    if (!this.departementNom.trim()) {
      this.modalError.set('Le nom du département est obligatoire');
      return;
    }

    this.isSaving.set(true);
    this.modalError.set(null);

    if (this.modalMode === 'create') {
      this.departementService.creer({ nom: this.departementNom.trim() }).subscribe({
        next: () => {
          this.showToast('Département créé avec succès', 'success');
          this.closeModal();
          this.loadDepartements();
          this.isSaving.set(false);
        },
        error: (err) => {
          this.modalError.set(err.error?.message || 'Erreur lors de la création');
          this.isSaving.set(false);
        }
      });
    } else {
      this.departementService.modifier(this.editingDepartement!.id, { nom: this.departementNom.trim() }).subscribe({
        next: () => {
          this.showToast('Département modifié avec succès', 'success');
          this.closeModal();
          this.loadDepartements();
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
  openArchiveConfirm(dept: Departement): void {
    this.deletingDepartement = dept;
    this.showDeleteConfirm.set(true);
  }

  closeDeleteConfirm(): void {
    this.showDeleteConfirm.set(false);
    this.deletingDepartement = null;
  }

  confirmArchive(): void {
    if (!this.deletingDepartement) return;

    const action = this.deletingDepartement.archive
      ? this.departementService.desarchiver(this.deletingDepartement.id)
      : this.departementService.archiver(this.deletingDepartement.id);

    const actionLabel = this.deletingDepartement.archive ? 'désarchivé' : 'archivé';

    action.subscribe({
      next: () => {
        this.showToast(`Département ${actionLabel} avec succès`, 'success');
        this.closeDeleteConfirm();
        this.loadDepartements();
      },
      error: () => {
        this.showToast(`Erreur lors de l'archivage`, 'error');
        this.closeDeleteConfirm();
      }
    });
  }

  // Toast
  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage.set(message);
    this.toastType.set(type);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }

  get activeDeptCount(): number {
    return this.departements().filter(d => !d.archive).length;
  }

  get archivedDeptCount(): number {
    return this.departements().filter(d => d.archive).length;
  }
}
