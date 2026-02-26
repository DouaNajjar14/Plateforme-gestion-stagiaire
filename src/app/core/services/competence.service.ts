import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Competence, CompetenceRequest } from '../models/competence.model';

@Injectable({
    providedIn: 'root'
})
export class CompetenceService {
    private apiUrl = `${environment.apiUrl}/admin/competences`;

    constructor(private http: HttpClient) { }

    lister(): Observable<Competence[]> {
        return this.http.get<Competence[]>(this.apiUrl);
    }

    trouverParId(id: number): Observable<Competence> {
        return this.http.get<Competence>(`${this.apiUrl}/${id}`);
    }

    creer(request: CompetenceRequest): Observable<Competence> {
        return this.http.post<Competence>(this.apiUrl, request);
    }

    modifier(id: number, request: CompetenceRequest): Observable<Competence> {
        return this.http.put<Competence>(`${this.apiUrl}/${id}`, request);
    }

    supprimer(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
