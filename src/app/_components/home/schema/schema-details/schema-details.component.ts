import { Component, OnInit, ViewChild } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { ActivatedRoute } from '@angular/router';
import 'chartjs-plugin-zoom';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaGroupDetailsResponse } from 'src/app/_models/schema/schema';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
@Component({
  selector: 'pros-schema-details',
  templateUrl: './schema-details.component.html',
  styleUrls: ['./schema-details.component.scss']
})
export class SchemaDetailsComponent implements OnInit {
  title: string;
  moduleId: string;
  schemaId: string;
  schemaGroupId: string;
  schemaGroupDescription: string;
  schemaDetails: SchemaListDetails = new SchemaListDetails();
  breadcrumb: Breadcrumb = {
    heading: 'Schema Deatils',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
      }, {
        link: '/home/schema/schema-list/' + this.schemaGroupId,
        text: this.schemaGroupDescription + ' List'
      }
    ]
  };
  @ViewChild(OverviewChartComponent)schemaOverviewChart: OverviewChartComponent;
  constructor(
      private activatedRouter: ActivatedRoute,
      private schemaService: SchemaService,
      private schemaListService: SchemalistService,
      private schemaDetailService: SchemaDetailsService
  ) { }
  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      this.schemaId = params.schemaId;
      this.moduleId = params.moduleId;
      this.schemaGroupId = params.schemaGroupId;
      this.getSchemaDetailsBySchemaId(this.schemaId);
      this.getSchemaGroupDetails(this.schemaGroupId);
    });
  }
  private getSchemaDetailsBySchemaId(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId)
    .subscribe(
      (resposne: SchemaListDetails) => {
          this.schemaDetails = resposne;
          this.breadcrumb.heading = this.schemaDetails.schemaDescription + 'Details';
      }, error => {
        console.error('Went wrong while fetching schema details by schema id');
      }
    );
  }
  private getSchemaGroupDetails(schemaGroupId: string) {
    this.schemaService.getSchemaGroupDetailsBySchemaGrpId(schemaGroupId)
    .subscribe(
      (response: SchemaGroupDetailsResponse) => {
        this.schemaGroupDescription = response.groupName;
        this.breadcrumb.links[1].link = '/home/schema/schema-list/' + schemaGroupId;
        this.breadcrumb.links[1].text = this.schemaGroupDescription + ' List';
      }, error => {
        console.error('Error while fetch schema group details !');
      }
    );
  }

}
