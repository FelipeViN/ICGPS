import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  model,
} from '@angular/core';
import {
  FormsModule,
  FormControl,
  FormGroupDirective,
  NgForm,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { Estudiantes } from '../../models/estudiantes/estudiantes.model';
import { Profesores } from '../../models/profesores/profesores.model';
import { Administrativos } from '../../models/administrativos/administrativos.model';
import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-modal-alumnos',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './card-alumnos.component.html',
  styleUrl: './card-alumnos.component.css',
})
export class ModalAlumnosComponent {
  
  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'create-alumno.component.html',
  styleUrl: './card-alumnos.component.css',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    MatSelect,
    MatOption,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly http = inject(HttpClient);
  readonly dialog = inject(MatDialog);
  showTipoEstudianteFields = false;
  showTipoProfesorFields = false;
  showTipoAdministrativoFields = false;

  ngOnInit() {
    // Deshabilitar todos los campos excepto el tipo de usuario al iniciar
    this.alumnoForm.get('nombre')?.disable();
    this.alumnoForm.get('apellidoPaterno')?.disable();
    this.alumnoForm.get('apellidoMaterno')?.disable();
    this.alumnoForm.get('email')?.disable();
    this.alumnoForm.get('contraseña')?.disable();
    this.alumnoForm.get('matricula')?.disable();
    this.alumnoForm.get('semestre')?.disable();
    this.alumnoForm.get('numeroEmpleado')?.disable();
    this.alumnoForm.get('especialidad')?.disable();
    this.alumnoForm.get('departamento')?.disable();
    this.alumnoForm.get('cargo')?.disable();
  
    // Configuración para habilitar campos de forma secuencial basada en tipo de usuario
    this.alumnoForm.get('tipoUsuario')?.valueChanges.subscribe(value => {
      if (value) { // Asegurarse de que 'value' no sea null
        // Configurar visibilidad de campos específicos
        this.showTipoEstudianteFields = value === 'estudiante';
        this.showTipoProfesorFields = value === 'profesor';
        this.showTipoAdministrativoFields = value === 'secretaria';
  
        // Habilitar el primer campo específico según el tipo de usuario
        if (value === 'estudiante') {
          this.alumnoForm.get('matricula')?.enable();
          this.alumnoForm.get('matricula')?.valueChanges.subscribe(matriculaValue => {
            if (matriculaValue) {
              this.alumnoForm.get('semestre')?.enable();
            } else {
              this.alumnoForm.get('semestre')?.disable();
            }
          });
        } else if (value === 'profesor') {
          this.alumnoForm.get('numeroEmpleado')?.enable();
          this.alumnoForm.get('numeroEmpleado')?.valueChanges.subscribe(numeroEmpleadoValue => {
            if (numeroEmpleadoValue) {
              this.alumnoForm.get('especialidad')?.enable();
            } else {
              this.alumnoForm.get('especialidad')?.disable();
            }
          });
        } else if (value === 'secretaria') {
          this.alumnoForm.get('departamento')?.enable();
          this.alumnoForm.get('departamento')?.valueChanges.subscribe(departamentoValue => {
            if (departamentoValue) {
              this.alumnoForm.get('cargo')?.enable();
            } else {
              this.alumnoForm.get('cargo')?.disable();
            }
          });
        }
  
        // Habilitar los campos genéricos después del último campo específico
        const lastSpecificField = this.getLastSpecificFieldControl(value);
        lastSpecificField?.valueChanges.subscribe(lastFieldValue => {
          if (lastFieldValue) {
            this.alumnoForm.get('nombre')?.enable();
          } else {
            this.alumnoForm.get('nombre')?.disable();
          }
        });
      } else {
        // Si el valor de tipoUsuario es null, deshabilitar campos específicos y genéricos
        this.showTipoEstudianteFields = false;
        this.showTipoProfesorFields = false;
        this.showTipoAdministrativoFields = false;
        this.alumnoForm.get('matricula')?.disable();
        this.alumnoForm.get('semestre')?.disable();
        this.alumnoForm.get('numeroEmpleado')?.disable();
        this.alumnoForm.get('especialidad')?.disable();
        this.alumnoForm.get('departamento')?.disable();
        this.alumnoForm.get('cargo')?.disable();
        this.alumnoForm.get('nombre')?.disable();
        this.alumnoForm.get('apellidoPaterno')?.disable();
        this.alumnoForm.get('apellidoMaterno')?.disable();
        this.alumnoForm.get('email')?.disable();
        this.alumnoForm.get('contraseña')?.disable();
      }
    });
  
    // Secuencia para habilitar campos genéricos después del último campo específico
    this.alumnoForm.get('nombre')?.valueChanges.subscribe(value => {
      if (value) {
        this.alumnoForm.get('apellidoPaterno')?.enable();
      } else {
        this.alumnoForm.get('apellidoPaterno')?.disable();
      }
    });
  
    this.alumnoForm.get('apellidoPaterno')?.valueChanges.subscribe(value => {
      if (value) {
        this.alumnoForm.get('apellidoMaterno')?.enable();
      } else {
        this.alumnoForm.get('apellidoMaterno')?.disable();
      }
    });
  
    this.alumnoForm.get('apellidoMaterno')?.valueChanges.subscribe(value => {
      if (value) {
        this.alumnoForm.get('email')?.enable();
      } else {
        this.alumnoForm.get('email')?.disable();
      }
    });
  
    this.alumnoForm.get('email')?.valueChanges.subscribe(value => {
      if (value) {
        this.alumnoForm.get('contraseña')?.enable();
      } else {
        this.alumnoForm.get('contraseña')?.disable();
      }
    });
  }
  
  // Método auxiliar para obtener el último campo específico según el tipo de usuario s
  getLastSpecificFieldControl(tipoUsuario: string): FormControl | null {
    switch (tipoUsuario) {
      case 'estudiante':
        return this.alumnoForm.get('semestre') as FormControl;
      case 'profesor':
        return this.alumnoForm.get('especialidad') as FormControl;
      case 'secretaria':
        return this.alumnoForm.get('cargo') as FormControl;
      default:
        return null;
    }
  }

  

  alumnoForm = new FormGroup({
    tipoUsuario: new FormControl('', [Validators.required]),
    nombre: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ\\u00f1\\u00d1]+$'),
    ]),
    apellidoPaterno: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ\\u00f1\\u00d1]+$'),
    ]),
    apellidoMaterno: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-ZÀ-ÿ\\u00f1\\u00d1]+$'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    contraseña: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, this.passwordValidator.bind(this)],
    }),
     Estatus: new FormControl(1, [Validators.required]),  // Valor por defecto 1 para "activo"
    
    // Estudiante-specific fields
    matricula: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d{14}$')  // Valida exactamente 14 dígitos
    ]),
    semestre: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9]\\d*$'),
    ]),
    
    // Profesor-specific fields
    numeroEmpleado: new FormControl(''),
    especialidad: new FormControl(''),
  
    // Administrativo-specific fields
    departamento: new FormControl(''),
    cargo: new FormControl(''),
  });

  get nombreError() {
    const control = this.alumnoForm.get('nombre');
    if (control?.hasError('required')) {
      return 'El nombre es requerido';
    }
    if (control?.hasError('pattern')) {
      return 'Solo se permiten letras';
    }
    return '';
  }
  get matriculaError() {
    const control = this.alumnoForm.get('matricula');
    if (control?.hasError('required')) {
      return 'La matrícula es requerida';
    }
    if (control?.hasError('pattern')) {
      return 'La matrícula debe tener exactamente 14 dígitos numéricos';
    }
    return '';
  }

  get apellidoPaternoError() {
    const control = this.alumnoForm.get('apellidoPaterno');
    if (control?.hasError('required')) {
      return 'El apellido paterno es requerido';
    }
    if (control?.hasError('pattern')) {
      return 'Solo se permiten letras';
    }
    return '';
  }

  get apellidoMaternoError() {
    const control = this.alumnoForm.get('apellidoMaterno');
    if (control?.hasError('required')) {
      return 'El apellido materno es requerido';
    }
    if (control?.hasError('pattern')) {
      return 'Solo se permiten letras';
    }
    return '';
  }

  get semestreError() {
    const control = this.alumnoForm.get('semestre');
    if (control?.hasError('required')) {
      return 'El semestre es requerido';
    }
    if (control?.hasError('pattern')) {
      return 'Solo números positivos permitidos';
    }
    return '';
  }

  passwordValidator(control: FormControl): { [key: string]: any } | null {
    const password = control.value || '';
    const errors: any = {};
  
    if (!/[A-Z]/.test(password)) {
      errors.missingUpperCase = 'Falta mayúscula: A, B, C...';
    }
    if (!/[a-z]/.test(password)) {
      errors.missingLowerCase = 'Falta minúscula: a, b, c...';
    }
    if (!/[0-9]/.test(password)) {
      errors.missingNumber = 'Falta número: 1, 2, 3...';
    }
    if (!/[@$!%*?&]/.test(password)) {
      errors.missingSpecialChar = 'Falta caracter especial: @, $, !, %, *, ?, &';
    }
  
    return Object.keys(errors).length > 0 ? errors : null;
  }
  
  get passwordError() {
    const control = this.alumnoForm.get('contraseña');
    const errors = control?.errors;
    if (errors) {
      return Object.values(errors).join(', ');
    }
    return '';
  }
  
  onSubmit() {
    if (this.alumnoForm.valid) {
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent);
  
      confirmDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const usuario: Usuarios = {
            id: 0,
            nombre: this.alumnoForm.value.nombre!,
            apellidoPaterno: this.alumnoForm.value.apellidoPaterno!,
            apellidoMaterno: this.alumnoForm.value.apellidoMaterno!,
            email: this.alumnoForm.value.email!,
            contraseña: this.alumnoForm.value.contraseña!,
            tipoUsuario: this.alumnoForm.value.tipoUsuario!,
            Estatus: this.alumnoForm.value.Estatus || 1,
            creationAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
  
          this.http.post<Usuarios>('http://127.0.0.1:8000/api/Usuarios', usuario).subscribe({
            next: (usuarioCreado) => {
              if (this.alumnoForm.value.tipoUsuario === 'estudiante') {
                this.registerEstudiante(usuarioCreado.id);
              } else if (this.alumnoForm.value.tipoUsuario === 'profesor') {
                this.registerProfesor(usuarioCreado.id);
              } else if (this.alumnoForm.value.tipoUsuario === 'secretaria') {
                this.registerAdministrativo(usuarioCreado.id);
              }
            },
            error: () => alert('Error al registrar al usuario'),
          });
        }
      });
    } else {
      alert('Por favor, completa todos los campos');
    }
  }
  
  

  onNoClick(): void {
    this.dialogRef.close();
  }

  allowOnlyLetters(event: Event) {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g, '');
    input.value = filteredValue;
    this.alumnoForm.get(input.getAttribute('formControlName')!)?.setValue(filteredValue);
  }
  allowOnlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^0-9]/g, ''); // Permite solo números
    input.value = filteredValue;
    this.alumnoForm.get(input.getAttribute('formControlName')!)?.setValue(filteredValue);
  }

  emailFormControl = this.alumnoForm.get('email') as FormControl;
  matcher = new MyErrorStateMatcher();

private registerEstudiante(usuarioID: number) {
  const estudiante: Estudiantes = {
    id: 0,
    usuarioID: usuarioID,
    matricula: this.alumnoForm.value.matricula!,
    semestre: parseInt(this.alumnoForm.value.semestre!, 10),
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
console.log(estudiante);
  this.http.post<Estudiantes>('http://127.0.0.1:8000/api/Estudiantes', estudiante).subscribe({
    next: () => {
      alert('Estudiante registrado con éxito');
      this.dialogRef.close();
    },
    error: () => alert('Error al registrar al estudiante'),
  });
}

private registerProfesor(usuarioID: number) {
  const profesor: Profesores = {
    id: 0,
    usuarioID: usuarioID,
    numeroEmpleado: this.alumnoForm.value.numeroEmpleado!,
    especialidad: this.alumnoForm.value.especialidad!,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  this.http.post<Profesores>('http://127.0.0.1:8000/api/Profesores', profesor).subscribe({
    next: () => {
      alert('Profesor registrado con éxito');
      this.dialogRef.close();
    },
    error: () => alert('Error al registrar al profesor'),
  });
}

private registerAdministrativo(usuarioID: number) {
  const administrativo: Administrativos = {
    id: 0,
    usuarioID: usuarioID,
    departamento: this.alumnoForm.value.departamento!,
    cargo: this.alumnoForm.value.cargo!,
    creationAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  this.http.post<Administrativos>('http://127.0.0.1:8000/api/Administrativos', administrativo).subscribe({
    next: () => {
      alert('Administrativo registrado con éxito');
      this.dialogRef.close();
    },
    error: () => alert('Error al registrar al administrativo'),
  });
}
}

// Segundo modal de confirmación
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
  ],
})
export class ConfirmDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
