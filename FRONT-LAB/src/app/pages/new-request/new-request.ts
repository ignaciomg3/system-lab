import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

interface Client {
  id: number | string;
  nombre: string;
  cuit: string;
  direccion: string;
}

interface Sample {
  tipo: string | null;
  analisisSeleccionados: string[];
}

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, HttpClientModule],
  templateUrl: './new-request.html',
  styleUrls: ['./new-request.css'],
})
export class NewRequest implements OnInit {
  todayString: string = '';

  request = {
    fecha: '',
    entregaFecha: '',
    clienteId: null as number | string | null,
    clienteNombre: '',
    cuit: '',
    direccion: '',
    responsable: 'Ramiro',
    atencion: '',
    muestras: [] as Sample[]
  };

  clients: Client[] = [];

  sampleTypes = [
    'Agua',
    'Efluente',
    'Industrial',
    'Bromatologico',
    'Microbiologico',
    'Barro',
    'Aire',
    'Suelo',
    'Otro'
  ];

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

  constructor(private http: HttpClient) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    this.todayString = `${y}-${m}-${day}`;
  }

  ngOnInit(): void {
    this.request.fecha = this.todayString;
    this.request.entregaFecha = '';
    this.request.muestras.push({ tipo: null, analisisSeleccionados: [] });
    this.loadClients();
  }

  loadClients() {
    const endpoint = '/api/clients';
    this.http.get<Client[]>(endpoint).pipe(
      catchError(err => {
        console.warn('No se pudo cargar clients desde backend, usando mock. Error:', err);
        const mock: Client[] = [
          { id: 1, nombre: 'Cliente A', cuit: '30-12345678-1', direccion: 'Calle 1 100' },
          { id: 2, nombre: 'Cliente B', cuit: '30-87654321-2', direccion: 'Avenida 2 200' },
          { id: 3, nombre: 'Cliente C', cuit: '27-11122233-4', direccion: 'Camino 3 300' }
        ];
        return of(mock);
      })
    ).subscribe(data => {
      this.clients = data || [];
    });
  }

  onClientChange() {
    const id = this.request.clienteId;
    const found = this.clients.find(c => c.id === id || c.id === Number(id));
    if (found) {
      this.request.clienteNombre = found.nombre;
      this.request.cuit = found.cuit;
      this.request.direccion = found.direccion;
    } else {
      this.request.clienteNombre = '';
      this.request.cuit = '';
      this.request.direccion = '';
    }
  }

  addSample() {
    this.request.muestras.push({ tipo: null, analisisSeleccionados: [] });
  }

  removeSample(index: number) {
    if (index >= 0 && index < this.request.muestras.length) {
      this.request.muestras.splice(index, 1);
    }
  }

  onSampleTypeChange(index: number) {
    const sample = this.request.muestras[index];
    if (!sample) { return; }
    sample.analisisSeleccionados = [];
  }

  toggleSampleAnalysis(index: number, analisis: string, event: any) {
    const sample = this.request.muestras[index];
    if (!sample) { return; }
    if (event.target.checked) {
      if (!sample.analisisSeleccionados.includes(analisis)) {
        sample.analisisSeleccionados.push(analisis);
      }
    } else {
      sample.analisisSeleccionados = sample.analisisSeleccionados.filter(a => a !== analisis);
    }
  }

  availableAnalysesFor(tipo: string | null): string[] {
    if (!tipo) { return this.genericAnalyses; }
    return this.analysesMap[tipo] ?? this.genericAnalyses;
  }

  createRequest() {
    if (!this.request.clienteId) {
      alert('Por favor seleccione un cliente antes de continuar.');
      return;
    }
    if (!this.request.muestras || this.request.muestras.length === 0) {
      alert('Agregue al menos una muestra.');
      return;
    }

    const payload = {
      fecha: this.request.fecha,
      entregaFecha: this.request.entregaFecha,
      cliente: {
        id: this.request.clienteId,
        nombre: this.request.clienteNombre,
        cuit: this.request.cuit,
        direccion: this.request.direccion
      },
      responsable: this.request.responsable,
      atencion: this.request.atencion,
      muestras: this.request.muestras.map(m => ({
        tipo: m.tipo,
        analisis: m.analisisSeleccionados
      }))
    };

    console.log('Nueva solicitud (cotización):', payload);
    alert('Solicitud creada correctamente.\n\n' + JSON.stringify(payload, null, 2));

    this.request.fecha = this.todayString;
    this.request.entregaFecha = '';
    this.request.clienteId = null;
    this.request.clienteNombre = '';
    this.request.cuit = '';
    this.request.direccion = '';
    this.request.responsable = 'Ramiro';
    this.request.atencion = '';
    this.request.muestras = [{ tipo: null, analisisSeleccionados: [] }];
  }
}
