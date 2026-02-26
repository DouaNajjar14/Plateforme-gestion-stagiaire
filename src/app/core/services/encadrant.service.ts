import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Encadrant, EncadrantRequest, EncadrantUpdateRequest } from '../models/encadrant.model';

@Injectable({
    providedIn: 'root'
})
export class EncadrantService {
    private readonly API_URL = `${environment.apiUrl}/admin/encadrants`;

    constructor(private http: HttpClient) { }

    creer(request: EncadrantRequest): Observable<Encadrant> {
        return this.http.post<Encadrant>(this.API_URL, request);
    }

    modifier(id: string, request: EncadrantUpdateRequest): Observable<Encadrant> {
        return this.http.put<Encadrant>(`${this.API_URL}/${id}`, request);
    }

    archiver(id: string): Observable<Encadrant> {
        return this.http.patch<Encadrant>(`${this.API_URL}/${id}/archiver`, {});
    }

    desarchiver(id: string): Observable<Encadrant> {
        return this.http.patch<Encadrant>(`${this.API_URL}/${id}/desarchiver`, {});
    }

    listerActifs(): Observable<Encadrant[]> {
        return this.http.get<Encadrant[]>(this.API_URL);
    }

    listerArchives(): Observable<Encadrant[]> {
        return this.http.get<Encadrant[]>(`${this.API_URL}/archives`);
    }

    listerTous(): Observable<Encadrant[]> {
        return this.http.get<Encadrant[]>(`${this.API_URL}/tous`);
    }

    listerDisponibles(): Observable<Encadrant[]> {
        return this.http.get<Encadrant[]>(`${this.API_URL}/disponibles`);
    }

    trouverParId(id: string): Observable<Encadrant> {
        return this.http.get<Encadrant>(`${this.API_URL}/${id}`);
    }
}
