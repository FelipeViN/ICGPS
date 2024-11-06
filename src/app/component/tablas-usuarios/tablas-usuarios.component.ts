import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { TablaEstudiantesComponent } from '../tabla-estudiantes/tabla-estudiantes.component';

@Component({
  selector: 'app-tablas-usuarios',
  standalone: true,
  imports: [MatTabsModule, TablaEstudiantesComponent],
  templateUrl: './tablas-usuarios.component.html',
  styleUrl: './tablas-usuarios.component.css'
})
export class TablasUsuariosComponent {

}
