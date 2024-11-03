import { Component } from '@angular/core';
import { ToolbarComponent } from '../../component/toolbar/toolbar.component';
import { TablaAlumnosComponent } from '../../component/tabla-alumnos/tabla-alumnos.component';
import { ModalAlumnosComponent } from "../../component/modal-alumnos/card-alumnos.component";

@Component({
  selector: 'app-alumnos',
  standalone: true,
  imports: [ToolbarComponent, TablaAlumnosComponent, ModalAlumnosComponent],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export default class AlumnosComponent {

}
