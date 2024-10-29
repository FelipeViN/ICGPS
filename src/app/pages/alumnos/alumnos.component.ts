import { Component } from '@angular/core';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { TablaAlumnosComponent } from '../../component/tabla-alumnos/tabla-alumnos.component';

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [ToolbarComponent, TablaAlumnosComponent],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export default class AlumnosComponent {

}
