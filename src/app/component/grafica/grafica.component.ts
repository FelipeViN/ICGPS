import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Calificaciones } from '../../models/calificaciones/calificaciones.model'; 
import { Estudiantes } from '../../models/estudiantes/estudiantes.model'; 
import { Usuarios } from '../../models/usuarios/usuarios.model'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule

  ],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css'
})
export class GraficaComponent implements OnInit {
  chart: any;
  materias: { id: number; nombre: string }[] = [];
  selectedMateriaID: number | null = null;

  constructor(private http: HttpClient) {
    Chart.register(...registerables); // Registrar todos los módulos necesarios
  }

  ngOnInit(): void {
    this.loadMaterias();
  }

  loadMaterias(): void {
    this.http.get<{ id: number; nombre: string }[]>('http://cecyte.test/api/Materias').subscribe((materias) => {
      this.materias = materias;
    });
  }

  onMateriaChange(): void {
    if (this.selectedMateriaID !== null) {
      this.loadChartData(this.selectedMateriaID);
    }
  }

  loadChartData(materiaID: number): void {
    this.http.get<Calificaciones[]>('http://cecyte.test/api/Calificaciones').subscribe((calificaciones) => {
      const calificacionesFiltradas = calificaciones.filter((cal) => cal.materiaID === materiaID);

      this.http.get<Estudiantes[]>('http://cecyte.test/api/Estudiantes').subscribe((estudiantes) => {
        this.http.get<Usuarios[]>('http://cecyte.test/api/Usuarios').subscribe((usuarios) => {
          const datos = calificacionesFiltradas.map((cal) => {
            const estudiante = estudiantes.find((est) => est.id === cal.estudianteID);
            const usuario = usuarios.find((user) => user.id === estudiante?.usuarioID);

            return {
              nombreCompleto: `${usuario?.nombre} ${usuario?.apellidoPaterno} ${usuario?.apellidoMaterno}`,
              matricula: estudiante?.matricula,
              calificacion: cal.calificacion,
            };
          });

          const labels = datos.map((dato) => `${dato.nombreCompleto} (${dato.matricula})`);
          const calificaciones = datos.map((dato) => dato.calificacion);

          this.createChart(labels, calificaciones);
        });
      });
    });
  }

  createChart(labels: string[], data: number[]): void {
    if (this.chart) {
      this.chart.destroy(); // Destruir la gráfica existente antes de crear una nueva
    }
  
    // Filtrar datos para aprobados y reprobados
    const dataAprobados = data.map((cal) => (cal >= 6 ? cal : null)); // Aprobados
    const dataReprobados = data.map((cal) => (cal < 6 ? cal : null)); // Reprobados
  
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Aprobados',
            data: dataAprobados,
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Color para aprobados
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          },
          {
            label: 'Reprobados',
            data: dataReprobados,
            backgroundColor: 'rgba(255, 99, 132, 0.2)', // Color para reprobados
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `${context.dataset.label}: ${context.raw}`;
              },
            },
          },
        },
        scales: {
          x: {
            stacked: true, // Apilar las barras horizontalmente
            grid: {
              display: false,
            },
          },
          y: {
            beginAtZero: true,
            max: 10,
          },
        },
      },
    });
  }
  
  
}