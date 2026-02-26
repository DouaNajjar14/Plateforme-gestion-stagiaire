import { Competence } from './competence.model';

export interface Encadrant {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    specialiteId: number;
    specialiteNom: string;
    capaciteMax: number;
    capaciteActuelle: number;
    competences: Competence[];
    actif: boolean;
    dateCreation: string;
    dateModification: string;
    departementId: string;
    departementNom: string;
}

export interface EncadrantRequest {
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    motDePasse: string;
    specialiteId: number;
    capaciteMax: number;
    competenceIds: number[];
    departementId: string;
}

export interface EncadrantUpdateRequest {
    nom: string;
    prenom: string;
    email: string;
    tel: string;
    specialiteId: number;
    capaciteMax: number;
    competenceIds: number[];
    departementId: string;
}
