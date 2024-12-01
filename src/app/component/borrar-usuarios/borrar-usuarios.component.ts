import { Component, inject, input, Input } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Usuarios } from '../../models/usuarios/usuarios.model';

@Component({
  selector: 'app-borrar-usuarios',
  standalone: true,
  imports: [  MatButtonModule, MatButton
  ],
  templateUrl: './borrar-usuarios.component.html',
  styleUrl: './borrar-usuarios.component.css'
})
export class BorrarUsuariosComponent {
  @Input() id!: number;
  http = inject(HttpClient);
  dialog = inject(MatDialog);


  abrirConfirmacion(id:number): void {
    const dialogRef = this.dialog.open(BorrarConfirmacionUsuariosComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const url = `http://cecyte.test/api/Usuarios/${id}`;
        
        this.http.get<Usuarios>(url).subscribe(usuario => {
          const usuarioActualizado = {
            ...usuario,
            Estatus: 0 
          };

          this.http.put(url, usuarioActualizado).subscribe(() => {
            window.location.href = '/usuarios'; // Recargar la lista después de la eliminación
          });
        });
      }
    });
  }
  
}
@Component({
  selector: 'app-confirmacion-borrar-usuarios',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    MatButtonModule,
    MatDialogContent
  ],
  templateUrl: './confirmar-borrar-usuarios.component.html',
  styleUrl: './borrar-usuarios.component.css'
})
export class BorrarConfirmacionUsuariosComponent {
  constructor(private dialogRef: MatDialogRef<BorrarConfirmacionUsuariosComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
