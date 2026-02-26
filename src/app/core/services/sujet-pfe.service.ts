import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SujetPfe, SujetPfeRequest, Page, Statut } from '../models/sujet-pfe.model';

@Injectable({
  providedIn: 'root'
})
export class SujetPfeService {
  private readonly API_URL = `${environment.apiUrl}/sujets-pfe`;

  constructor(private http: HttpClient) {}

  creer(request: SujetPfeRequest): Observable<SujetPfe> {
    return this.http.post<SujetPfe>(this.API_URL, request);
  }

  modifier(id: string, request: SujetPfeRequest): Observable<SujetPfe> {
    return this.http.put<SujetPfe>(`${this.API_URL}/${id}`, request);
  }

  fermer(id: string): Observable<SujetPfe> {
    return this.http.patch<SujetPfe>(`${this.API_URL}/${id}/fermer`, {});
  }

  archiver(id: string): Observable<SujetPfe> {
    return this.http.patch<SujetPfe>(`${this.API_URL}/${id}/archiver`, {});
  }

  desarchiver(id: string): Observable<SujetPfe> {
    return this.http.patch<SujetPfe>(`${this.API_URL}/${id}/desarchiver`, {});
  }

  listerActifs(page: number = 0, size: number = 10): Observable<Page<SujetPfe>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<SujetPfe>>(this.API_URL, { params });
  }

  listerArchives(page: number = 0, size: number = 10): Observable<Page<SujetPfe>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<SujetPfe>>(`${this.API_URL}/archives`, { params });
  }

  listerTous(page: number = 0, size: number = 10): Observable<Page<SujetPfe>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<Page<SujetPfe>>(`${this.API_URL}/tous`, { params });
  }

  rechercher(
    statut?: Statut,
    departementId?: string,
    titre?: string,
    page: number = 0,
    size: number = 10
  ): Observable<Page<SujetPfe>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (statut) params = params.set('statut', statut);
    if (departementId) params = params.set('departementId', departementId);
    if (titre) params = params.set('titre', titre);

    return this.http.get<Page<SujetPfe>>(`${this.API_URL}/recherche`, { params });
  }

  trouverParId(id: string): Observable<SujetPfe> {
    return this.http.get<SujetPfe>(`${this.API_URL}/${id}`);
  }
}
