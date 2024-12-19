import { Component, OnInit } from '@angular/core';
import { GruposService } from '../../services/grupos.service';
import { CalificacionService } from '../../services/calificacion.service';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-reportePDF',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatLabel, MatOptionModule, MatSelectModule],
  templateUrl: './reportePDF.component.html',
  styleUrls: ['./reportePDF.component.css'],
})
export class ReportePDFComponent implements OnInit {
  grupos: any[] = [];
  estudiantes: Usuarios[] = [];
  selectedGrupoId: number | null = null;
  selectedEstudianteId: number | null = null;
  calificaciones: any[] = [];

  constructor(
    private gruposService: GruposService,
    private calificacionService: CalificacionService
  ) {}

  ngOnInit(): void {
    this.cargarGrupos();
  }

  cargarGrupos(): void {
    this.gruposService.getGrupos().subscribe((data) => {
      this.grupos = data;
    });
  }

  cargarEstudiantesPorGrupo(): void {
    if (!this.selectedGrupoId) return;

    this.gruposService.getEstudiantesPorGrupo(this.selectedGrupoId).subscribe((data) => {
      this.estudiantes = data;
    });
  }

  cargarCalificaciones(): void {
    if (!this.selectedEstudianteId) return;

    this.calificacionService.getCalificaciones().subscribe((data) => {
      this.calificaciones = data.filter(
        (cal) => cal.estudiante_id === this.selectedEstudianteId
      );
    });
  }
}
