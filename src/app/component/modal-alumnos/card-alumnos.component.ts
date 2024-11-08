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

  ngOnInit() {
    this.alumnoForm.markAllAsTouched();
    // Subscribe to tipoUsuario changes to toggle the visibility of tipoEstudiante fields
    this.alumnoForm.get('tipoUsuario')?.valueChanges.subscribe(value => {
      this.showTipoEstudianteFields = (value === 'estudiante');
    });
  }

  alumnoForm = new FormGroup({
    tipoUsuario:new FormControl('',[
      Validators.required,
    ]),
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
    matricula: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    contraseña: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, this.passwordValidator.bind(this)]
    }),
    semestre: new FormControl('', [
      Validators.required,
      Validators.pattern('^[1-9]\\d*$'),
    ]),
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
      // Abrir el segundo modal de confirmación
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent);

      confirmDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          // Si se confirma, guarda el usuario en la API
          const usuario: Usuarios = {
            id: 0,
            nombre: this.alumnoForm.value.nombre!,
            apellidoPaterno: this.alumnoForm.value.apellidoPaterno!,
            apellidoMaterno: this.alumnoForm.value.apellidoMaterno!,
            email: this.alumnoForm.value.email!,
            contraseña: this.alumnoForm.value.contraseña!,
            tipoUsuario: this.alumnoForm.value.tipoUsuario!,
            creationAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          this.http.post<Usuarios>('http://cecyte.test/api/Usuarios', usuario).subscribe({
            next: (usuarioCreado) => {
              const estudiante: Estudiantes = {
                id: 0,
                usuarioID: usuarioCreado.id,
                matricula: this.alumnoForm.value.matricula!,
                semestre: parseInt(this.alumnoForm.value.semestre!, 10),
                creationAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              this.http.post<Estudiantes>('http://cecyte.test/api/Estudiantes', estudiante).subscribe({
                next: () => {
                  alert('Alumno registrado con éxito');
                  this.dialogRef.close();
                },
                error: () => alert('Error al registrar al estudiante'),
              });
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

  emailFormControl = this.alumnoForm.get('email') as FormControl;
  matcher = new MyErrorStateMatcher();
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
