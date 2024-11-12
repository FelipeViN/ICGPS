import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Profesores } from '../../models/profesores/profesores.model';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla-profesores',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule],
  templateUrl: './tabla-profesores.component.html',
  styleUrls: ['./tabla-profesores.component.css']
})
export class TablaProfesoresComponent implements OnInit {
  displayedColumns: string[] = [ 'numeroEmpleado', 'nombreCompleto', 'especialidad', 'actions'];
  dataSource = new MatTableDataSource<any>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.http.get<Usuarios[]>('http://cecyte.test/api/Usuarios').subscribe((usuarios) => {
      const profesores = usuarios.filter(usuario => usuario.tipoUsuario === 'profesor' && usuario.Estatus === 1);
  
      this.http.get<Profesores[]>('http://cecyte.test/api/Profesores').subscribe((profesoresData) => {
        const profesoresCompletos = profesores.map(prof => {
          const profesorData = profesoresData.find(p => p.usuarioID === prof.id);
          return {
            ...prof,
            usuarioID: prof.id,
            numeroEmpleado: profesorData?.numeroEmpleado,
            especialidad: profesorData?.especialidad,
          };
        });
  
        this.dataSource.data = profesoresCompletos;
      });
    });
  }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  borrar(id: number): void {
    const url = `http://cecyte.test/api/Usuarios/${id}`;
  
    // Obtener los datos actuales del usuario
    this.http.get<Usuarios>(url).subscribe(usuario => {
      // Actualizar solo el campo Estatus a 0, manteniendo los demás campos iguales
      const usuarioActualizado = {
        nombre: usuario.nombre,
        apellidoPaterno: usuario.apellidoPaterno,
        apellidoMaterno: usuario.apellidoMaterno,
        email: usuario.email,
        contraseña: usuario.contraseña,
        tipoUsuario: usuario.tipoUsuario,
        Estatus: 0  // Cambiamos el estado a 0
      };
  
      // Enviar la actualización con todos los campos requeridos
      this.http.put(url, usuarioActualizado).subscribe(() => {
        this.loadProfesores();  // Actualizar la tabla de profesores
      });
    });
  }
}
