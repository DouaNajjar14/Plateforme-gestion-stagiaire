export interface AgentRH {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  actif: boolean;
  dateCreation: string;
  dateModification: string;
}

export interface AgentRHRequest {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
  motDePasse: string;
}

export interface AgentRHUpdateRequest {
  nom: string;
  prenom: string;
  email: string;
  tel: string;
}
