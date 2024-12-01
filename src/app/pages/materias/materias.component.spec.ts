import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface Materia {
  id?: number;
  clave: string,
  nombre: string;
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
  ],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'],
})
export default class MateriasComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<Materia>([]); // Fuente de datos para el paginador
  activeTab: string = 'materias'; // Pestaña activa
  filtro: string = ''; // Filtro de búsqueda
  itemsPerPage: number = 8; // Materias por página

  materias: Materia[] = []; // Array de materias
  paginatedMaterias: Materia[] = []; // Materias paginadas
  modalAbierto = false; // Modal de agregar materia
  nuevaMateria: Materia = { nombre: '', grupo: '', semestre: 1, creditos: 3, clave:'' };
  profesores: string[] = ['Profesor 1', 'Profesor 2', 'Profesor 3']; // Lista de profesores
  modalDetalleAbierto = false; // Modal de detalles
  materiaSeleccionada: Materia | null = null; // Materia seleccionada

  private apiUrl = 'https://tu-api-url.com/materias'; // Reemplaza con la URL de tu API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerMaterias(); // Cargar materias al iniciar
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Cambiar pestaña activa
  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  // Obtener materias desde la API
  obtenerMaterias(): void {
    this.http.get<Materia[]>(this.apiUrl).subscribe(
      (data) => {
        this.materias = data;
        this.dataSource.data = this.materias;
        this.updatePaginatedMaterias();
      },
      (error) => console.error('Error al obtener materias:', error)
    );
  }

  // Actualizar materias paginadas
  updatePaginatedMaterias(): void {
    const startIndex = (this.dataSource.paginator?.pageIndex || 0) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMaterias = this.materias.slice(startIndex, endIndex);
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
    this.nuevaMateria = { nombre: '', grupo: '', semestre: 1, creditos: 3, clave:'' };
  }

  agregarNuevaMateria(): void {
    this.http.post<Materia>(this.apiUrl, this.nuevaMateria).subscribe(
      (materia) => {
        this.materias.push(materia);
        this.dataSource.data = this.materias;
        this.updatePaginatedMaterias();
        this.cerrarModal();
      },
      (error) => console.error('Error al agregar materia:', error)
    );
  }

  abrirDetalleMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.modalDetalleAbierto = true;
  }

  cerrarModalDetalle(): void {
    this.modalDetalleAbierto = false;
    this.materiaSeleccionada = null;
  }

  editarMateria(): void {
    if (this.materiaSeleccionada) {
      console.log('Modificar materia:', this.materiaSeleccionada);
      // Implementa aquí la lógica de edición
    }
  }

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

  asignarHorario(): void {
    if (this.materiaSeleccionada) {
      console.log('Asignar horario a:', this.materiaSeleccionada);
      // Implementa aquí la lógica de asignación de horario
    }
  }
  
}
