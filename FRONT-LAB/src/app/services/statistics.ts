import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

export interface Statistics {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  monthlyGrowth: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: 'created' | 'completed' | 'rejected' | 'modified';
  description: string;
  date: Date;
  user: string;
}

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private apiUrl = 'http://localhost:3000/api'; // Cambia por tu URL

  constructor(private http: HttpClient) {}

  getStatistics(): Observable<Statistics> {
    // return this.http.get<Statistics>(`${this.apiUrl}/statistics`);
    
    // Por ahora datos mock, después conectas al backend real
    return of({
      totalRequests: 1247,
      pendingRequests: 23,
      completedRequests: 1180,
      rejectedRequests: 44,
      monthlyGrowth: 12.5,
      recentActivity: [
        {
          id: '1',
          type: 'created',
          description: 'Nueva solicitud de análisis físico-químico',
          date: new Date('2025-01-06T10:30:00'),
          user: 'Juan Pérez'
        },
        {
          id: '2',
          type: 'completed',
          description: 'Análisis microbiológico completado',
          date: new Date('2025-01-06T09:15:00'),
          user: 'María García'
        },
        {
          id: '3',
          type: 'rejected',
          description: 'Solicitud rechazada por documentación incompleta',
          date: new Date('2025-01-06T08:45:00'),
          user: 'Carlos López'
        }
      ]
    });
  }

  getChartData(): Observable<any> {
    // Datos para gráficos
    return of({
      labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Solicitudes por mes',
          data: [120, 150, 180, 220, 200, 250]
        }
      ]
    });
  }
}
