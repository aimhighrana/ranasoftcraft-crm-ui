import { Component } from '@angular/core';
import { SchemaDatatableComponent } from '../schema-datatable/schema-datatable.component';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'pros-schema-statusinfo-dialog',
  templateUrl: './schema-statusinfo-dialog.component.html',
  styleUrls: ['./schema-statusinfo-dialog.component.scss']
})
export class SchemaStatusinfoDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<SchemaDatatableComponent>
  ) { }
  closeDialog(): void {
    this.dialogRef.close();
  }
}
