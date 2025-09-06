import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StatisticsService, Statistics } from '../../services/statistics';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home implements OnInit {
  statistics: Statistics | null = null;
  loading = true;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.loading = true;
    this.statisticsService.getStatistics().subscribe({
      next: (data) => {
        this.statistics = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading statistics:', error);
        this.loading = false;
      }
    });
  }

getStatusColor(type: string): string {
  switch (type) {
    case 'created': return '#3b82f6';    // Azul medio
    case 'completed': return '#0891b2';  // Azul verdoso
    case 'rejected': return '#1e40af';   // Azul oscuro
    case 'modified': return '#0284c7';   // Azul claro
    default: return '#64748b';           // Gris azulado
  }
}


  getStatusIcon(type: string): string {
    switch (type) {
      case 'created': return '➕';
      case 'completed': return '✅';
      case 'rejected': return '❌';
      case 'modified': return '✏️';
      default: return '📄';
    }
  }
}
