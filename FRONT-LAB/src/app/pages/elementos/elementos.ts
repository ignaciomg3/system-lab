import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ElementosService, Elemento } from '../../services/elementos.service';

@Component({
    selector: 'app-elementos',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './elementos.html',
    styleUrls: ['./elementos.css']
})
export class Elementos implements OnInit {
    elementos: Elemento[] = [];
    selectedElemento: Elemento = { nombre: '', descripcion: '' };
    originalNombre: string = '';

    isModalOpen = false;
    isEditing = false;
    isLoading = false;
    searchTerm: string = '';

    constructor(private elementosService: ElementosService) { }

    ngOnInit() {
        this.loadElementos();
    }

    loadElementos() {
        this.isLoading = true;
        this.elementosService.getElementos().subscribe({
            next: (response) => {
                this.elementos = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error loading elementos', err);
                this.isLoading = false;
            }
        });
    }

    search() {
        if (!this.searchTerm.trim()) {
            this.loadElementos();
            return;
        }

        this.isLoading = true;
        this.elementosService.searchElementos(this.searchTerm).subscribe({
            next: (response) => {
                this.elementos = response.data || [];
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Error searching elementos', err);
                this.isLoading = false;
            }
        });
    }

    openCreateModal() {
        this.selectedElemento = { nombre: '', descripcion: '' };
        this.isEditing = false;
        this.isModalOpen = true;
    }

    openEditModal(elemento: Elemento) {
        this.selectedElemento = { ...elemento };
        this.originalNombre = elemento.nombre;
        this.isEditing = true;
        this.isModalOpen = true;
    }

    closeModal() {
        this.isModalOpen = false;
    }

    saveElemento() {
        if (this.isEditing) {
            this.elementosService.updateElemento(this.originalNombre, this.selectedElemento).subscribe({
                next: () => {
                    this.loadElementos();
                    this.closeModal();
                },
                error: (err) => console.error('Error updating elemento', err)
            });
        } else {
            this.elementosService.createElemento(this.selectedElemento).subscribe({
                next: () => {
                    this.loadElementos();
                    this.closeModal();
                },
                error: (err) => console.error('Error creating elemento', err)
            });
        }
    }

    deleteElemento(nombre: string) {
        if (confirm('¿Está seguro de eliminar este elemento?')) {
            this.elementosService.deleteElemento(nombre).subscribe({
                next: () => {
                    this.loadElementos();
                },
                error: (err) => console.error('Error deleting elemento', err)
            });
        }
    }
}
