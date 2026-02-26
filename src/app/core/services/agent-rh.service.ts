import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AgentRH, AgentRHRequest, AgentRHUpdateRequest } from '../models/agent-rh.model';

@Injectable({
  providedIn: 'root'
})
export class AgentRHService {
  private readonly API_URL = `${environment.apiUrl}/admin/agents-rh`;

  constructor(private http: HttpClient) {}

  creer(request: AgentRHRequest): Observable<AgentRH> {
    return this.http.post<AgentRH>(this.API_URL, request);
  }

  modifier(id: string, request: AgentRHUpdateRequest): Observable<AgentRH> {
    return this.http.put<AgentRH>(`${this.API_URL}/${id}`, request);
  }

  archiver(id: string): Observable<AgentRH> {
    return this.http.patch<AgentRH>(`${this.API_URL}/${id}/archiver`, {});
  }

  desarchiver(id: string): Observable<AgentRH> {
    return this.http.patch<AgentRH>(`${this.API_URL}/${id}/desarchiver`, {});
  }

  listerActifs(): Observable<AgentRH[]> {
    return this.http.get<AgentRH[]>(this.API_URL);
  }

  listerArchives(): Observable<AgentRH[]> {
    return this.http.get<AgentRH[]>(`${this.API_URL}/archives`);
  }

  listerTous(): Observable<AgentRH[]> {
    return this.http.get<AgentRH[]>(`${this.API_URL}/tous`);
  }

  trouverParId(id: string): Observable<AgentRH> {
    return this.http.get<AgentRH>(`${this.API_URL}/${id}`);
  }
}
