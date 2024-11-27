import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { Estudiantes } from '../../models/estudiantes/estudiantes.model';
import { UsuarioEstudiante } from '../../models/usuario-estudiante/usuario-estudiante.model';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatOption, MatSelect } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { MyErrorStateMatcher } from '../modal-alumnos/card-alumnos.component';
import { Administrativos } from '../../models/administrativos/administrativos.model';
import { Profesores } from '../../models/profesores/profesores.model';
import { BorrarUsuariosComponent } from '../borrar-usuarios/borrar-usuarios.component';

@Component({
  selector: 'app-tabla-estudiantes',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatPaginator,
    BorrarUsuariosComponent,
    ActualizarUsuariosComponent,
  ],
  templateUrl: './tabla-estudiantes.component.html',
  styleUrls: ['./tabla-estudiantes.component.css'],
})
export class TablaEstudiantesComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  //Esta pequeña seccion hace que funcione el paginator
  // INICIO DE LA SECCION
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource = new MatTableDataSource(this.dataSource.data);
    this.dataSource.paginator = this.paginator;
  }
  // FIN DE LA SECCION

  displayedColumns: string[] = [
    'matricula',
    'nombre',
    'email',
    'semestre',
    'actions',
  ];
  dataSource = new MatTableDataSource<UsuarioEstudiante>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEstudiantes();
  }

  loadEstudiantes(): void {
    this.http
      .get<Usuarios[]>('http://cecyte.test/api/Usuarios')
      .subscribe((usuarios) => {
        const estudiantes = usuarios.filter(
          (usuario) =>
            usuario.tipoUsuario === 'estudiante' && usuario.Estatus === 1
        );

        this.http
          .get<Estudiantes[]>('http://cecyte.test/api/Estudiantes')
          .subscribe((estudiantesData) => {
            const estudiantesCompletos: UsuarioEstudiante[] = estudiantes.map(
              (est) => {
                const estudianteData = estudiantesData.find(
                  (e) => e.usuarioID === est.id
                );
                return {
                  id: estudianteData?.id || 0, // ID específico del estudiante, con 0 como valor predeterminado
                  usuarioID: est.id, // ID del usuario en Usuarios
                  nombre: est.nombre,
                  apellidoPaterno: est.apellidoPaterno,
                  apellidoMaterno: est.apellidoMaterno,
                  email: est.email,
                  tipoUsuario: est.tipoUsuario,
                  Estatus: est.Estatus,
                  matricula: estudianteData?.matricula, // Matricula opcional
                  semestre: estudianteData?.semestre, // Semestre opcional
                  creationAt: est.creationAt, // Fecha de creación
                  updatedAt: est.updatedAt, // Última fecha de modificación
                };
              }
            );

            this.dataSource.data = estudiantesCompletos;
          });
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(estudiante: UsuarioEstudiante): void {
    console.log(estudiante);
    this.dialog.open(DialogOverviewExampleDialog, {
      data: {
        ...estudiante,
        estudianteId: estudiante.id, // ID específico del estudiante en caso de actualización
      },
    });
  }
}
import { Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { ActualizarUsuariosComponent } from '../actualizar-usuarios/actualizar-usuarios.component';
@Component({
  selector: 'show-estudiantes',
  templateUrl: 'show-estudiantes.component.html',
  styleUrl: './tabla-estudiantes.component.css',
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
    ReactiveFormsModule,
    MatSelect,
    MatOption,
  ],
})
export class DialogOverviewExampleDialog {
  readonly http = inject(HttpClient);
  readonly dialog = inject(MatDialog);
  showTipoEstudianteFields = false;
  showTipoProfesorFields = false;
  showTipoAdministrativoFields = false;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  populateForm(): void {
    this.alumnoForm.patchValue({
      tipoUsuario: this.data.tipoUsuario,
      nombre: this.data.nombre,
      apellidoPaterno: this.data.apellidoPaterno,
      apellidoMaterno: this.data.apellidoMaterno,
      email: this.data.email,
      contraseña: this.data.contraseña,
      matricula: this.data.matricula,
      semestre: this.data.semestre,
      numeroEmpleado: this.data.numeroEmpleado,
      especialidad: this.data.especialidad,
      departamento: this.data.departamento,
      cargo: this.data.cargo,
    });
  }
  // Actualiza los datos del estudiante en el servidor
  updateStudent(): void {
    if (this.alumnoForm.valid) {
      const updatedData = {
        ...this.data,
        ...this.alumnoForm.value,
        updatedAt: new Date().toISOString(), // Actualiza la fecha de modificación
      };

      this.http
        .put(`http://cecyte.test/api/Usuarios/${this.data.id}`, updatedData)
        .subscribe({
          next: () => {
            alert('Datos actualizados con éxito');
            this.dialogRef.close(updatedData); // Cierra el modal y pasa los datos actualizados
          },
          error: () => alert('Error al actualizar los datos'),
        });
    } else {
      alert('Por favor, completa todos los campos correctamente');
    }
  }

  ngOnInit() {
    this.populateForm();

    // Configuración para habilitar campos de forma secuencial basada en tipo de usuario
    this.alumnoForm.get('tipoUsuario')?.valueChanges.subscribe((value) => {
      if (value) {
        // Asegurarse de que 'value' no sea null
        // Configurar visibilidad de campos específicos
        this.showTipoEstudianteFields = value === 'estudiante';
        this.showTipoProfesorFields = value === 'profesor';
        this.showTipoAdministrativoFields = value === 'secretaria';

        // Habilitar el primer campo específico según el tipo de usuario
        if (value === 'estudiante') {
          this.alumnoForm.get('matricula')?.enable();
          this.alumnoForm
            .get('matricula')
            ?.valueChanges.subscribe((matriculaValue) => {
              if (matriculaValue) {
                this.alumnoForm.get('semestre')?.enable();
              } else {
                this.alumnoForm.get('semestre')?.disable();
              }
            });
        } else if (value === 'profesor') {
          this.alumnoForm.get('numeroEmpleado')?.enable();
          this.alumnoForm
            .get('numeroEmpleado')
            ?.valueChanges.subscribe((numeroEmpleadoValue) => {
              if (numeroEmpleadoValue) {
                this.alumnoForm.get('especialidad')?.enable();
              } else {
                this.alumnoForm.get('especialidad')?.disable();
              }
            });
        } else if (value === 'secretaria') {
          this.alumnoForm.get('departamento')?.enable();
          this.alumnoForm
            .get('departamento')
            ?.valueChanges.subscribe((departamentoValue) => {
              if (departamentoValue) {
                this.alumnoForm.get('cargo')?.enable();
              } else {
                this.alumnoForm.get('cargo')?.disable();
              }
            });
        }

        // Habilitar los campos genéricos después del último campo específico
        const lastSpecificField = this.getLastSpecificFieldControl(value);
        lastSpecificField?.valueChanges.subscribe((lastFieldValue) => {
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
    this.alumnoForm.get('nombre')?.valueChanges.subscribe((value) => {
      if (value) {
        this.alumnoForm.get('apellidoPaterno')?.enable();
      } else {
        this.alumnoForm.get('apellidoPaterno')?.disable();
      }
    });

    this.alumnoForm.get('apellidoPaterno')?.valueChanges.subscribe((value) => {
      if (value) {
        this.alumnoForm.get('apellidoMaterno')?.enable();
      } else {
        this.alumnoForm.get('apellidoMaterno')?.disable();
      }
    });

    this.alumnoForm.get('apellidoMaterno')?.valueChanges.subscribe((value) => {
      if (value) {
        this.alumnoForm.get('email')?.enable();
      } else {
        this.alumnoForm.get('email')?.disable();
      }
    });

    this.alumnoForm.get('email')?.valueChanges.subscribe((value) => {
      if (value) {
        this.alumnoForm.get('contraseña')?.enable();
      } else {
        this.alumnoForm.get('contraseña')?.disable();
      }
    });
  }

  // Método auxiliar para obtener el último campo específico según el tipo de usuario
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
    Estatus: new FormControl(1, [Validators.required]), // Valor por defecto 1 para "activo"

    // Estudiante-specific fields
    matricula: new FormControl('', [
      Validators.required,
      Validators.pattern('^\\d{14}$'), // Valida exactamente 14 dígitos
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
      errors.missingSpecialChar =
        'Falta caracter especial: @, $, !, %, *, ?, &';
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

  onSubmit(): void {
    if (this.alumnoForm.valid) {
      const confirmDialogRef = this.dialog.open(ConfirmDialogComponent);

      confirmDialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const usuario: Usuarios = {
            id: this.data.id, // ID actual del usuario
            nombre: this.alumnoForm.value.nombre!,
            apellidoPaterno: this.alumnoForm.value.apellidoPaterno!,
            apellidoMaterno: this.alumnoForm.value.apellidoMaterno!,
            email: this.alumnoForm.value.email!,
            contraseña: this.alumnoForm.value.contraseña!,
            tipoUsuario: this.alumnoForm.value.tipoUsuario!,
            Estatus: this.alumnoForm.value.Estatus || 1,
            creationAt: this.data.creationAt, // Mantener la fecha de creación original
            updatedAt: new Date().toISOString(), // Actualizar la fecha de modificación
          };

          // Realizamos la solicitud PUT para actualizar los datos del usuario
          this.http
            .put<Usuarios>(
              `http://cecyte.test/api/Usuarios/${this.data.usuarioID}`,
              usuario
            )
            .subscribe({
              next: () => {
                if (this.alumnoForm.value.tipoUsuario === 'estudiante') {
                  this.updateEstudiante(this.data.id); // Pasamos usuarioID en lugar de id
                } else if (this.alumnoForm.value.tipoUsuario === 'profesor') {
                  this.updateProfesor(this.data.id); // Pasamos usuarioID en lugar de id
                } else if (this.alumnoForm.value.tipoUsuario === 'secretaria') {
                  this.updateAdministrativo(this.data.id); // Pasamos usuarioID en lugar de id
                }
              },
              error: () => alert('Error al actualizar los datos del usuario'),
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
    const filteredValue = input.value.replace(
      /[^a-zA-ZÀ-ÿ\u00f1\u00d1\s]/g,
      ''
    );
    input.value = filteredValue;
    this.alumnoForm
      .get(input.getAttribute('formControlName')!)
      ?.setValue(filteredValue);
  }
  allowOnlyNumbers(event: Event) {
    const input = event.target as HTMLInputElement;
    const filteredValue = input.value.replace(/[^0-9]/g, ''); // Permite solo números
    input.value = filteredValue;
    this.alumnoForm
      .get(input.getAttribute('formControlName')!)
      ?.setValue(filteredValue);
  }

  emailFormControl = this.alumnoForm.get('email') as FormControl;
  matcher = new MyErrorStateMatcher();

  private updateEstudiante(usuarioID: number): void {
    const estudiante: Estudiantes = {
      id: this.data.estudianteId, // Asegúrate de que `this.data.estudianteId` está definido
      usuarioID: this.data.usuarioID,
      matricula: this.alumnoForm.value.matricula!,
      semestre: parseInt(this.alumnoForm.value.semestre!, 10),
      creationAt: this.data.estudianteCreationAt,
      updatedAt: new Date().toISOString(),
    };

    this.http
      .put<Estudiantes>(
        `http://cecyte.test/api/Estudiantes/${this.data.estudianteId}`,
        estudiante
      )
      .subscribe({
        next: () => {
          alert('Estudiante actualizado con éxito');
          this.dialogRef.close();
        },
        error: () => alert('Error al actualizar los datos del estudiante'),
      });
  }

  private updateProfesor(usuarioID: number): void {
    const profesor: Profesores = {
      id: this.data.profesorId, // ID específico del profesor
      usuarioID: usuarioID, // Referencia al ID del usuario en el modelo Usuarios
      numeroEmpleado: this.alumnoForm.value.numeroEmpleado!,
      especialidad: this.alumnoForm.value.especialidad!,
      creationAt: this.data.profesorCreationAt, // Mantener la fecha de creación
      updatedAt: new Date().toISOString(), // Actualizar la fecha de modificación
    };

    this.http
      .put<Profesores>(
        `http://cecyte.test/api/Profesores/${this.data.profesorId}`,
        profesor
      )
      .subscribe({
        next: () => {
          alert('Profesor actualizado con éxito');
          this.dialogRef.close();
        },
        error: () => alert('Error al actualizar los datos del profesor'),
      });
  }

  private updateAdministrativo(usuarioID: number): void {
    const administrativo: Administrativos = {
      id: this.data.administrativoId, // ID específico del administrativo
      usuarioID: usuarioID, // Referencia al ID del usuario en el modelo Usuarios
      departamento: this.alumnoForm.value.departamento!,
      cargo: this.alumnoForm.value.cargo!,
      creationAt: this.data.administrativoCreationAt, // Mantener la fecha de creación
      updatedAt: new Date().toISOString(), // Actualizar la fecha de modificación
    };

    this.http
      .put<Administrativos>(
        `http://cecyte.test/api/Administrativos/${this.data.administrativoId}`,
        administrativo
      )
      .subscribe({
        next: () => {
          alert('Administrativo actualizado con éxito');
          this.dialogRef.close();
        },
        error: () => alert('Error al actualizar los datos del administrativo'),
      });
  }
}

// Segundo modal de confirmación
@Component({
  selector: 'app-confirm-estudiantes-dialog',
  templateUrl: './confirm-estudiantes.component.html',
  standalone: true,
  imports: [MatDialogTitle, MatDialogActions, MatButtonModule],
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
