import {
  ChangeDetectionStrategy,
  Component,
  signal,
  Input,
  inject,
  OnInit
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { HttpClient } from '@angular/common/http';
import { People } from '../../models/people/people.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatFormFieldModule,
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
  hide = signal(true);
  @Input() people!: People;

  http = inject(HttpClient);
  peoples: People[] = [];

  ngOnInit() {
    this.loadUsers().subscribe((data) => {
      this.peoples = data;
    });
  }

  loadUsers(): Observable<People[]> {
    return this.http.get<People[]>('https://api.escuelajs.co/api/v1/users');
  }

  iniciarSesion() {
    let usrInput = document.getElementById('usernameInput') as HTMLInputElement | null;
    let passInput = document.getElementById('passwordInput') as HTMLInputElement | null;

    if (usrInput?.value.trim() === '' || passInput?.value.trim() === '') {
      alert('Fields can\'t be empty');
      return;
    }

    // devuelve al usuario en caso de encontrarlo
    let user = this.peoples.find(
      user => user.email === usrInput?.value && user.password === passInput?.value
    );
    //comprueba que la variable user no este vacia, en caso de ser undefined hace otra cosa
    if (user) {
      console.log(user);
      console.log('Login successful');
     window.location.href = '/welcome';
    } else {
      console.log(user);
      alert('Invalid credentials');
    }
  }

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
}