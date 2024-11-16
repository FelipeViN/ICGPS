import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Administrativos } from '../../models/administrativos/administrativos.model';
import { Usuarios } from '../../models/usuarios/usuarios.model';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { BorrarUsuariosComponent } from '../borrar-usuarios/borrar-usuarios.component';
import { ActualizarUsuariosComponent } from '../actualizar-usuarios/actualizar-usuarios.component';

interface AdministrativoCompleto extends Administrativos {
  nombreCompleto: string;
}

@Component({
  selector: 'app-tabla-administrativos',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule, MatPaginatorModule, BorrarUsuariosComponent, ActualizarUsuariosComponent],
  templateUrl: './tabla-administrativos.component.html',
  styleUrls: ['./tabla-administrativos.component.css']
})
export class TablaAdministrativosComponent implements OnInit {
  displayedColumns: string[] = ['departamento', 'nombreCompleto', 'cargo', 'actions'];
  dataSource = new MatTableDataSource<AdministrativoCompleto>([]);

  //Esta pequeña seccion hace que funcione el paginator
// INICIO DE LA SECCION
@ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;

ngAfterViewInit(){
  this.dataSource = new MatTableDataSource(this.dataSource.data);
  this.dataSource.paginator = this.paginator;
}
// FIN DE LA SECCION

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAdministrativos();
  }

  loadAdministrativos(): void {
    this.http.get<Usuarios[]>('http://cecyte.test/api/Usuarios').subscribe((usuarios) => {
      // Filtramos solo los usuarios con tipo 'administrativo' y Estatus 1
      const administrativos = usuarios.filter(usuario => usuario.tipoUsuario === 'secretaria' && usuario.Estatus === 1);
  
      this.http.get<Administrativos[]>('http://cecyte.test/api/Administrativos').subscribe((administrativosData) => {
        const administrativosCompletos = administrativos.map(admin => {
          const administrativoData = administrativosData.find(a => a.usuarioID === admin.id);
          
          return {
            usuarioID: admin.id,
            nombreCompleto: `${admin.nombre} ${admin.apellidoPaterno} ${admin.apellidoMaterno}`,
            departamento: administrativoData?.departamento ?? '',
            cargo: administrativoData?.cargo ?? '',
            id: administrativoData?.id ?? 0,
            creationAt: administrativoData?.creationAt ?? '',
            updatedAt: administrativoData?.updatedAt ?? ''
          };
        });
  
        this.dataSource.data = administrativosCompletos;
      });
    });
  }
  

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  borrar(id: number): void {
    console.log(id);
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
        this.loadAdministrativos();
      });
    });
  }
}
