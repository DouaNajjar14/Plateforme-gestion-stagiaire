export interface LoginRequest {
  email: string;
  motDePasse: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  AGENT_RH = 'AGENT_RH',
  ENCADRANT = 'ENCADRANT',
  STAGIAIRE = 'STAGIAIRE'
}
