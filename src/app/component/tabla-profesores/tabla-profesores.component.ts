import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Profesores } from '../../models/profesores/profesores.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla-profesores',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule],
  templateUrl: './tabla-profesores.component.html',
  styleUrls: ['./tabla-profesores.component.css']
})
export class TablaProfesoresComponent implements OnInit {
  displayedColumns: string[] = ['numeroEmpleado', 'especialidad', 'actions'];
  dataSource = new MatTableDataSource<Profesores>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProfesores();
  }

  loadProfesores(): void {
    this.http.get<Profesores[]>('http://cecyte.test/api/Profesores').subscribe((profesores) => {
      this.dataSource.data = profesores;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
