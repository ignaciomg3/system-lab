import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlantillasService, Plantilla, Parametro } from '../../services/plantillas.service';

@Component({
    selector: 'app-plantillas',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './plantillas.html',
    styleUrls: ['./plantillas.css']
})
export class Plantillas implements OnInit {
    plantillas: Plantilla[] = [];
    selectedPlantilla: Plantilla = { nombre: '', solicitante: '', parametros: [] };
    originalNombre: string = '';
    isModalOpen = false;
    isEditing = false;
    isLoading = false;
    searchTerm: string = '';

    // Tipos de parámetros disponibles
    tiposParametros: string[] = ['Químico', 'Físico', 'Microbiológico', 'Bacteriológico', 'Biológico'];

    constructor(private plantillasService: PlantillasService) { }

    ngOnInit() {
        this.loadPlantillas();
    }

    loadPlantillas() {
        this.isLoading = true;
        this.plantillasService.getPlantillas().subscribe({
            next: (response) => {
                this.plantillas = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading plantillas', err);
                this.isLoading = false;
            }
        });
    }

    search() {
        if (!this.searchTerm.trim()) {
            this.loadPlantillas();
            return;
        }

        this.isLoading = true;
        this.plantillasService.searchPlantillas(this.searchTerm).subscribe({
            next: (response) => {
                this.plantillas = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error searching plantillas', err);
                this.isLoading = false;
            }
        });
    }

    openCreateModal() {
        this.selectedPlantilla = { nombre: '', solicitante: '', parametros: [] };
        this.isEditing = false;
        this.isModalOpen = true;
    }

    openEditModal(plantilla: Plantilla) {
        // Deep clone to avoid reference issues
        this.selectedPlantilla = {
            nombre: plantilla.nombre,
            solicitante: plantilla.solicitante,
            parametros: plantilla.parametros.map(p => ({ ...p }))
        };
        this.originalNombre = plantilla.nombre;
        this.isEditing = true;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    // Add new parameter to the current plantilla
    addParametro() {
        this.selectedPlantilla.parametros.push({ nombre: '', unidad: '', tipo: '' });
    }

    // Remove parameter at index
    removeParametro(index: number) {
        if (this.selectedPlantilla.parametros.length > 1) {
            this.selectedPlantilla.parametros.splice(index, 1);
        } else {
            alert('Debe haber al menos un parámetro');
        }
    }

    savePlantilla() {
        const { nombre, solicitante, parametros } = this.selectedPlantilla;

        if (!nombre || !solicitante) {
            alert('El nombre y el solicitante son obligatorios');
            return;
        }

        if (!parametros || parametros.length === 0) {
            alert('Debe agregar al menos un parámetro');
            return;
        }

        // Validate all parameters
        for (let i = 0; i < parametros.length; i++) {
            if (!parametros[i].nombre || !parametros[i].unidad || !parametros[i].tipo) {
                alert(`El parámetro ${i + 1} está incompleto`);
                return;
            }
        }

        if (this.isEditing) {
            this.plantillasService.updatePlantilla(this.originalNombre, this.selectedPlantilla).subscribe({
                next: () => {
                    this.loadPlantillas();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating plantilla', err)
            });
        } else {
            this.plantillasService.createPlantilla(this.selectedPlantilla).subscribe({
                next: () => {
                    this.loadPlantillas();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating plantilla', err)
            });
        }
    }

    deletePlantilla(nombre: string) {
        if (confirm(`¿Está seguro de eliminar la plantilla "${nombre}"?`)) {
            this.plantillasService.deletePlantilla(nombre).subscribe({
                next: () => {
                    this.loadPlantillas();
                },
                error: (err) => console.error('Error deleting plantilla', err)
            });
        }
    }

    // View details of a plantilla (expand to show parameters)
    viewDetails(plantilla: Plantilla) {
        alert(JSON.stringify(plantilla, null, 2));
    }
}
