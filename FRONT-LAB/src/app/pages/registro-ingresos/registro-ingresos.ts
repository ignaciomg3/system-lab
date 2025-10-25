import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Company {
  id: number | string;
  nombre: string;
  cuit?: string;
  direccion?: string;
}

interface Cotizacion {
  id: number | string;
  referencia?: string; // texto breve para mostrar en select
  empresaId?: number | string;
  fecha?: string;
}

@Component({
  selector: 'app-registro-ingresos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './registro-ingresos.html',
  styleUrls: ['./registro-ingresos.css']
})
export class RegistroIngresos implements OnInit {
  todayString = '';

  request = {
    fecha: '',
    cotizacionId: null as number | string | null,
    empresaId: null as number | string | null,
    tipoMuestra: null as string | null,
    cantidad: null as number | null
  };

  companies: Company[] = [];
  cotizaciones: Cotizacion[] = [];
  sampleTypes: string[] = [];

  loading = false;

  constructor(private http: HttpClient) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    this.todayString = `${y}-${m}-${day}`;
  }

  ngOnInit(): void {
    this.request.fecha = this.todayString;
    this.loadCompanies();
    this.loadSampleTypes();
    this.loadCotizaciones();
  }

  // Carga empresas desde backend; fallback a mock
  loadCompanies() {
    const endpoint = '/api/companies';
    this.http.get<Company[]>(endpoint).pipe(
      catchError(err => {
        console.warn('No se pudieron cargar empresas, usando mock. Error:', err);
        const mock: Company[] = [
          { id: 1, nombre: 'Empresa Alfa', cuit: '30-11111111-1', direccion: 'Calle Falsa 123' },
          { id: 2, nombre: 'Empresa Beta', cuit: '30-22222222-2', direccion: 'Av. Siempre Viva 742' },
          { id: 3, nombre: 'Empresa Gamma', cuit: '30-33333333-3', direccion: 'Ruta 9 km 15' }
        ];
        return of(mock);
      })
    ).subscribe(data => this.companies = data || []);
  }

  // Carga tipos de muestra desde backend; fallback a lista conocida
  loadSampleTypes() {
    const endpoint = '/api/sample-types';
    this.http.get<string[]>(endpoint).pipe(
      catchError(err => {
        console.warn('No se pudieron cargar tipos de muestra, usando fallback. Error:', err);
        return of([
          'Agua',
          'Efluente',
          'Industrial',
          'Bromatologico',
          'Microbiologico',
          'Barro',
          'Aire',
          'Suelo',
          'Otro'
        ]);
      })
    ).subscribe(data => this.sampleTypes = data || []);
  }

  // Carga cotizaciones desde backend; fallback a mock
  loadCotizaciones() {
    const endpoint = '/api/cotizaciones';
    this.http.get<Cotizacion[]>(endpoint).pipe(
      catchError(err => {
        console.warn('No se pudieron cargar cotizaciones, usando mock. Error:', err);
        const mock: Cotizacion[] = [
          { id: 101, referencia: 'Cotización 101 - Muestras agua', empresaId: 1, fecha: this.todayString },
          { id: 102, referencia: 'Cotización 102 - Efluentes', empresaId: 2, fecha: this.todayString },
          { id: 103, referencia: 'Cotización 103 - Industrial', empresaId: 3, fecha: this.todayString }
        ];
        return of(mock);
      })
    ).subscribe(data => this.cotizaciones = data || []);
  }

  // Cuando se selecciona una cotización, si trae empresaId, seteamos la empresa
  onCotizacionChange() {
    const sel = this.cotizaciones.find(c => c.id === this.request.cotizacionId || String(c.id) === String(this.request.cotizacionId));
    if (sel && sel.empresaId != null) {
      this.request.empresaId = sel.empresaId;
    }
  }

  // Guardar ingreso — POST al backend
  saveIngreso() {
    // Validaciones
    if (!this.request.cotizacionId) {
      alert('Seleccione una cotización (ID) relacionada.');
      return;
    }
    if (!this.request.empresaId) {
      alert('Seleccione la empresa.');
      return;
    }
    if (!this.request.tipoMuestra) {
      alert('Seleccione el tipo de muestra.');
      return;
    }
    if (this.request.cantidad == null || this.request.cantidad <= 0) {
      alert('Ingrese una cantidad válida mayor que 0.');
      return;
    }

    const payload = {
      fecha: this.request.fecha,
      cotizacionId: this.request.cotizacionId,
      empresaId: this.request.empresaId,
      tipoMuestra: this.request.tipoMuestra,
      cantidad: this.request.cantidad
    };

    const endpoint = '/api/ingresos';

    this.loading = true;
    this.http.post(endpoint, payload).pipe(
      catchError(err => {
        // En caso de error, log y devolver un observable de fallo simulado
        console.error('Fallo envío de ingreso:', err);
        // Si preferís manejar errores en UI, retorná throwError(err)
        return of({ success: false, message: 'No se pudo conectar con el servidor (mock fallback).' });
      })
    ).subscribe((resp: any) => {
      this.loading = false;
      if (resp && resp.success === false) {
        alert('Error al guardar: ' + (resp.message || 'Error desconocido'));
      } else {
        alert('Ingreso guardado correctamente.');
        // Reset parcial (dejamos fecha fija)
        this.request.cotizacionId = null;
        this.request.empresaId = null;
        this.request.tipoMuestra = null;
        this.request.cantidad = null;
        // Refrescar listados si hace falta
        this.loadCotizaciones();
      }
    });
  }
}
