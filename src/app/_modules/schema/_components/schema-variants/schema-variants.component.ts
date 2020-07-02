import { Component, OnInit } from '@angular/core';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute } from '@angular/router';
import { SchemaVariantService } from 'src/app/_services/home/schema/schema-variant.service';
import { SchemaListDetails, VariantListDetails } from 'src/app/_models/schema/schemalist';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaService } from 'src/app/_services/home/schema.service';
import { SchemaGroupDetailsResponse } from 'src/app/_models/schema/schema';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';

@Component({
  selector: 'pros-schema-variants',
  templateUrl: './schema-variants.component.html',
  styleUrls: ['./schema-variants.component.scss']
})
export class SchemaVariantsComponent implements OnInit {
  schemaId: string;
  objectId: string;
  searchField: FormControl;
  masterVariant: VariantListDetails;
  variarantDetails: VariantListDetails[];
  variarantDetailsOb: Observable<VariantListDetails[]>;
  schemaGroupDetails: SchemaGroupDetailsResponse = new SchemaGroupDetailsResponse();
  schemaListDetails: SchemaListDetails = new SchemaListDetails();
  breadcrumb: Breadcrumb = {
    heading: 'Schema Variant(s)',
    links: [
      {
        link: '/home/schema',
        text: 'Schema'
      }
    ]
};
  showingErrors = true;
  showUnique = false;

  constructor(
    private schemaListService: SchemalistService,
    private activatedRouter: ActivatedRoute,
    private schemaVariantService: SchemaVariantService,
    private schemaService: SchemaService,
  ) {
    this.searchField = new FormControl('');
    this.variarantDetailsOb = of([]);
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      const schemaId = params.schemaId;
      const objectId = params.moduleId;
      if (schemaId  && objectId && this.schemaId !== schemaId &&  this.objectId !== objectId) {
        this.schemaId = params.schemaId;
        this.objectId = params.moduleId;

        this.schemaVariantService.getSchemaVariantDetails(this.schemaId).subscribe(response => {
          this.variarantDetails = response;
          const masterVariantFilter = this.variarantDetails.filter(varData => varData.variantId === '0');
          if (masterVariantFilter && masterVariantFilter.length > 0) {
            this.masterVariant = masterVariantFilter[0];
            this.variarantDetails = this.variarantDetails.filter(remove => remove.variantId !== '0');
          }
          this.variarantDetailsOb = of(this.variarantDetails);
          }, error => {
          console.log(`Error while fetching schema variants details ${error}`);
        });

        this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(data => {
          this.breadcrumb.heading = data.schemaDescription + 'Variant(s)';
          this.schemaListDetails = data;
        }, error => {
          console.error('Error while fetching schema details');
        });

        this.searchField.valueChanges.subscribe(data => {
          this.variarantDetailsOb = of(this.variarantDetails.filter(fl =>
          (fl.title.toLocaleLowerCase().indexOf(data.toLocaleLowerCase()) !== -1) || fl.variantId.indexOf(data) !== -1));
        }, error => {
          console.log('Error while fetching search variant details');
        });
      }
    });
  }

  public percentageErrorStr(): number {
    const num = this.showUnique ? this.masterVariant.errorUniqueValue / this.masterVariant.totalUniqueValue : this.masterVariant.errorValue / this.masterVariant.totalValue;
    return Math.round((num + Number.EPSILON) * 100 * 100) / 100;
  }

  public percentageSuccessStr(): number {
    const num = this.showUnique ? this.masterVariant.successUniqueValue / this.masterVariant.totalUniqueValue : this.masterVariant.successValue / this.masterVariant.totalValue;
    return Math.round((num + Number.EPSILON) * 100 * 100) / 100;
  }

  public toggleUniqueContainer(evt: MatSlideToggleChange) {
    this.showUnique = evt.checked;
  }

  public toggle() {
    this.showingErrors = !this.showingErrors;
  }
}
