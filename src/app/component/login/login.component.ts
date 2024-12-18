import {
  ChangeDetectionStrategy,
  Component,
  signal,
  Input,
  inject,
  OnInit,
  Output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../../models/usuarios/usuarios.model'
import { Observable } from 'rxjs';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService) {}
  // obteniendo a los usuarios de la api
  hide = signal(true);
  @Input() usuario!: Usuarios; // No sé que hace exactamente

  // variable http que es un tipo de inyeccion http
  http = inject(HttpClient);
  // indicamos un arreglo de Usuarios llamado usuarios
  usuarios: Usuarios[] = [];

  // Confirma de que haya datos validos, puede estar vacio
  ngOnInit() {
    this.loadUsers().subscribe((data) => {
      this.usuarios = data;
    });
  }
  
  // obteniendo a los usuarios de la api, el "get" indica el tipo de metodo http
  // el link es literalmente el link de la api
  loadUsers(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>('http://127.0.0.1:8000/api/Usuarios');
  }

  //metodo ts que usaremos en la Interfaz de Usuario
  iniciarSesion() {
    //Sacamos los valores de la Interfaz de Usuario, es muy similar a JS.
    let usrInput = document.getElementById('usernameInput') as HTMLInputElement | null;
    let passInput = document.getElementById('passwordInput') as HTMLInputElement | null;

    // Confirma que los campos no esten vacios
    if (usrInput?.value.trim() === '' || passInput?.value.trim() === '') {
      //Envia una alerta, es algo fea pero funciona.
      alert('Fields can\'t be empty');
      return;
    }

    // Devuelve al usuario en caso de encontrarlo
    let user = this.usuarios.find(
      user => user.email === usrInput?.value && user.contraseña === passInput?.value
    );
    // Comprueba que la variable user no este vacia, en caso de ser undefined hace otra cosa
    if (user) { 
      // Redirecciona a otra pagina dentro de la aplicacion web
      alert(user.email+''+user.contraseña);
      window.location.href = '/bienvenida';
    } else {
      // Envia una alerta de que las credenciales son invalidas
      console.log(user);
      alert('Invalid credentials');
    }
  }
  
  // Ni me acuerdo que hace esto
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  irBienvenida(){
    window.location.href = '/bienvenida';
  }
  // no se por que no funciona el de arriba pero este si, en todo caso fijense mas en este xd
  pruebaBoton(){
    let usrInput = document.getElementById('usernameInput') as HTMLInputElement | null;
    let passInput = document.getElementById('passwordInput') as HTMLInputElement | null;
    console.log(usrInput?.value);
    console.log(passInput?.value);
    let user = this.usuarios.find(
      user => user.email === usrInput?.value && user.contraseña === passInput?.value
    );
    console.log(user?.nombre);
    if(user){
      console.log("Hay algo");
      this.authService.setUser(user);
      console.log(this.authService.currentUser$, 'esto es');
      window.location.href = '/bienvenida';
    } else {
      console.log("No hay algo");
      alert("Credenciales invalidas");
      window.location.href = '/iniciar-sesion';
    }
  }
}