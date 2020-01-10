import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SchemaDatatableDialogComponent, SchemaChooseColumnDialogData } from '../schema-datatable-dialog/schema-datatable-dialog.component';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaStatusInformation } from 'src/app/_models/schema/schemadetailstable';

@Component({
  selector: 'pros-schema-statusinfo-dialog',
  templateUrl: './schema-statusinfo-dialog.component.html',
  styleUrls: ['./schema-statusinfo-dialog.component.scss']
})
export class SchemaStatusinfoDialogComponent implements OnInit {

  schemaStatusInfoList: SchemaStatusInformation[] = [];
  constructor(public dialogRef: MatDialogRef<SchemaDatatableDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: SchemaChooseColumnDialogData, private schemaDetailsService: SchemaDetailsService) {  }
  ngOnInit() {
    this.getAllStatusInfo();
  }
  private getAllStatusInfo() {
    this.schemaDetailsService.getSchemaStatusInformation().subscribe(data => this.schemaStatusInfoList = data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
