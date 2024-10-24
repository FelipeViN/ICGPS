import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { LoginComponent } from '../../component/login/login.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterOutlet, LoginComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
})
export default class LoginPageComponent {
  title = 'iniciar-sesion';
}