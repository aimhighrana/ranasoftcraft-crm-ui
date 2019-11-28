import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { ActivatedRoute, Router } from '@angular/router';
import { Schema } from 'src/app/_models/schema/schema';
import { SchemaService } from 'src/app/_services/home/schema.service';

@Component({
  selector: 'pros-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {

  schemas: Schema[];
  constructor(private scheamService: SchemaService, private httpRouter: ActivatedRoute, private router: Router) { }

  breadcrumb: Breadcrumb = {
    heading: 'Schema(s)',
    links: []
  };
  ngOnInit() {
    this.getAllSchemas();
  }

  getAllSchemas() {
    this.schemas = this.scheamService.getAllSchema();
  }

  showSchemaList(schema: Schema) {
    if (schema !== undefined && schema.schemaId !== undefined && schema.schemaId !== '') {
      this.router.navigate(['/home/schema/schema-list', schema.schemaId, schema.title]);
    }
  }

  showChart() {
    this.router.navigate(['/home/show-chart']);
  }

}
