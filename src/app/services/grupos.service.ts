import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Grupos } from '../models/grupos/grupos.model';

@Injectable({
  providedIn: 'root',
})
export class GruposService {
  private apiUrl = 'http://cecyte.test/api/Grupos';
  
  // Configuración de headers
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // Agrega aquí otros headers si son necesarios
    })
  };

  constructor(private http: HttpClient) {}

  getGrupos(): Observable<Grupos[]> {
    return this.http.get<Grupos[]>(this.apiUrl).pipe(
      tap(response => console.log('Grupos obtenidos:', response)),
      catchError(this.handleError)
    );
  }

  getGrupoById(id: number): Observable<Grupos> {
    return this.http.get<Grupos>(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Grupo obtenido:', response)),
      catchError(this.handleError)
    );
  }

  addGrupo(grupo: Grupos): Observable<Grupos> {
    // Asegurarse de que los datos están en el formato correcto
    const grupoToSend = {
      nombre: grupo.nombre,
      semestre: Number(grupo.semestre),
      cicloEscolar: grupo.cicloEscolar
    };

    console.log('Datos a enviar al servidor:', grupoToSend);

    return this.http.post<Grupos>(this.apiUrl, grupoToSend, this.httpOptions).pipe(
      tap(response => console.log('Respuesta del servidor:', response)),
      catchError(error => {
        console.error('Error en addGrupo:', error);
        console.error('Datos que causaron el error:', grupoToSend);
        if (error instanceof HttpErrorResponse) {
          console.error('Status:', error.status);
          console.error('Error body:', error.error);
        }
        return throwError(() => new Error(this.getErrorMessage(error)));
      })
    );
  }

  updateGrupo(id: number, grupo: Grupos): Observable<Grupos> {
    const grupoToUpdate = {
      nombre: grupo.nombre,
      semestre: Number(grupo.semestre),
      cicloEscolar: grupo.cicloEscolar
    };

    return this.http.put<Grupos>(`${this.apiUrl}/${id}`, grupoToUpdate, this.httpOptions).pipe(
      tap(response => console.log('Grupo actualizado:', response)),
      catchError(this.handleError)
    );
  }

  deleteGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, this.httpOptions).pipe(
      tap(() => console.log('Grupo eliminado:', id)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error completo:', error);
    return throwError(() => new Error(this.getErrorMessage(error)));
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      // Error del cliente
      return `Error del cliente: ${error.error.message}`;
    } else {
      // Error del servidor
      let message = `Error del servidor: ${error.status}`;
      // Intentar extraer mensaje de error del backend si existe
      if (error.error?.message) {
        message += ` - ${error.error.message}`;
      } else if (typeof error.error === 'string') {
        message += ` - ${error.error}`;
      } else if (error.message) {
        message += ` - ${error.message}`;
      }
      return message;
    }
  }
}