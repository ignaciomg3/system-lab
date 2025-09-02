import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PullRequestInDatabaseService {
  private apiUrl = 'http://localhost:3000/api/solicitudes'; // Cambia la URL según tu backend

  constructor(private http: HttpClient) {}

  searchRequest(criteria: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?q=${encodeURIComponent(criteria)}`);
  }
}