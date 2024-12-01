import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { MatDialogModule } from '@angular/material/dialog';

interface Materia {
  id?: number;
  nombre: string;
  clave: string;
  grupo: string;
  semestre: number;
  creditos: number;
}

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    ToolbarComponent,
    MatDialogModule
  ],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'],
})
export default class MateriasComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Materia>([]); // Datos para el paginador
  filtro: string = ''; // Filtro de búsqueda
  itemsPerPage: number = 8; // Materias por página

  materias: Materia[] = []; // Lista de materias
  paginatedMaterias: Materia[] = []; // Materias paginadas
  modalAbierto = false; // Estado del modal para agregar materia
  nuevaMateria: Materia = { nombre: '', clave: '', grupo: '', semestre: 1, creditos: 3 }; // Datos para nueva materia
  modalDetalleAbierto = false; // Estado del modal para detalles de materia
  materiaSeleccionada: Materia | null = null; // Materia seleccionada para detalles

  private apiUrl = 'http://127.0.0.1:8000/api/Materias'; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerMaterias(); // Cargar las materias al iniciar
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Obtener las materias desde la API
  obtenerMaterias(): void {
    this.http.get<Materia[]>(this.apiUrl).subscribe(
      (data) => {
        console.log('Datos recibidos de la API:', data); // Verifica que clave esté presente
        this.materias = data;
        this.dataSource.data = this.materias;
        this.updatePaginatedMaterias();
      },
      (error) => console.error('Error al obtener materias:', error)
    );
  }

  // Actualizar las materias para paginación
  updatePaginatedMaterias(): void {
    const startIndex = (this.dataSource.paginator?.pageIndex || 0) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMaterias = this.materias.slice(startIndex, endIndex);
  }

  profesores: string[] = []; // Lista vacía de profesores

  asignarHorario(): void {
    if (this.materiaSeleccionada) {
      console.log('Asignar horario a:', this.materiaSeleccionada);
      // Agrega aquí la lógica para asignar horarios, si es necesario en el futuro.
    }
  }

  // Filtrar materias
  buscarMateria(): void {
    const filtroNormalizado = this.filtro.toLowerCase();
    this.paginatedMaterias = this.materias.filter((materia) =>
      materia.nombre.toLowerCase().includes(filtroNormalizado)
    );
  }

  // Abrir modal para agregar materia
  abrirModal(): void {
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.nuevaMateria = { nombre: '', clave: '', grupo: '', semestre: 1, creditos: 3 };
  }

  agregarNuevaMateria(): void {
    // Verifica que todos los campos estén completos
    if (!this.nuevaMateria.nombre || !this.nuevaMateria.clave || !this.nuevaMateria.creditos || !this.nuevaMateria.semestre) {
      console.error('Faltan campos requeridos');
      return;
    }
  
    // Realiza la solicitud POST para agregar la materia
    this.http.post<any>(this.apiUrl, this.nuevaMateria).subscribe(
      (response) => {
        console.log('Materia agregada:', response);  // Puedes ver la respuesta aquí
        // Si la respuesta es exitosa, agrega la nueva materia al array y actualiza la vista
        this.materias.push(response.data);
        this.dataSource.data = this.materias; // Actualiza los datos de la tabla
        this.updatePaginatedMaterias();  // Actualiza las materias paginadas
        this.cerrarModal();  // Cierra el modal después de agregar
      },
      (error) => {
        console.error('Error al agregar materia:', error);  // Si ocurre un error, lo mostramos
        alert('Hubo un problema al agregar la materia. Intenta nuevamente.');
      }
    );
  }
  

  // Abrir detalles de una materia
  abrirDetalleMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.modalDetalleAbierto = true;
  }

  cerrarModalDetalle(): void {
    this.modalDetalleAbierto = false;
    this.materiaSeleccionada = null;
  }

  // Editar materia seleccionada
  editarMateria(): void {
    if (this.materiaSeleccionada) {
      console.log('Editar materia:', this.materiaSeleccionada);
      // Lógica de edición aquí
    }
  }

  // Eliminar materia seleccionada
  eliminarMateria(): void {
    if (this.materiaSeleccionada) {
      this.http.delete(`${this.apiUrl}/${this.materiaSeleccionada.id}`).subscribe(
        () => {
          this.materias = this.materias.filter(m => m.id !== this.materiaSeleccionada?.id);
          this.dataSource.data = this.materias;
          this.updatePaginatedMaterias();
          this.cerrarModalDetalle();
        },
        (error) => console.error('Error al eliminar materia:', error)
      );
    }
  }

  actualizarMateria(): void {
    if (!this.materiaSeleccionada) {
      console.error('No hay materia seleccionada para actualizar');
      return;
    }
    this.http.put<any>(`${this.apiUrl}/${this.materiaSeleccionada.id}`, this.materiaSeleccionada)
      .subscribe((response) => {
        console.log('Materia actualizada:', response);
        // Actualizar datos después de la actualización
        const index = this.materias.findIndex(m => m.id === this.materiaSeleccionada!.id);
        if (index !== -1) {
          this.materias[index] = this.materiaSeleccionada!;  // Se actualiza la materia
          this.dataSource.data = this.materias;
          this.updatePaginatedMaterias();
          this.cerrarModalDetalle();
        }
      }, (error) => {
        console.error('Error al actualizar materia:', error);
        alert('Hubo un problema al actualizar la materia. Intenta nuevamente.');
      });
  }

  // Abrir el modal para mostrar los detalles de la materia y permitir su edición
  abrirModalDetalle(materia: Materia): void {
    this.materiaSeleccionada = { ...materia };  // Hacemos una copia de la materia seleccionada
    this.modalDetalleAbierto = true;
  }
}
