import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-grupo-dialog',
  templateUrl: './grupo-dialog.component.html',
})
export class GrupoDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<GrupoDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      nombre: [data?.nombre || '', [Validators.required]],
      semestre: [data?.semestre || '', [Validators.required, Validators.min(1), Validators.max(6)]],
      cicloEscolar: [data?.cicloEscolar || '', [Validators.required]],
    });
  }

  save(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
