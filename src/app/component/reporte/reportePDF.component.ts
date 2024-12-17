import { Component, Input, SimpleChanges } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonModule } from '@angular/common';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { HttpClient } from '@angular/common/http';
import { Calificaciones } from '../../models/calificaciones/calificaciones.model';
import { Materias } from '../../models/materias/materias.model';

@Component({
  selector: 'app-reportePDF',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reportePDF.component.html',
  styleUrls: ['./reportePDF.component.css'],
})
export class ReportePDFComponent {
  @Input() estudianteId!: number;
  estudiante: Usuarios | null = null;
  calificaciones: { materia: string; calificacion: number }[] = [];

  constructor(private http: HttpClient) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['estudianteId'] && this.estudianteId) {
      this.cargarDatosEstudiante();
      this.cargarCalificaciones();
    }
  }

  // Función para cargar los datos del estudiante
  cargarDatosEstudiante(): void {
    const url = `http://cecyte.test/api/Usuarios/${this.estudianteId}`;
    this.http.get<Usuarios>(url).subscribe((data) => {
      this.estudiante = data;
    });
  }

  // Función para cargar calificaciones y materias
  cargarCalificaciones(): void {
    this.http.get<Calificaciones[]>('http://cecyte.test/api/Calificaciones').subscribe((calificaciones) => {
      const calificacionesEstudiante = calificaciones.filter(
        (cal) => cal.estudianteID === this.estudianteId
      );

      this.http.get<Materias[]>('http://cecyte.test/api/Materias').subscribe((materias) => {
        this.calificaciones = calificacionesEstudiante.map((cal) => {
          const materia = materias.find((m) => m.id === cal.materiaID);
          return { materia: materia ? materia.nombre : 'Desconocida', calificacion: cal.calificacion };
        });
      });
    });
  }

  // Función para generar el PDF
  generarPDF(): void {
    const DATA: HTMLElement = document.getElementById('reporte') as HTMLElement;

    html2canvas(DATA, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('reporte.pdf');
    });
  }
}
