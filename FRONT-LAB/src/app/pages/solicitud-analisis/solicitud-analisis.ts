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

interface Ingreso {
  id: number | string;
  fecha: string; // yyyy-mm-dd
  empresaId?: number | string;
  tipoMuestra?: string;
  cantidad?: number;
}

interface Sample {
  tipo: string | null;
  analisisSeleccionados: string[];
}

@Component({
  selector: 'app-solicitud-analisis',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './solicitud-analisis.html',
  styleUrls: ['./solicitud-analisis.css'],
})
export class SolicitudAnalisis implements OnInit {
  todayString = '';
  defaultInformeString = '';

  // Form model
  solicitud = {
    ingresoId: null as number | string | null,       // ID generado en Registro de Ingresos
    empresaId: null as number | string | null,       // Nombre del solicitante (empresa)
    cuit: '',
    responsable: '',
    fechaRecepcion: '',                               // fecha fija del ingreso (readonly)
    extraidaPor: 'CI',                                // 'CI' | 'Solicitante'
    fechaPrevistaInforme: '' as string,               // editable (por defecto hoy + 17 días)
    muestras: [] as Sample[]
  };

  companies: Company[] = [];
  ingresos: Ingreso[] = [];
  sampleTypes: string[] = [];

  analysesMap: { [tipo: string]: string[] } = {
    Agua: ['pH', 'Conductividad', 'Sólidos totales', 'Cloruros', 'Oxígeno disuelto', 'Fósforo', 'Nitrógeno'],
    Efluente: ['pH', 'DBO', 'DQO', 'Sólidos en suspensión', 'Aceites y grasas', 'Nutrientes (N,P)'],
    Industrial: ['Metales pesados', 'pH', 'Aceites y grasas', 'Toxicidad aguda'],
    Bromatologico: ['Coliformes totales', 'E. coli', 'Salmonella', 'Clostridium'],
    Microbiologico: ['Recuento total', 'Coliformes', 'E. coli', 'Hongos y levaduras'],
    Barro: ['Metales', 'pH', 'Materia orgánica', 'Textura'],
    Aire: ['Partículas PM10', 'Partículas PM2.5', 'Compuestos orgánicos volátiles', 'NOx', 'SO2'],
    Suelo: ['pH', 'Materia orgánica', 'Metales pesados', 'Fósforo', 'Nitrógeno'],
    Otro: ['Análisis personalizado']
  };

  genericAnalyses = ['pH', 'Fósforo', 'Nitrógeno', 'Otros'];

  loading = false;

  constructor(private http: HttpClient) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    this.todayString = `${y}-${m}-${day}`;

    // fecha prevista = hoy + 17 días por defecto (en rango 15-20)
    const dd = new Date(d);
    dd.setDate(dd.getDate() + 17);
    const y2 = dd.getFullYear();
    const m2 = String(dd.getMonth() + 1).padStart(2, '0');
    const day2 = String(dd.getDate()).padStart(2, '0');
    this.defaultInformeString = `${y2}-${m2}-${day2}`;
  }

  ngOnInit(): void {
    this.solicitud.fechaPrevistaInforme = this.defaultInformeString;
    this.solicitud.muestras.push({ tipo: null, analisisSeleccionados: [] });
    this.loadCompanies();
    this.loadIngresos();
    this.loadSampleTypes();
  }

  loadCompanies() {
    const endpoint = '/api/companies';
    this.http.get<Company[]>(endpoint).pipe(
      catchError(err => {
        console.warn('No se pudieron cargar empresas, usando mock. Error:', err);
        const mock: Company[] = [
          { id: 1, nombre: 'Empresa Alfa', cuit: '30-11111111-1' },
          { id: 2, nombre: 'Empresa Beta', cuit: '30-22222222-2' },
          { id: 3, nombre: 'Empresa Gamma', cuit: '30-33333333-3' }
        ];
        return of(mock);
      })
    ).subscribe(data => this.companies = data || []);
  }

  loadIngresos() {
    const endpoint = '/api/ingresos';
    this.http.get<Ingreso[]>(endpoint).pipe(
      catchError(err => {
        console.warn('No se pudieron cargar ingresos, usando mock. Error:', err);
        const mock: Ingreso[] = [
          { id: 'IG-1001', fecha: this.todayString, empresaId: 1 },
          { id: 'IG-1002', fecha: this.todayString, empresaId: 2 },
          { id: 'IG-1003', fecha: this.todayString, empresaId: 3 }
        ];
        return of(mock);
      })
    ).subscribe(data => this.ingresos = data || []);
  }

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

  // Cuando se selecciona un ingreso, rellenamos fechaRecepcion y empresa si vienen
  onIngresoChange() {
    const sel = this.ingresos.find(i => String(i.id) === String(this.solicitud.ingresoId));
    if (sel) {
      this.solicitud.fechaRecepcion = sel.fecha || this.todayString;
      if (sel.empresaId != null) {
        this.solicitud.empresaId = sel.empresaId;
        this.onEmpresaChange(); // actualizar CUIT
      }
    } else {
      this.solicitud.fechaRecepcion = '';
    }
  }

  // Cuando cambia el Nombre / Empresa seleccionada -> autocompleta CUIT
  onEmpresaChange() {
    const e = this.companies.find(c => String(c.id) === String(this.solicitud.empresaId));
    if (e) {
      this.solicitud.cuit = e.cuit || '';
    } else {
      this.solicitud.cuit = '';
    }
  }

  // Muestras: agregar / quitar
  addSample() {
    this.solicitud.muestras.push({ tipo: null, analisisSeleccionados: [] });
  }

  removeSample(i: number) {
    if (this.solicitud.muestras.length <= 1) return;
    this.solicitud.muestras.splice(i, 1);
  }

  onSampleTypeChange(index: number) {
    const s = this.solicitud.muestras[index];
    if (!s) return;
    s.analisisSeleccionados = [];
  }

  toggleSampleAnalysis(index: number, analisis: string, event: any) {
    const s = this.solicitud.muestras[index];
    if (!s) return;
    if (event.target.checked) {
      if (!s.analisisSeleccionados.includes(analisis)) s.analisisSeleccionados.push(analisis);
    } else {
      s.analisisSeleccionados = s.analisisSeleccionados.filter(a => a !== analisis);
    }
  }

  availableAnalysesFor(tipo: string | null): string[] {
    if (!tipo) return this.genericAnalyses;
    return this.analysesMap[tipo] ?? this.genericAnalyses;
  }

  // Enviar solicitud al backend
  enviarSolicitud() {
    // validaciones básicas
    if (!this.solicitud.ingresoId) {
      alert('Seleccione primero el ID generado en Registro de Ingresos.');
      return;
    }
    if (!this.solicitud.empresaId) {
      alert('Seleccione el nombre del solicitante (empresa).');
      return;
    }
    if (!this.solicitud.fechaRecepcion) {
      alert('La fecha de recepción no está definida.');
      return;
    }
    if (!this.solicitud.fechaPrevistaInforme) {
      alert('Ingrese la fecha prevista para informar.');
      return;
    }
    // verificar que haya al menos una muestra con algún análisis
    const anyAnalysis = this.solicitud.muestras.some(m => m.tipo && m.analisisSeleccionados.length > 0);
    if (!anyAnalysis) {
      alert('Agregue al menos una muestra con uno o más análisis seleccionados.');
      return;
    }

    const payload = {
      ingresoId: this.solicitud.ingresoId,
      empresaId: this.solicitud.empresaId,
      cuit: this.solicitud.cuit,
      responsable: this.solicitud.responsable,
      fechaRecepcion: this.solicitud.fechaRecepcion,
      extraidaPor: this.solicitud.extraidaPor,
      fechaPrevistaInforme: this.solicitud.fechaPrevistaInforme,
      muestras: this.solicitud.muestras.map(m => ({
        tipo: m.tipo,
        analisis: m.analisisSeleccionados
      }))
    };

    const endpoint = '/api/solicitudes-analisis';
    this.loading = true;
    this.http.post(endpoint, payload).pipe(
      catchError(err => {
        console.error('Error al enviar solicitud:', err);
        return of({ success: false, message: 'No se pudo conectar con el servidor (fallback).' });
      })
    ).subscribe((resp: any) => {
      this.loading = false;
      if (resp && resp.success === false) {
        alert('Error al enviar: ' + (resp.message || 'Error desconocido'));
      } else {
        alert('Solicitud de análisis enviada correctamente.');
        // reset parcial (mantener empresas/ingresos cargados)
        this.solicitud.ingresoId = null;
        this.solicitud.empresaId = null;
        this.solicitud.cuit = '';
        this.solicitud.responsable = '';
        this.solicitud.fechaRecepcion = '';
        this.solicitud.extraidaPor = 'CI';
        this.solicitud.fechaPrevistaInforme = this.defaultInformeString;
        this.solicitud.muestras = [{ tipo: null, analisisSeleccionados: [] }];
      }
    });
  }
}
