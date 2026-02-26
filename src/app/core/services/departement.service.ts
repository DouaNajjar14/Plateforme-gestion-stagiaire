import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Departement, DepartementRequest } from '../models/departement.model';

@Injectable({
  providedIn: 'root'
})
export class DepartementService {
  private readonly API_URL = `${environment.apiUrl}/admin/departements`;

  constructor(private http: HttpClient) {}

  creer(request: DepartementRequest): Observable<Departement> {
    return this.http.post<Departement>(this.API_URL, request);
  }

  modifier(id: string, request: DepartementRequest): Observable<Departement> {
    return this.http.put<Departement>(`${this.API_URL}/${id}`, request);
  }

  archiver(id: string): Observable<Departement> {
    return this.http.patch<Departement>(`${this.API_URL}/${id}/archiver`, {});
  }

  desarchiver(id: string): Observable<Departement> {
    return this.http.patch<Departement>(`${this.API_URL}/${id}/desarchiver`, {});
  }

  listerActifs(): Observable<Departement[]> {
    return this.http.get<Departement[]>(this.API_URL);
  }

  listerArchives(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.API_URL}/archives`);
  }

  listerTous(): Observable<Departement[]> {
    return this.http.get<Departement[]>(`${this.API_URL}/tous`);
  }

  trouverParId(id: string): Observable<Departement> {
    return this.http.get<Departement>(`${this.API_URL}/${id}`);
  }
}
