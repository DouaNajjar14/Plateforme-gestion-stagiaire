import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Specialite, SpecialiteRequest } from '../models/specialite.model';

@Injectable({
    providedIn: 'root'
})
export class SpecialiteService {
    private apiUrl = `${environment.apiUrl}/admin/specialites`;

    constructor(private http: HttpClient) { }

    lister(): Observable<Specialite[]> {
        return this.http.get<Specialite[]>(this.apiUrl);
    }

    listerParDepartement(departementId: string): Observable<Specialite[]> {
        return this.http.get<Specialite[]>(`${this.apiUrl}/departement/${departementId}`);
    }

    trouverParId(id: number): Observable<Specialite> {
        return this.http.get<Specialite>(`${this.apiUrl}/${id}`);
    }

    creer(request: SpecialiteRequest): Observable<Specialite> {
        return this.http.post<Specialite>(this.apiUrl, request);
    }

    modifier(id: number, request: SpecialiteRequest): Observable<Specialite> {
        return this.http.put<Specialite>(`${this.apiUrl}/${id}`, request);
    }

    supprimer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
