import { Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClient } from '@angular/common/http';
import { Administrativos } from '../../models/administrativos/administrativos.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tabla-administrativos',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatButtonModule],
  templateUrl: './tabla-administrativos.component.html',
  styleUrls: ['./tabla-administrativos.component.css']
})
export class TablaAdministrativosComponent implements OnInit {
  displayedColumns: string[] = ['departamento', 'cargo', 'actions'];
  dataSource = new MatTableDataSource<Administrativos>([]);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAdministrativos();
  }

  loadAdministrativos(): void {
    this.http.get<Administrativos[]>('http://cecyte.test/api/Administrativos').subscribe((administrativos) => {
      this.dataSource.data = administrativos;
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
