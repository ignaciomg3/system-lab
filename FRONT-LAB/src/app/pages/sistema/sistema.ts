import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-sistema',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './sistema.html',
    styleUrls: ['./sistema.css']
})
export class Sistema {
    menuItems = [
        { title: 'Análisis', icon: '🧪', route: '/analisis', description: 'Gestión de análisis disponibles' },
        { title: 'Muestras', icon: '📦', route: '/muestras', description: 'Control de muestras recibidas' },
        { title: 'Plantillas', icon: '📝', route: '/plantillas', description: 'Configuración de plantillas de informe' },
        { title: 'Parámetros', icon: '⚙️', route: '/parametros', description: 'Definición de parámetros de análisis' },
        { title: 'Elementos', icon: '🔬', route: '/elementos', description: 'Catálogo de elementos químicos' },
        { title: 'Tipos de Análisis', icon: '📊', route: '/tipos-analisis', description: 'Categorización de servicios' },
        { title: 'Usuarios', icon: '👥', route: '/usuarios', description: 'Administración de usuarios y roles' }
    ];
}
