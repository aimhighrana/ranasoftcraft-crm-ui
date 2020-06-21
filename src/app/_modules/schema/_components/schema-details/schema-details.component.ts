import { Component, OnInit } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { ActivatedRoute } from '@angular/router';
import 'chartjs-plugin-zoom';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
@Component({
  selector: 'pros-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss']
})
export class SchemaDetailsComponent implements OnInit {
  title: string;
  moduleId: string;
  schemaId: string;
  variantId: string;
  schemaGroupDescription: string;
  collaboratorPermission = false;
  schemaDetails: SchemaListDetails = new SchemaListDetails();
  breadcrumb: Breadcrumb = {
    heading: 'Schema Deatils',
    links: [
      {
        link: '/home/schema',
        text: 'Schema List'
      }
    ]
  };
  // @ViewChild(OverviewChartComponent)schemaOverviewChart: OverviewChartComponent;
  constructor(
      private activatedRouter: ActivatedRoute,
      private schemaListService: SchemalistService,
  ) { }
  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.schemaId = params.schemaId?((params.schemaId).toLowerCase === 'new' ? '' : params.schemaId): '';
      if(this.schemaId) {
        this.getSchemaDetailsBySchemaId(this.schemaId);
      } else {
        this.collaboratorPermission = true;
      }
      this.moduleId = params.moduleId;
      this.variantId = params.variantId;
    });
  }
  private getSchemaDetailsBySchemaId(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId)
    .subscribe(
      (resposne: SchemaListDetails) => {
          this.schemaDetails = resposne;
          this.breadcrumb.heading = this.schemaDetails.schemaDescription + 'Details';
          this.collaboratorPermission = resposne.collaboratorModels ? resposne.collaboratorModels.isAdmin : false;
      }, error => {
        console.error('Went wrong while fetching schema details by schema id');
      }
    );
  }
}
