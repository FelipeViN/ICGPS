import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';

interface Materia {
  nombre: string;
  profesor: string;
  grupo: string;
  semestre: number;
}

@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, ToolbarComponent],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'],
})
export default class MateriasComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  // Fuente de datos para el paginador
  dataSource = new MatTableDataSource<Materia>([]);

  // Controla la pestaña activa
  activeTab: string = 'materias';

  // Propiedades generales
  filtro: string = ''; // Filtro de búsqueda
  itemsPerPage: number = 8; // Materias por página
  materias: Materia[] = []; // Array de materias para paginar
  paginatedMaterias: Materia[] = []; // Array de materias para paginación

  // Modal para agregar nueva materia
  modalAbierto = false;
  nuevaMateria: Materia = {
    nombre: '',
    profesor: '',
    grupo: '',
    semestre: 1,
  };

  // Lista temporal de profesores (puede reemplazarse con datos de una API)
  profesores: string[] = ['Profesor 1', 'Profesor 2', 'Profesor 3'];

  // Modal para detalles de la materia
  modalDetalleAbierto = false;
  materiaSeleccionada: Materia | null = null;

  constructor() {
    // Generar datos de ejemplo para el paginador
    this.materias = this.generateExampleMaterias(6);
    this.dataSource.data = this.materias;
    this.updatePaginatedMaterias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Generar materias de ejemplo
  generateExampleMaterias(count: number): Materia[] {
    return Array.from({ length: count }, (_, i) => ({
      nombre: `Materia ${i + 1}`,
      profesor: `Profesor ${i + 1}`,
      grupo: `Grupo ${(i % 3) + 1}`,
      semestre: (i % 8) + 1,
    }));
  }

  // Actualiza la lista de materias en función de la página actual
  updatePaginatedMaterias() {
    const startIndex = (this.dataSource.paginator?.pageIndex || 0) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMaterias = this.materias.slice(startIndex, endIndex);
  }

  // Alternar entre pestañas
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  // Buscar materia
  buscarMateria() {
    console.log('Buscar materia:', this.filtro);
  }

  // Abrir el modal para agregar materia
  abrirModal() {
    this.modalAbierto = true;
  }

  // Cerrar el modal para agregar materia
  cerrarModal() {
    this.modalAbierto = false;
    this.nuevaMateria = { nombre: '', profesor: '', grupo: '', semestre: 1 }; // Reiniciar formulario
  }

  // Agregar una nueva materia
  agregarNuevaMateria() {
    console.log('Nueva materia agregada:', this.nuevaMateria);
    this.materias.push({ ...this.nuevaMateria });
    this.dataSource.data = this.materias;
    this.updatePaginatedMaterias();
    this.cerrarModal();
  }

  // Abrir detalles de la materia
  abrirDetalleMateria(materia: Materia) {
    this.materiaSeleccionada = materia;
    this.modalDetalleAbierto = true;
  }

  // Cerrar detalles de la materia
  cerrarModalDetalle() {
    this.materiaSeleccionada = null;
    this.modalDetalleAbierto = false;
  }

  // Editar materia
  editarMateria() {
    if (this.materiaSeleccionada) {
      console.log('Modificar materia:', this.materiaSeleccionada);
      // Lógica para modificar la materia
    }
  }

  // Eliminar materia
  eliminarMateria() {
    if (this.materiaSeleccionada) {
      this.materias = this.materias.filter(m => m !== this.materiaSeleccionada);
      this.dataSource.data = this.materias;
      this.updatePaginatedMaterias();
      this.cerrarModalDetalle();
      console.log('Materia eliminada:', this.materiaSeleccionada);
    }
  }

  // Asignar horario a la materia
  asignarHorario() {
    if (this.materiaSeleccionada) {
      console.log('Asignar horario a:', this.materiaSeleccionada);
      // Lógica para asignar horario
    }
  }
}
