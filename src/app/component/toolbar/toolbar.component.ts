import { ChangeDetectionStrategy,Component,OnInit } from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Usuarios } from '../../models/usuarios/usuarios.model';



@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MatButtonModule, MatSidenavModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent implements OnInit{
  usuarioAutenticado: Usuarios | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.usuarioAutenticado = user;
      console.log("Usuario autenticado:", this.usuarioAutenticado);
    });
  }
  irBienvenida(){
   window.location.href = '/bienvenida';
  }
  irInicioSesion(){
    this.authService.clearUser(); 
    window.location.href = '/iniciar-sesion';
  }
  irDatosPersonales(){
    window.location.href = '/datosPersonales';
  }
  irUsuarios(){
    window.location.href = '/usuarios';
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
    window.location.href = '/reportes';
  }
}
