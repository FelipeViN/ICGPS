import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';

interface MateriaHorario {
  hora: string;
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
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
  dataSource = new MatTableDataSource<any>([]);

  // Controla la pestaña activa
  activeTab: string = 'materias';

  // Propiedades
  filtro: string = ''; // Filtro de búsqueda
  materiaSeleccionada: any = null; // Detalles de la materia seleccionada
  itemsPerPage: number = 8; // Materias por página
  materias: any[] = []; // Array de materias para paginar
  paginatedMaterias: any[] = []; // Array de materias para paginación

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
  generateExampleMaterias(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      nombre: `Materia ${i + 1}`,
      profesor: `Profesor ${i + 1}`,
      grupo: `Grupo ${(i % 6) + 1}`,
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

  // Ver detalles de una materia
  verDetalle(materia: any) {
    this.materiaSeleccionada = materia;
    console.log('Ver detalles:', materia);
  }

  // Agregar una nueva materia
  agregarMateria() {
    console.log('Agregar materia');
  }

  cerrarModal() {
    this.materiaSeleccionada = null;
  }
}
