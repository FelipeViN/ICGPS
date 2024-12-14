import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estudiantes-grupo',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './estudiantes-grupo.component.html',
  styleUrls: ['./estudiantes-grupo.component.css']
})
export class EstudiantesGrupoComponent {
  @Input() estudiantes: any[] = []; // List of students
  @Input() grupoId: number | null = null; // Selected group ID
  calificacionForm: FormGroup;
  estudianteSeleccionado: any = null; // Selected student
  modalCalificacionesVisible: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.calificacionForm = this.fb.group({
      primera_evaluacion: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      segunda_evaluacion: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      evaluacion_final: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
    });
  }

  abrirModal(estudiante: any) {
    this.estudianteSeleccionado = estudiante;
    this.modalCalificacionesVisible = true;
    this.calificacionForm.reset(); // Reset form on modal open
  }

  cerrarModal() {
    this.modalCalificacionesVisible = false;
    this.estudianteSeleccionado = null;
  }

  guardarCalificacion() {
    if (this.calificacionForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    const calificaciones = this.calificacionForm.value;
    const payload = {
      estudiante_id: this.estudianteSeleccionado.id,
      grupo_id: this.grupoId,
      ...calificaciones,
    };

    console.log('Enviando payload:', payload); // Debugging payload

    this.http.post('http://cecyte.test/api/calificaciones', payload).subscribe(
      (response) => {
        console.log('Calificación guardada:', response);
        alert('Calificación guardada exitosamente');
        this.cerrarModal();
      },
      (error) => {
        console.error('Error al guardar la calificación:', error);
        alert('Hubo un problema al guardar la calificación.');
      }
    );
  }
}
