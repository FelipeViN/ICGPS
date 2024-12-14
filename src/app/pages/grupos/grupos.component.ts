import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GruposService } from '../../services/grupos.service';
import { CommonModule } from '@angular/common';
import { ToolbarComponent } from "../../component/toolbar/toolbar.component";
import { catchError, finalize, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Grupos } from '../../models/grupos/grupos.model';
import { cicloEscolarValidator } from './cicloEscolarValidator';  // Importa el validador personalizado
import { Router } from '@angular/router';
import { EstudiantesGrupoComponent } from '../../component/estudiantes-grupo/estudiantes-grupo.component';


@Component({
  selector: 'app-grupos',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, FormsModule, ToolbarComponent, EstudiantesGrupoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css'],
})
export class GruposComponent {
  
  private gruposService = inject(GruposService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  searchQuery = '';
  mostrarFormulario = false;
  grupos: Grupos[] = [];
  estudiantes: any[] = []; // Nuevo estado para almacenar estudiantes
  grupoSeleccionado: Grupos | null = null; // Nuevo estado para almacenar el grupo seleccionado
  mostrarVistaEstudiantes = false; // Controla si se muestra la vista de estudiantes
  isEditMode = false;
  isLoading = false;
  filteredGrupos: Grupos[] = [];
  
  
  grupoForm = new FormGroup({
    id: new FormControl<number | null>(null),
    nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
    cicloEscolar: new FormControl('', [Validators.required, cicloEscolarValidator]),  // Aplicamos el validador aquí
    semestre: new FormControl<number>(1, [Validators.required, Validators.min(1), Validators.max(6)]),
  });

  ngOnInit(): void {
    this.obtenerGrupos();
  }

  obtenerGrupos(): void {
    this.isLoading = true;
    this.gruposService.getGrupos()
      .pipe(
        tap(data => {
          console.log('Grupos obtenidos:', data);
          this.grupos = data;
          this.filteredGrupos = data;
          this.cdr.markForCheck();
        }),
        catchError(error => {
          console.error('Error al obtener grupos:', error);
          this.mostrarMensaje('Error al cargar los grupos');
          return of([]);
        }),
        finalize(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  verEstudiantes(grupo: Grupos): void {
    if (grupo.id !== null) { // Validation to ensure ID is present
      this.isLoading = true;
      this.gruposService.getEstudiantesPorGrupo(grupo.id)
        .pipe(
          tap((data) => {
            console.log('Estudiantes obtenidos:', data); // Debugging log
            this.estudiantes = data;
            this.grupoSeleccionado = grupo;
            this.mostrarVistaEstudiantes = true; // Toggle student view
            this.cdr.markForCheck();
          }),
          catchError((error) => {
            console.error('Error al cargar estudiantes:', error); // Log errors
            this.mostrarMensaje('Error al cargar los estudiantes.');
            return of([]); // Return empty array to avoid breaking the UI
          }),
          finalize(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe();
    } else {
      console.error('El ID del grupo es nulo.');
    }
  }

  volverALista(): void {
    this.mostrarVistaEstudiantes = false;
    this.grupoSeleccionado = null;
    this.estudiantes = [];
    this.cdr.markForCheck();
  }

  filterGrupos(): void {
    if (!this.searchQuery.trim()) {
      this.filteredGrupos = this.grupos;
    } else {
      const searchTerm = this.searchQuery.toLowerCase().trim();
      this.filteredGrupos = this.grupos.filter(grupo =>
        grupo.nombre.toLowerCase().includes(searchTerm) ||
        grupo.cicloEscolar.toLowerCase().includes(searchTerm) ||
        grupo.semestre.toString().includes(searchTerm)
      );
    }
    this.cdr.markForCheck();
  }

  openAgregarGrupoForm(): void {
    this.mostrarFormulario = true;
    this.isEditMode = false;
    this.resetForm();
    this.cdr.markForCheck();
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
    this.resetForm();
    this.cdr.markForCheck();
  }

  agregarGrupo(): void {
    if (this.grupoForm.valid) {
      this.isLoading = true;
      const nuevoGrupo: Grupos = {
        id: 1, // Asignar un valor nulo o manejarlo segun el problema
        nombre: this.grupoForm.get('nombre')?.value || '',
        semestre: Number(this.grupoForm.get('semestre')?.value) || 1,
        cicloEscolar: this.grupoForm.get('cicloEscolar')?.value || '',
        creationAt: new Date().toISOString(), // Asigna la fecha actual 
        updatedAt: new Date().toISOString(), // Asignar la fecha de actualización
      };
      console.log('Intentando crear grupo:', nuevoGrupo);
      this.gruposService.addGrupo(nuevoGrupo)
        .pipe(
          tap(() => {
            this.mostrarMensaje('Grupo agregado exitosamente');
            this.actualizarLista();
            this.cerrarFormulario();
          }),
          catchError(error => {
            console.error('Error al crear grupo:', error);
            this.mostrarMensaje(error.message || 'Error al crear el grupo');
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe();
    } else {
      this.mostrarFormularioInvalido();
    }
  }

  editarGrupo(grupo: Grupos): void {
    console.log('Editando grupo:', grupo);
    this.isEditMode = true;
    this.mostrarFormulario = true;
    this.grupoForm.patchValue({
      id: grupo.id,
      nombre: grupo.nombre,
      semestre: grupo.semestre,
      cicloEscolar: grupo.cicloEscolar,
    });
    this.cdr.markForCheck();
  }

  actualizarGrupo(): void {
    if (this.grupoForm.valid) {
      this.isLoading = true;
      const id = this.grupoForm.get('id')?.value;
      if (id) {
        const grupoActualizado: Grupos = {
          id: id,
          nombre: this.grupoForm.get('nombre')?.value || '',
          semestre: Number(this.grupoForm.get('semestre')?.value) || 1,
          cicloEscolar: this.grupoForm.get('cicloEscolar')?.value || '',
          creationAt: new Date().toISOString(), // Mantener la fecha actual 
          updatedAt: new Date().toISOString(), // Actualizar la fecha de modificación
        };
        console.log('Actualizando grupo:', grupoActualizado);
        this.gruposService.updateGrupo(id, grupoActualizado)
          .pipe(
            tap(() => {
              this.mostrarMensaje('Grupo actualizado exitosamente');
              this.actualizarLista();
              this.cerrarFormulario();
            }),
            catchError(error => {
              console.error('Error al actualizar grupo:', error);
              this.mostrarMensaje(error.message || 'Error al actualizar el grupo');
              return of(null);
            }),
            finalize(() => {
              this.isLoading = false;
              this.cdr.markForCheck();
            })
          )
          .subscribe();
      }
    } else {
      this.mostrarFormularioInvalido();
    }
  }

  eliminarGrupo(id: number): void {
    if (confirm('¿Está seguro de que desea eliminar este grupo?')) {
      this.isLoading = true;
      this.gruposService.deleteGrupo(id)
        .pipe(
          tap(() => {
            this.mostrarMensaje('Grupo eliminado exitosamente');
            this.actualizarLista();
          }),
          catchError(error => {
            console.error('Error al eliminar grupo:', error);
            this.mostrarMensaje(error.message || 'Error al eliminar el grupo');
            return of(null);
          }),
          finalize(() => {
            this.isLoading = false;
            this.cdr.markForCheck();
          })
        )
        .subscribe();
    }
  }

  guardarGrupo(): void {
    if (this.grupoForm.valid) {
      if (this.isEditMode) {
        this.actualizarGrupo();
      } else {
        this.agregarGrupo();
      }
    } else {
      this.mostrarFormularioInvalido();
    }
  }

  private mostrarFormularioInvalido(): void {
    let mensajesError: string[] = [];
    
    if (this.grupoForm.get('nombre')?.invalid) { mensajesError.push(this.nombreError); }
    if (this.grupoForm.get('cicloEscolar')?.invalid) { mensajesError.push(this.cicloEscolarError); }
    if (this.grupoForm.get('semestre')?.invalid) { mensajesError.push(this.semestreError); }

    if (mensajesError.length > 0) {
      this.mostrarMensaje(
        'Por favor, corrija los siguientes errores:\n' + mensajesError.join('\n')
      );
      
      Object.keys(this.grupoForm.controls).forEach(key => {
        const control = this.grupoForm.get(key);
        control?.markAsTouched();
      });
    }
  }

  resetForm(): void {
    this.isEditMode = false;
    this.grupoForm.reset({ id: null, nombre: '', cicloEscolar: '', semestre: 1 });
  }

  private actualizarLista(): void {
    this.obtenerGrupos();
  }

  private mostrarMensaje(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top' });
  }

  get nombreError(): string { 
    const control = this.grupoForm.get('nombre'); 
    if (control?.hasError('required')) return 'El nombre es obligatorio'; 
    if (control?.hasError('minlength')) return 'El nombre debe tener al menos 3 caracteres'; 
    return ''; 
  }

  get cicloEscolarError(): string { 
    const control = this.grupoForm.get('cicloEscolar'); 
    if (control?.hasError('required')) return 'El ciclo escolar es obligatorio';
    if (control?.hasError('invalidFormat')) return 'El formato debe ser "Agosto-Diciembre 2024"'; 
    if (control?.hasError('yearTooFar')) return 'El ciclo escolar no puede ser posterior al siguiente año'; 
    return ''; 
  }
  

  get semestreError(): string { 
    const control = this.grupoForm.get('semestre'); 
    if (control?.hasError('required')) return 'El semestre es obligatorio'; 
    if (control?.hasError('min')) return 'El semestre debe ser mayor o igual a 1'; 
    if (control?.hasError('max')) return 'El semestre debe ser menor o igual a 6'; 
    return ''; 
  }
}
