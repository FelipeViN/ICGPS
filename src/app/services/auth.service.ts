// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Usuarios } from '../models/usuarios/usuarios.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
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
}
