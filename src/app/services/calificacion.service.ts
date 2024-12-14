import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalificacionService {
  private apiUrl = 'http://cecyte.test/api/calificaciones'; // Cambiar por tu endpoint

  constructor(private http: HttpClient) {}

  getCalificaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  addCalificacion(calificacion: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, calificacion);
  }

  updateCalificacion(id: number, calificacion: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, calificacion);
  }

  deleteCalificacion(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
