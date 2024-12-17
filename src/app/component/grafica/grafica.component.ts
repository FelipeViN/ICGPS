import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Calificaciones } from '../../models/calificaciones/calificaciones.model';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Materias } from '../../models/materias/materias.model';
import { ReportePDFComponent } from "../reporte/reportePDF.component";

@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule, ReportePDFComponent],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css',
})
export class GraficaComponent implements OnInit {
  chart: any;
  estudiantes: Usuarios[] = [];
  materias: Materias[] = [];
  selectedEstudianteID: number | null = null;

  constructor(private http: HttpClient) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadEstudiantes();
    this.loadMaterias();
  }

  // Cargar lista de estudiantes
  loadEstudiantes(): void {
    this.http
      .get<Usuarios[]>('http://cecyte.test/api/Usuarios')
      .subscribe((data) => {
        this.estudiantes = data.filter(
          (usuario) => usuario.tipoUsuario === 'estudiante'
        );
      });
  }

  // Cargar lista de materias
  loadMaterias(): void {
    this.http
      .get<Materias[]>('http://cecyte.test/api/Materias')
      .subscribe((data) => {
        this.materias = data;
      });
  }

  // Manejar cambio de selección de estudiante
  onEstudianteChange(): void {
    if (this.selectedEstudianteID !== null) {
      this.loadChartData(this.selectedEstudianteID);
    }
  }

  // Cargar calificaciones del estudiante seleccionado
  loadChartData(estudianteID: number): void {
    this.http
      .get<Calificaciones[]>('http://cecyte.test/api/Calificaciones')
      .subscribe((calificaciones) => {
        const calificacionesEstudiante = calificaciones.filter(
          (cal) => cal.estudianteID === estudianteID
        );

        // Relacionar calificaciones con el nombre de la materia
        const labels = calificacionesEstudiante.map((cal) => {
          const materia = this.materias.find((m) => m.id === cal.materiaID);
          return materia ? materia.nombre : 'Materia desconocida';
        });

        const data = calificacionesEstudiante.map((cal) => cal.calificacion);

        this.createChart(labels, data);
      });
  }

  // Crear la gráfica
  createChart(labels: string[], data: number[]): void {
    if (this.chart) {
      this.chart.destroy();
    }
  
    const dataAprobados = data.map((cal) => (cal >= 6 ? cal : null));
    const dataReprobados = data.map((cal) => (cal < 6 ? cal : null));
  
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Aprobados',
            data: dataAprobados,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            barPercentage: 1,        // Ocupar todo el espacio en la barra
            categoryPercentage: 0.9,   // Eliminar espacios entre categorías
          },
          {
            label: 'Reprobados',
            data: dataReprobados,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            barPercentage: 1,
            categoryPercentage: 0.9,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          tooltip: {
            callbacks: {
              label: (context) => {
                const value = context.raw as number;
                return `${context.dataset.label}: ${value.toFixed(2)}`;
              },
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { autoSkip: false }, // Mostrar todas las etiquetas
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