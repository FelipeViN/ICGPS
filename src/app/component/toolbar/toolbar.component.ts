import { ChangeDetectionStrategy,Component } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatButtonModule, MatSidenavModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  constructor(private router: Router) {}
  irBienvenida(){
    window.location.href = '/bienvenida';
  }
  irInicioSesion(){
    window.location.href = '/iniciar-sesion';
  }
  irDatosPersonales(){
    window.location.href = '/datosPersonales';
  }
  irAlumnos(){
    window.location.href = '/alumnos';
  }
  irProfesores(){
    window.location.href = '/profesores';
  }
  irMaterias(){
    window.location.href = '/materias';
  }
  irGrupos(){
    window.location.href = '/grupos';
  }
  irMapa(){
    window.location.href = '/mapa';
  }
  irCredencial(){
    window.location.href = '/credencial';
  }
}
