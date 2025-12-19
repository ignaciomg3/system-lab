import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParametrosService, Parametro } from '../../services/parametros.service';

@Component({
    selector: 'app-parametros',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './parametros.html',
    styleUrls: ['./parametros.css']
})
export class Parametros implements OnInit {
    parametros: Parametro[] = [];
    selectedParametro: Parametro = { nombre: '', unidad: '', tipo: '' };
    originalNombre: string = '';
    isModalOpen = false;
    isEditing = false;
    isLoading = false;
    searchTerm: string = '';

    constructor(private parametrosService: ParametrosService) { }

    ngOnInit() {
        this.loadParametros();
    }

    loadParametros() {
        this.isLoading = true;
        this.parametrosService.getParametros().subscribe({
            next: (response) => {
                // Backend devuelve { success, count, data: [] }
                this.parametros = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading parametros', err);
                this.isLoading = false;
            }
        });
    }

    search() {
        if (!this.searchTerm.trim()) {
            this.loadParametros();
            return;
        }

        this.isLoading = true;
        this.parametrosService.searchParametros(this.searchTerm).subscribe({
            next: (response) => {
                this.parametros = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error searching parametros', err);
                this.isLoading = false;
            }
        });
    }

    openCreateModal() {
        this.selectedParametro = { nombre: '', unidad: '', tipo: '' };
        this.isEditing = false;
        this.isModalOpen = true;
    }

    openEditModal(parametro: Parametro) {
        this.selectedParametro = { ...parametro };
        this.originalNombre = parametro.nombre;
        this.isEditing = true;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    saveParametro() {
        const { nombre, unidad, tipo } = this.selectedParametro;
        if (!nombre || !unidad || !tipo) {
            alert('Todos los campos son obligatorios'); // Simple validation
            return;
        }

        if (this.isEditing) {
            this.parametrosService.updateParametro(this.originalNombre, this.selectedParametro).subscribe({
                next: () => {
                    this.loadParametros();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating parametro', err)
            });
        } else {
            this.parametrosService.createParametro(this.selectedParametro).subscribe({
                next: () => {
                    this.loadParametros();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating parametro', err)
            });
        }
    }

    deleteParametro(nombre: string) {
        if (confirm(`¿Está seguro de eliminar el parámetro "${nombre}"?`)) {
            this.parametrosService.deleteParametro(nombre).subscribe({
                next: () => {
                    this.loadParametros();
                },
                error: (err) => console.error('Error deleting parametro', err)
            });
        }
    }
}
