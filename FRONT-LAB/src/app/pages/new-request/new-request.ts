import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './new-request.html',
  styleUrls: ['./new-request.css'],
})
export class NewRequest {
request = {
  fecha: '',
  numero: null,
  solicitante: '',
  muestra: '',
  analisisSolicitado: [] as string[]
};

availableAnalisis = [
  'Físico-químico',
  'Microbiológico',
  'Toxicología',
  'Humedad',
  'Otros'
];

toggleAnalisis(analisis: string, event: any) {
  if (event.target.checked) {
    this.request.analisisSolicitado.push(analisis);
  } else {
    this.request.analisisSolicitado = this.request.analisisSolicitado.filter(a => a !== analisis);
  }
}
  createRequest() {
    // Aquí puedes enviar la solicitud al backend usando un service
    // Por ahora solo mostramos los datos en consola
    console.log('Nueva solicitud:', this.request);
    alert('¡Solicitud creada!\n\n' + JSON.stringify(this.request, null, 2));
    // Limpia el formulario si quieres
    this.request = {
      fecha: '',
      numero: null,
      solicitante: '',
      muestra: '',
      analisisSolicitado: []
    };
  }
}