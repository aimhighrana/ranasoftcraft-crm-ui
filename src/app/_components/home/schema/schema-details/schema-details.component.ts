import { Component, OnInit, ViewChild } from '@angular/core';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { ActivatedRoute } from '@angular/router';
import 'chartjs-plugin-zoom';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';
import { SchamaListDetails } from 'src/app/_models/schema/schemalist';
import { Any2tsService } from 'src/app/_services/any2ts.service';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaGroupDetailsResponse } from 'src/app/_models/schema/schema';
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
  schemaDetails: SchamaListDetails = new SchamaListDetails();
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
  @ViewChild(OverviewChartComponent, {static: false})schemaOverviewChart: OverviewChartComponent;
  constructor(private schemaDetailsService: SchemaDetailsService, private activatedRouter: ActivatedRoute, private any2tsService: Any2tsService, private schemaService: SchemaService) { }
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
    this.schemaDetailsService.getSchemaDetailsBySchemaId(schemaId)
    .subscribe(
      (resposne: SchamaListDetails) => {
          this.schemaDetails = resposne;
          this.title = this.schemaDetails.schemaDescription ? this.schemaDetails.schemaDescription : '';
          this.breadcrumb.heading = this.title + 'Details';
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
