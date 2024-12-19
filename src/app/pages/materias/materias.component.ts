import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';

interface Materia {
  clave: string;
  nombre: string;
  grupo?: string;
  semestre: number;
  creditos: number;
  descripcion: string;
  visible?: boolean; // Nuevo campo para filtrar visibilidad
}


@Component({
  selector: 'app-materias',
  standalone: true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, ToolbarComponent],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css'],
})
export default class MateriasComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  materias: Materia[] = [];
  paginatedMaterias: Materia[] = [];
  filtro: string = '';
  itemsPerPage: number = 8;

  modalAbierto = false;
  modalDetalleAbierto = false;
  nuevaMateria: Materia = {
    clave: '',
    nombre: '',
    semestre: 1,
    creditos: 3,
    descripcion: '',
  };
  materiaSeleccionada: Materia | null = null;

  private apiUrl = 'http://127.0.0.1:8000/api/Materias'; // URL de tu API

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerMaterias();
  }

  ngAfterViewInit(): void {
    this.updatePaginatedMaterias();
  }

  obtenerMaterias(): void {
    this.http.get<Materia[]>(this.apiUrl).subscribe(
      (data) => {
        // Filtra solo las materias visibles para la lista principal
        this.materias = data.filter((materia) => materia.visible !== false);
        this.updatePaginatedMaterias();
      },
      (error) => console.error('Error al obtener materias:', error)
    );
  }
  
  

  updatePaginatedMaterias(): void {
    const startIndex = (this.paginator?.pageIndex || 0) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedMaterias = this.materias.slice(startIndex, endIndex);
  }

  buscarMateria(): void {
    const filtroNormalizado = this.filtro.toLowerCase();
    this.paginatedMaterias = this.materias.filter((materia) =>
      materia.nombre.toLowerCase().includes(filtroNormalizado)
    );
  }

  buscarMateriaPorClave(): void {
    if (this.modoEdicion || !this.nuevaMateria.clave.trim()) {
      return; // Evita buscar si estás en modo edición o si clave está vacío
    }
  
    const clave = this.nuevaMateria.clave.trim().toUpperCase();
    console.log('Buscando clave:', clave); // Verifica la clave enviada
  
    this.http.get<Materia>(`${this.apiUrl}/clave/${clave}`).subscribe(
      (materia) => {
        console.log('Materia encontrada:', materia);
        // Llena automáticamente los campos con la información de la materia encontrada
        this.nuevaMateria = { ...materia, visible: true }; // Forzar visible = 1
      },
      (error) => {
        console.warn('Clave no encontrada, puedes agregar una materia nueva.');
        // Si no se encuentra, deja los campos vacíos para agregar una nueva
        this.nuevaMateria.nombre = '';
        this.nuevaMateria.semestre = 0;
        this.nuevaMateria.creditos = 0;
        this.nuevaMateria.descripcion = '';
      }
    );
  }
  



// Abrir modal para agregar una nueva materia
abrirModal(): void {
  this.modoEdicion = false; // Modo agregar: deshabilita todos excepto "clave"
  this.modalAbierto = true;
  this.nuevaMateria = {
    clave: '',
    nombre: '',
    semestre: 0,
    creditos: 0,
    descripcion: '',
  };
}

  cerrarModal(): void {
    this.modalAbierto = false;
    this.nuevaMateria = {
      clave: '',
      nombre: '',
      semestre: 0,
      creditos: 0,
      descripcion: '',
    };
  }

  guardarMateria(): void {
    if (this.modoEdicion && this.nuevaMateria.clave) {
      // Si estamos en modo edición, actualiza la materia
      this.http.put(`${this.apiUrl}/${this.nuevaMateria.clave}`, this.nuevaMateria).subscribe(
        (response) => {
          console.log('Materia actualizada correctamente:', response);
  
          // Actualiza la lista de materias
          this.obtenerMaterias();
  
          // Refresca el modal de detalles si está abierto
          if (this.materiaSeleccionada && this.materiaSeleccionada.clave === this.nuevaMateria.clave) {
            this.materiaSeleccionada = { ...this.nuevaMateria }; // Actualiza la materia seleccionada
          }
  
          this.cerrarModal(); // Cierra el modal de edición
        },
        (error) => console.error('Error al actualizar materia:', error)
      );
    } else {
      // Si no estamos en edición, creamos una nueva materia
      this.http.post<Materia>(this.apiUrl, this.nuevaMateria).subscribe(
        (materia) => {
          console.log('Materia agregada correctamente:', materia);
          this.obtenerMaterias();
          this.cerrarModal();
        },
        (error) => console.error('Error al agregar materia:', error)
      );
    }
  }
  
  
  modoEdicion: boolean = false; // Asegura el tipo

  // Abrir modal para editar una materia existente
abrirModalEditar(materia: Materia): void {
  this.modoEdicion = true; // Modo editar: habilita todos los campos
  this.modalAbierto = true;

  // Cargar los datos de la materia en el formulario
  this.nuevaMateria = { ...materia };
}
  

  abrirDetalleMateria(materia: Materia): void {
    this.materiaSeleccionada = materia;
    this.modalDetalleAbierto = true;
  }

  cerrarModalDetalle(): void {
    this.modalDetalleAbierto = false;
    this.materiaSeleccionada = null;
  }

  asignarHorario(): void {
    if (this.materiaSeleccionada) {
      console.log('Asignar horario a:', this.materiaSeleccionada);
    }
  }

  eliminarMateria(): void {
    if (this.materiaSeleccionada) {
      // Realiza una petición DELETE a la API
      this.http.delete(`${this.apiUrl}/${this.materiaSeleccionada.clave}`).subscribe(
        () => {
          console.log('Materia marcada como no visible en la base de datos');
          // Actualizar la lista de materias tras el cambio
          this.obtenerMaterias(); // Recargar materias desde la API
          this.cerrarModalDetalle();
        },
        (error) => {
          console.error('Error al dar de baja la materia:', error);
          alert('Error al dar de baja la materia. Intenta nuevamente.');
        }
      );
    }
  }
  
}
