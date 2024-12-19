import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { CalificacionService } from '../../services/calificacion.service';
import { GruposService } from '../../services/grupos.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ReportePDFComponent } from '../reporte/reportePDF.component';

@Component({
  selector: 'app-grafica',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatOptionModule],
  templateUrl: './grafica.component.html',
  styleUrl: './grafica.component.css',
})
export class GraficaComponent implements OnInit {
  chart: any;
  grupos: any[] = [];
  selectedGrupoId: number | null = null;

  constructor(
    private calificacionService: CalificacionService,
    private gruposService: GruposService
  ) {
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.gruposService.getGrupos().subscribe((data) => {
      this.grupos = data;
    });
  }

  cargarGraficaPorGrupo(): void {
    if (!this.selectedGrupoId) return;

    this.calificacionService.getCalificaciones().subscribe((calificaciones) => {
      const calificacionesGrupo = calificaciones.filter(
        (cal) => cal.grupo_id === this.selectedGrupoId
      );

      const aprobados = calificacionesGrupo.filter((cal) => cal.evaluacion_final >= 6).length;
      const reprobados = calificacionesGrupo.filter((cal) => cal.evaluacion_final < 6).length;

      this.crearGrafica(aprobados, reprobados);
    });
  }

  crearGrafica(aprobados: number, reprobados: number): void {
    if (this.chart) this.chart.destroy();

    this.chart = new Chart('myChart', {
      type: 'pie',
      data: {
        labels: ['Aprobados', 'No Aprobados'],
        datasets: [
          {
            data: [aprobados, reprobados],
            backgroundColor: ['#4caf50', '#f44336'],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
        },
      },
    });
  }
}
