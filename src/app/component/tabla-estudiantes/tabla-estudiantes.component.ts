import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { Estudiantes } from '../../models/estudiantes/estudiantes.model';
import { UsuarioEstudiante } from '../../models/usuario-estudiante/usuario-estudiante.model';

@Component({
  selector: 'app-tabla-estudiantes',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule],
  templateUrl: './tabla-estudiantes.component.html',
  styleUrls: ['./tabla-estudiantes.component.css']
})
export class TablaEstudiantesComponent implements OnInit {
  displayedColumns: string[] = ['matricula', 'nombre', 'email', 'semestre']; // Reemplazado 'id' por 'matricula'
  dataSource = new MatTableDataSource<UsuarioEstudiante>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadEstudiantes();
  }

  loadEstudiantes(): void {
    this.http.get<Usuarios[]>('http://cecyte.test/api/Usuarios').subscribe((usuarios) => {
      const estudiantes = usuarios.filter(usuario => usuario.tipoUsuario === 'estudiante');
      
      this.http.get<Estudiantes[]>('http://cecyte.test/api/Estudiantes').subscribe((estudiantesData) => {
        const estudiantesCompletos: UsuarioEstudiante[] = estudiantes.map(est => {
          const estudianteData = estudiantesData.find(e => e.usuarioID === est.id);
          return {
            ...est,
            matricula: estudianteData?.matricula,
            semestre: estudianteData?.semestre,
          };
        });

        this.dataSource.data = estudiantesCompletos;
      });
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
