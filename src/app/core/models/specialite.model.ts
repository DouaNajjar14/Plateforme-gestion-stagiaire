import { Competence } from './competence.model';

export interface Specialite {
    id: number;
    nom: string;
    departementId: string;
    departementNom: string;
    competences: Competence[];
}

export interface SpecialiteRequest {
    nom: string;
    departementId: string;
    competenceIds: number[];
}
