import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Elemento {
    _id?: string;
    nombre: string;
    descripcion: string;
}

@Injectable({
    providedIn: 'root'
})
export class ElementosService {
    private apiUrl = 'http://localhost:3000/api/elementos';

    constructor(private http: HttpClient) { }

    getElementos(): Observable<any> {
        return this.http.get<any>(this.apiUrl);
    }

    getElemento(nombre: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${nombre}`);
    }

    createElemento(elemento: Elemento): Observable<any> {
        return this.http.post<any>(this.apiUrl, elemento);
    }

    updateElemento(nombreOriginal: string, elemento: Elemento): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${nombreOriginal}`, elemento);
    }

    deleteElemento(nombre: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${nombre}`);
    }
}
