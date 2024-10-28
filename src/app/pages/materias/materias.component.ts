import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.css']
})
export default class MateriasComponent {
  // Controla la pestaña activa
  activeTab: string = 'materias';

  // Inicializamos `materias` y `materiasHorario` como arreglos vacíos
  materias: any[] = [];  
  materiasHorario: MateriaHorario[] = []; 

  // Función para alternar entre las vistas de "Materias" y "Horario"
  setActiveTab(tab: string) {
    this.activeTab = tab;
  }
}
