import { Component, OnInit } from '@angular/core';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaVariantService } from 'src/app/_services/home/schema/schema-variant.service';
import { SendSchemavariantRequest, SchemaVariantResponse, SchamaListDetails } from 'src/app/_models/schema/schemalist';
import { Any2tsService } from 'src/app/_services/any2ts.service';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaGroupDetailsResponse } from 'src/app/_models/schema/schema';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';

@Component({
  selector: 'pros-schema-variants',
  templateUrl: './schema-variants.component.html',
  styleUrls: ['./schema-variants.component.scss']
})
export class SchemaVariantsComponent implements OnInit {
  schemaId: string;
  objectId: string;
  groupId: string;
  schemaVariantList: SchemaVariantResponse[] = [];
  title = '';
  schemaGroupDetails: SchemaGroupDetailsResponse = new SchemaGroupDetailsResponse();
  schemaListDetails: SchamaListDetails = new SchamaListDetails();
  breadcrumb: Breadcrumb = {
    heading: this.title + ' Variant(s)',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
      }, {
        link: '/home/schema/schema-list',
        text: 'Schema List'
      }
    ]
  };
  constructor(
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute,
    private schemaVariantService: SchemaVariantService,
    private any2tsService: Any2tsService,
    private router: Router,
    private schemaService: SchemaService,
    private schemaDetailService: SchemaDetailsService
  ) { }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      const schemaId = params.schemaId;
      const groupId = params.groupId;
      const objectId = params.moduleId;
      if (schemaId && groupId && objectId && this.schemaId !== schemaId && this.groupId !== groupId && this.objectId !== objectId) {
        this.schemaId = params.schemaId;
        this.groupId = params.groupId;
        this.objectId = params.moduleId;
        this.getSchemaVariantDetails();
        this.getSchemaGroupDetailsByGrpId();
        this.getSchemaDetailsBySchemaId();
      }
    });
  }
  private getSchemaVariantDetails() {
    const sendSchemavariantDetails: SendSchemavariantRequest = new SendSchemavariantRequest();
    sendSchemavariantDetails.objectId = this.objectId ? this.objectId : '';
    sendSchemavariantDetails.platCode = String(0);
    sendSchemavariantDetails.schemaId = this.schemaId ? this.schemaId : '';
    this.schemaVariantService.schemavariantDetailsBySchemaId(sendSchemavariantDetails)
      .subscribe((response: SchemaVariantResponse[]) => {
        this.schemaVariantList = response;
      }, error => {
        console.log('Error while fetching schema variants');
      });
  }
  private getSchemaGroupDetailsByGrpId() {
    this.schemaService.getSchemaGroupDetailsBySchemaGrpId(this.groupId).subscribe(data => {
      this.breadcrumb.links[1].link = '/home/schema/schema-list' + '/' + this.groupId;
      this.breadcrumb.links[1].text = data.groupName + ' List';
      this.schemaGroupDetails = data;
    }, error => {
      console.log('Error while fetching schema group details by id');
    });
  }
  private getSchemaDetailsBySchemaId() {
    this.schemaDetailService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(data => {
      this.breadcrumb.heading = data.schemaDescription + 'Variant(s)';
      this.schemaListDetails = data;
    }, error => {
      console.error('Error while fetching schema details');
    });
  }
}
