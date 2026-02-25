export interface SujetPfe {
  id: string;
  titre: string;
  mission: string;
  specialite: string;
  competencesRequises: string;
  nombreStagiaires: number;
  niveauAcademique: Niveau;
  dureeEnMois: number;
  statut: Statut;
  archive: boolean;
  departementId: string;
  departementNom: string;
  dateCreation: string;
  dateModification: string;
}

export interface SujetPfeRequest {
  titre: string;
  mission: string;
  specialite: string;
  competencesRequises: string;
  nombreStagiaires: number;
  niveauAcademique: Niveau;
  dureeEnMois: number;
  departementId: string;
}

export enum Niveau {
  L3 = 'L3',
  M2 = 'M2',
  CY3 = 'CY3'
}

export enum Statut {
  OUVERT = 'OUVERT',
  POURVU = 'POURVU',
  FERME = 'FERME'
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
