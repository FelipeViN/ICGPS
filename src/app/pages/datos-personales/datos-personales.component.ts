import { Component, OnInit } from '@angular/core';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';

@Component({
  selector: 'app-datos-personales',
  standalone: true,
  imports: [ToolbarComponent],
  templateUrl: './datos-personales.component.html',
  styleUrls: ['./datos-personales.component.css'] // Corregido de 'styleUrl' a 'styleUrls'
})
export default class DatosPersonalesComponent implements OnInit {
  title = "datosPersonales";

  // Inicializamos todas las propiedades con valores vacíos
  nombre: string = '';
  curp: string = '';
  fechaNacimiento: string = '';
  genero: string = '';
  estadoCivil: string = '';
  telefono: string = '';
  correoElectronico: string = '';
  servicioMedico: string = '';
  numeroControl: string = '';
  estatus: string = '';
  semestre: string = '';
  cveCarrera: string = '';
  carrera: string = '';
  especialidad: string = '';
  planEstudios: string = '';
  calleNumero: string = '';
  colonia: string = '';
  codigoPostal: string = '';
  municipio: string = '';
  estado: string = '';

  constructor() {}

  ngOnInit(): void {
    // Aquí puedes cargar los datos reales de una API si lo necesitas
  }
}
