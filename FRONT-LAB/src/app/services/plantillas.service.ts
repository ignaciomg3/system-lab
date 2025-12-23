import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Parametro {
    nombre: string;
    unidad: string;
    tipo: string;
    _id?: string;
}

export interface Plantilla {
    _id?: string;
    nombre: string;
    solicitante: string;
    parametros: Parametro[];
}

export interface PlantillasResponse {
    success: boolean;
    count?: number;
    data: Plantilla[];
}

export interface PlantillaResponse {
    success: boolean;
    message?: string;
    data: Plantilla;
}

@Injectable({
    providedIn: 'root'
})
export class PlantillasService {
    private apiUrl = 'http://localhost:3000/api/plantillas';

    constructor(private http: HttpClient) { }

    // GET - Obtener todas las plantillas
    getPlantillas(): Observable<PlantillasResponse> {
        return this.http.get<PlantillasResponse>(this.apiUrl);
    }

    // GET - Buscar plantillas por término
    searchPlantillas(termino: string): Observable<PlantillasResponse> {
        return this.http.get<PlantillasResponse>(`${this.apiUrl}/buscar/${termino}`);
    }

    // GET - Obtener plantilla por nombre
    getPlantillaByNombre(nombre: string): Observable<PlantillaResponse> {
        return this.http.get<PlantillaResponse>(`${this.apiUrl}/nombre/${nombre}`);
    }

    // POST - Crear nueva plantilla
    createPlantilla(plantilla: Plantilla): Observable<PlantillaResponse> {
        return this.http.post<PlantillaResponse>(this.apiUrl, plantilla);
    }

    // PUT - Actualizar plantilla por nombre
    updatePlantilla(nombreOriginal: string, plantilla: Plantilla): Observable<PlantillaResponse> {
        return this.http.put<PlantillaResponse>(`${this.apiUrl}/${nombreOriginal}`, plantilla);
    }

    // DELETE - Eliminar plantilla por nombre
    deletePlantilla(nombre: string): Observable<{ success: boolean; message: string }> {
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${nombre}`);
    }
}
