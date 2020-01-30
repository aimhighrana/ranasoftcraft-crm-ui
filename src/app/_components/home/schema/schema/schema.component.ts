import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { Router } from '@angular/router';
import { SchemaGroupResponse } from 'src/app/_models/schema/schema';
import { SchemaService } from 'src/app/_services/home/schema.service';

@Component({
  selector: 'pros-schema',
  templateUrl: './schema.component.html',
  styleUrls: ['./schema.component.scss']
})
export class SchemaComponent implements OnInit {

  schemaGroups: SchemaGroupResponse[] = [];

  constructor(
    private scheamService: SchemaService,
    private router: Router
  ) { }

  breadcrumb: Breadcrumb = {
    heading: 'Schema group(s)',
    links: []
  };

  ngOnInit() {
    this.getAllSchemaGroup();
  }

  showSchemaList(schema: SchemaGroupResponse) {
    if (schema !== undefined && schema.groupId !== null) {
      this.router.navigate(['/home/schema/schema-list', schema.groupId]);
    }
  }

  private getAllSchemaGroup() {
    this.scheamService.getAllSchemaGroup().subscribe((response: SchemaGroupResponse[]) => {
      this.schemaGroups = response;
    }, error => {
      console.log('Error while fetching schema groups');
    });
  }

  public editSchemaGroup(edit: any) {
    this.router.navigate(['/home/schema/edit-group', edit.groupId]);
  }

}
