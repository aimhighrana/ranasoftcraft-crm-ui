import { Component, OnInit, Inject } from '@angular/core';
import { DialogData } from '../../schema-dialog/schema-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'pros-schema-datatable-dialog',
  templateUrl: './schema-datatable-dialog.component.html',
  styleUrls: ['./schema-datatable-dialog.component.scss']
})
export class SchemaDatatableDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SchemaDatatableDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public dialogData: DialogData
    ) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
