// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuarios } from '../models/usuarios/usuarios.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  usuarios: Usuarios[] = [];
  private currentUserSubject = new BehaviorSubject<Usuarios | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  setUser(user: Usuarios) {
    this.currentUserSubject.next(user);
  }

  getUser(): Usuarios | null {
    return this.currentUserSubject.value;
  }

  clearUser() {
    this.currentUserSubject.next(null);
  }
  cargarUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>('http://cecyte.test/api/Usuarios');
  }
  cargarEstudiantes(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>('http://cecyte.test/api/Estudiantes');
  }
  cargarProfesores(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>('http://cecyte.test/api/Profesores');
  }
  cargarSecretarias(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>('http://cecyte.test/api/Administrativos');
  }
}
