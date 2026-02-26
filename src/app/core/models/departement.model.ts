export interface Departement {
  id: string;
  nom: string;
  responsable?: string;
  nombreEncadrantsActuel: number;
  nombreStagiairesActuel: number;
  archive: boolean;
}

export interface DepartementRequest {
  nom: string;
  responsable?: string;
}
