import { Component, OnInit } from '@angular/core';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemaStatusInformation } from 'src/app/_models/schema/schemadetailstable';

@Component({
  selector: 'pros-schema-statusinfo-dialog',
  templateUrl: './schema-statusinfo-dialog.component.html',
  styleUrls: ['./schema-statusinfo-dialog.component.scss']
})
export class SchemaStatusinfoDialogComponent implements OnInit {

  schemaStatusInfoList: SchemaStatusInformation[] = [];
  constructor(
    private schemaDetailsService: SchemaDetailsService
  ) {  }
  ngOnInit() {
    this.getAllStatusInfo();
  }
  private getAllStatusInfo() {
    this.schemaDetailsService.getSchemaStatusInformation().subscribe(data => this.schemaStatusInfoList = data);
  }
}
