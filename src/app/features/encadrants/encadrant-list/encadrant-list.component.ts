import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncadrantService } from '../../../core/services/encadrant.service';
import { DepartementService } from '../../../core/services/departement.service';
import { SpecialiteService } from '../../../core/services/specialite.service';
import { CompetenceService } from '../../../core/services/competence.service';
import { Encadrant, EncadrantRequest, EncadrantUpdateRequest } from '../../../core/models/encadrant.model';
import { Departement } from '../../../core/models/departement.model';
import { Specialite } from '../../../core/models/specialite.model';
import { Competence } from '../../../core/models/competence.model';

@Component({
    selector: 'app-encadrant-list',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './encadrant-list.component.html',
    styleUrls: ['./encadrant-list.component.css']
})
export class EncadrantListComponent implements OnInit {
    encadrants = signal<Encadrant[]>([]);
    filteredEncadrants = signal<Encadrant[]>([]);
    departements = signal<Departement[]>([]);
    specialites = signal<Specialite[]>([]);
    filteredSpecialites = signal<Specialite[]>([]);
    competences = signal<Competence[]>([]);
    filteredCompetences = signal<Competence[]>([]);
    isLoading = signal(false);
    searchTerm = '';
    activeFilter: 'actifs' | 'archives' | 'tous' = 'actifs';

    // Filtres
    filterDepartementId: string = '';
    filterSpecialiteId: string = '';
    filterSpecialiteOptions = signal<Specialite[]>([]);

    // Modal
    showModal = signal(false);
    showConfirm = signal(false);
    showDetail = signal(false);
    modalMode: 'create' | 'edit' = 'create';
    editingEncadrant: Encadrant | null = null;
    selectedEncadrant: Encadrant | null = null;
    modalError = signal<string | null>(null);
    isSaving = signal(false);
    confirmEncadrant: Encadrant | null = null;
    showPassword = false;

    // Form fields
    formNom = '';
    formPrenom = '';
    formEmail = '';
    formTel = '';
    formMotDePasse = '';
    formSpecialiteId: number | null = null;
    formCapaciteMax = 5;
    formCompetenceIds: number[] = [];
    formDepartementId = '';

    // Toast
    toastMessage = signal<string | null>(null);
    toastType = signal<'success' | 'error'>('success');

    constructor(
        private encadrantService: EncadrantService,
        private departementService: DepartementService,
        private specialiteService: SpecialiteService,
        private competenceService: CompetenceService
    ) { }

    ngOnInit(): void {
        this.loadEncadrants();
        this.loadDepartements();
        this.loadSpecialites();
        this.loadCompetences();
    }

    loadDepartements(): void {
        this.departementService.listerActifs().subscribe({
            next: (data) => this.departements.set(data),
            error: () => this.showToast('Erreur lors du chargement des départements', 'error')
        });
    }

    loadSpecialites(): void {
        this.specialiteService.lister().subscribe({
            next: (data) => {
                this.specialites.set(data);
                this.filterSpecialiteOptions.set(data);
            },
            error: () => this.showToast('Erreur lors du chargement des spécialités', 'error')
        });
    }

    loadCompetences(): void {
        this.competenceService.lister().subscribe({
            next: (data) => this.competences.set(data),
            error: () => this.showToast('Erreur lors du chargement des compétences', 'error')
        });
    }

    onDepartementChange(): void {
        if (this.formDepartementId) {
            this.filteredSpecialites.set(
                this.specialites().filter(s => s.departementId === this.formDepartementId)
            );
            // Reset specialite if not in filtered list
            if (this.formSpecialiteId && !this.filteredSpecialites().find(s => s.id === this.formSpecialiteId)) {
                this.formSpecialiteId = null;
                this.filteredCompetences.set([]);
                this.formCompetenceIds = [];
            }
        } else {
            this.filteredSpecialites.set([]);
            this.formSpecialiteId = null;
            this.filteredCompetences.set([]);
            this.formCompetenceIds = [];
        }
    }

    onSpecialiteChange(): void {
        if (this.formSpecialiteId) {
            const selectedSpecialite = this.filteredSpecialites().find(s => s.id === this.formSpecialiteId);
            if (selectedSpecialite && selectedSpecialite.competences) {
                this.filteredCompetences.set(selectedSpecialite.competences);
            } else {
                this.filteredCompetences.set([]);
            }
            // Reset competence selection if not in the new list
            this.formCompetenceIds = this.formCompetenceIds.filter(id =>
                this.filteredCompetences().some(c => c.id === id)
            );
        } else {
            this.filteredCompetences.set([]);
            this.formCompetenceIds = [];
        }
    }

    toggleCompetence(competenceId: number): void {
        const index = this.formCompetenceIds.indexOf(competenceId);
        if (index === -1) {
            this.formCompetenceIds = [...this.formCompetenceIds, competenceId];
        } else {
            this.formCompetenceIds = this.formCompetenceIds.filter(id => id !== competenceId);
        }
    }

    isCompetenceSelected(competenceId: number): boolean {
        return this.formCompetenceIds.includes(competenceId);
    }

    loadEncadrants(): void {
        this.isLoading.set(true);
        const obs =
            this.activeFilter === 'actifs' ? this.encadrantService.listerActifs() :
                this.activeFilter === 'archives' ? this.encadrantService.listerArchives() :
                    this.encadrantService.listerTous();

        obs.subscribe({
            next: (data) => {
                this.encadrants.set(data);
                this.applyFilter();
                this.isLoading.set(false);
            },
            error: () => {
                this.showToast('Erreur lors du chargement des encadrants', 'error');
                this.isLoading.set(false);
            }
        });
    }

    applyFilter(): void {
        const term = this.searchTerm.toLowerCase().trim();
        let filtered = this.encadrants().filter(e =>
            e.nom.toLowerCase().includes(term) ||
            e.prenom.toLowerCase().includes(term) ||
            e.email.toLowerCase().includes(term) ||
            (e.specialiteNom && e.specialiteNom.toLowerCase().includes(term))
        );

        // Filtre par département
        if (this.filterDepartementId) {
            filtered = filtered.filter(e => e.departementId?.toString() === this.filterDepartementId);
        }

        // Filtre par spécialité
        if (this.filterSpecialiteId) {
            filtered = filtered.filter(e => e.specialiteId?.toString() === this.filterSpecialiteId);
        }

        this.filteredEncadrants.set(filtered);
    }

    onFilterDepartementChange(): void {
        if (this.filterDepartementId) {
            this.filterSpecialiteOptions.set(
                this.specialites().filter(s => s.departementId === this.filterDepartementId)
            );
            // Reset specialité filter si elle n'est plus dans la liste
            if (this.filterSpecialiteId && !this.filterSpecialiteOptions().find(s => s.id?.toString() === this.filterSpecialiteId)) {
                this.filterSpecialiteId = '';
            }
        } else {
            this.filterSpecialiteOptions.set(this.specialites());
            this.filterSpecialiteId = '';
        }
        this.applyFilter();
    }

    onFilterSpecialiteChange(): void {
        this.applyFilter();
    }

    clearFilters(): void {
        this.searchTerm = '';
        this.filterDepartementId = '';
        this.filterSpecialiteId = '';
        this.filterSpecialiteOptions.set(this.specialites());
        this.applyFilter();
    }

    onSearchChange(): void {
        this.applyFilter();
    }

    setFilter(filter: 'actifs' | 'archives' | 'tous'): void {
        this.activeFilter = filter;
        this.loadEncadrants();
    }

    openCreateModal(): void {
        this.modalMode = 'create';
        this.resetForm();
        this.editingEncadrant = null;
        this.modalError.set(null);
        this.showModal.set(true);
    }

    openEditModal(encadrant: Encadrant): void {
        this.modalMode = 'edit';
        this.formNom = encadrant.nom;
        this.formPrenom = encadrant.prenom;
        this.formEmail = encadrant.email;
        this.formTel = encadrant.tel || '';
        this.formDepartementId = encadrant.departementId || '';
        this.onDepartementChange();
        this.formSpecialiteId = encadrant.specialiteId || null;
        this.onSpecialiteChange();
        this.formCapaciteMax = encadrant.capaciteMax;
        this.formCompetenceIds = encadrant.competences ? encadrant.competences.map(c => c.id) : [];
        this.formMotDePasse = '';
        this.editingEncadrant = encadrant;
        this.modalError.set(null);
        this.showModal.set(true);
    }

    closeModal(): void {
        this.showModal.set(false);
        this.resetForm();
        this.editingEncadrant = null;
        this.modalError.set(null);
    }

    resetForm(): void {
        this.formNom = '';
        this.formPrenom = '';
        this.formEmail = '';
        this.formTel = '';
        this.formMotDePasse = '';
        this.formSpecialiteId = null;
        this.formCapaciteMax = 5;
        this.formCompetenceIds = [];
        this.formDepartementId = '';
        this.filteredSpecialites.set([]);
        this.filteredCompetences.set([]);
        this.showPassword = false;
    }

    saveModal(): void {
        // Validation des champs obligatoires
        if (!this.formNom.trim() || !this.formPrenom.trim() || !this.formEmail.trim() || !this.formSpecialiteId || !this.formDepartementId) {
            this.modalError.set('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Validation du nom (lettres, espaces, tirets uniquement, min 2 caractères)
        const nomRegex = /^[a-zA-ZÀ-ÿ\s\-']{2,50}$/;
        if (!nomRegex.test(this.formNom.trim())) {
            this.modalError.set('Le nom doit contenir uniquement des lettres (2-50 caractères)');
            return;
        }

        // Validation du prénom (lettres, espaces, tirets uniquement, min 2 caractères)
        if (!nomRegex.test(this.formPrenom.trim())) {
            this.modalError.set('Le prénom doit contenir uniquement des lettres (2-50 caractères)');
            return;
        }

        // Validation email @ooredoo.tn
        const emailRegex = /^[a-zA-Z0-9._%+-]+@ooredoo\.tn$/i;
        if (!emailRegex.test(this.formEmail.trim())) {
            this.modalError.set('L\'email doit être au format xxx@ooredoo.tn');
            return;
        }

        // Validation téléphone tunisien (optionnel mais si renseigné, doit être valide)
        if (this.formTel.trim()) {
            const telClean = this.formTel.replace(/[\s\-\.]/g, '');
            const telRegex = /^(\+216|216)?[2459]\d{7}$/;
            if (!telRegex.test(telClean)) {
                this.modalError.set('Le téléphone doit être un numéro tunisien valide (ex: +216 XX XXX XXX)');
                return;
            }
        }

        if (this.formCapaciteMax < 1) {
            this.modalError.set('La capacité maximale doit être au moins 1');
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
            const request: EncadrantRequest = {
                nom: this.formNom.trim(),
                prenom: this.formPrenom.trim(),
                email: this.formEmail.trim(),
                tel: this.formTel.trim(),
                motDePasse: this.formMotDePasse,
                specialiteId: this.formSpecialiteId!,
                capaciteMax: this.formCapaciteMax,
                competenceIds: this.formCompetenceIds,
                departementId: this.formDepartementId
            };
            this.encadrantService.creer(request).subscribe({
                next: () => {
                    this.showToast('Encadrant créé avec succès', 'success');
                    this.closeModal();
                    this.loadEncadrants();
                    this.isSaving.set(false);
                },
                error: (err) => {
                    console.error('Erreur création encadrant:', err);
                    const errorMsg = err.error?.message || err.error?.errors?.join(', ') || JSON.stringify(err.error) || 'Erreur lors de la création';
                    this.modalError.set(errorMsg);
                    this.isSaving.set(false);
                }
            });
        } else {
            const request: EncadrantUpdateRequest = {
                nom: this.formNom.trim(),
                prenom: this.formPrenom.trim(),
                email: this.formEmail.trim(),
                tel: this.formTel.trim(),
                specialiteId: this.formSpecialiteId!,
                capaciteMax: this.formCapaciteMax,
                competenceIds: this.formCompetenceIds,
                departementId: this.formDepartementId
            };
            this.encadrantService.modifier(this.editingEncadrant!.id, request).subscribe({
                next: () => {
                    this.showToast('Encadrant modifié avec succès', 'success');
                    this.closeModal();
                    this.loadEncadrants();
                    this.isSaving.set(false);
                },
                error: (err) => {
                    this.modalError.set(err.error?.message || 'Erreur lors de la modification');
                    this.isSaving.set(false);
                }
            });
        }
    }

    // Detail view
    openDetailModal(encadrant: Encadrant): void {
        this.selectedEncadrant = encadrant;
        this.showDetail.set(true);
    }

    closeDetailModal(): void {
        this.showDetail.set(false);
        this.selectedEncadrant = null;
    }

    editFromDetail(): void {
        if (this.selectedEncadrant) {
            const encadrant = this.selectedEncadrant;
            this.closeDetailModal();
            this.openEditModal(encadrant);
        }
    }

    // Archive/Unarchive
    openArchiveConfirm(encadrant: Encadrant): void {
        this.confirmEncadrant = encadrant;
        this.showConfirm.set(true);
    }

    closeConfirm(): void {
        this.showConfirm.set(false);
        this.confirmEncadrant = null;
    }

    confirmArchive(): void {
        if (!this.confirmEncadrant) return;

        const action = this.confirmEncadrant.actif
            ? this.encadrantService.archiver(this.confirmEncadrant.id)
            : this.encadrantService.desarchiver(this.confirmEncadrant.id);

        const label = this.confirmEncadrant.actif ? 'archivé' : 'désarchivé';

        action.subscribe({
            next: () => {
                this.showToast(`Encadrant ${label} avec succès`, 'success');
                this.closeConfirm();
                this.loadEncadrants();
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
        return this.encadrants().filter(e => e.actif).length;
    }

    get archivedCount(): number {
        return this.encadrants().filter(e => !e.actif).length;
    }

    get totalCapacity(): number {
        return this.encadrants().filter(e => e.actif).reduce((sum, e) => sum + e.capaciteMax, 0);
    }

    get usedCapacity(): number {
        return this.encadrants().filter(e => e.actif).reduce((sum, e) => sum + e.capaciteActuelle, 0);
    }

    getCapacityPercentage(encadrant: Encadrant): number {
        if (encadrant.capaciteMax === 0) return 0;
        return Math.round((encadrant.capaciteActuelle / encadrant.capaciteMax) * 100);
    }

    getCapacityColor(encadrant: Encadrant): string {
        const pct = this.getCapacityPercentage(encadrant);
        if (pct >= 100) return 'bg-red-500';
        if (pct >= 75) return 'bg-amber-500';
        return 'bg-emerald-500';
    }
}
