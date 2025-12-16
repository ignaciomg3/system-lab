import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Parametro {
    _id?: string;
    nombre: string;
    unidad: string;
    tipo: string;
}

@Injectable({
    providedIn: 'root'
})
export class ParametrosService {
    private apiUrl = 'http://localhost:3000/api/parametros';

    constructor(private http: HttpClient) { }

    getParametros(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    createParametro(parametro: Parametro): Observable<any> {
        return this.http.post<any>(this.apiUrl, parametro);
    }

    updateParametro(nombreOriginal: string, parametro: Parametro): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${nombreOriginal}`, parametro);
    }

    deleteParametro(nombre: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${nombre}`);
    }
}
