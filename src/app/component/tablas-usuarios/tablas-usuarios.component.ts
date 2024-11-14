import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { TablaEstudiantesComponent } from '../tabla-estudiantes/tabla-estudiantes.component';
import { TablaProfesoresComponent } from "../tabla-profesores/tabla-profesores.component";
import { TablaAdministrativosComponent } from "../tabla-administrativos/tabla-administrativos.component";

@Component({
  selector: 'app-tablas-usuarios',
  standalone: true,
  imports: [MatTabsModule, TablaEstudiantesComponent, TablaProfesoresComponent, TablaAdministrativosComponent],
  templateUrl: './tablas-usuarios.component.html',
  styleUrl: './tablas-usuarios.component.css'
})
export class TablasUsuariosComponent {

}
