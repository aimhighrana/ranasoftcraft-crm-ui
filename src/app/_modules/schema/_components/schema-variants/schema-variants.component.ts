import { Component, OnInit } from '@angular/core';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaVariantService } from 'src/app/_services/home/schema/schema-variant.service';
import { SchemaListDetails, VariantListDetails, VariantDetails } from 'src/app/_models/schema/schemalist';
import { Breadcrumb } from 'src/app/_models/breadcrumb';
import { SchemaGroupDetailsResponse } from 'src/app/_models/schema/schema';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-schema-variants',
  templateUrl: './schema-variants.component.html',
  styleUrls: ['./schema-variants.component.scss']
})
export class SchemaVariantsComponent implements OnInit {
  schemaId: string;
  objectId: string;
  searchField: FormControl = new FormControl('');
  masterVariant: VariantListDetails;
  variarantDetails: VariantDetails[];
  variarantDetailsOb: Observable<VariantDetails[]>;
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
    private matSnackBar: MatSnackBar,
    private router: Router
  ) {
    // this.searchField = new FormControl('');
    this.variarantDetailsOb = of([]);
  }

  ngOnInit() {
    this.activatedRouter.params.subscribe(params => {
      const schemaId = params.schemaId;
      const objectId = params.moduleId;
      if (schemaId  && objectId && this.schemaId !== schemaId &&  this.objectId !== objectId) {
        this.schemaId = params.schemaId;
        this.objectId = params.moduleId;

        this.onLoadVariantList();

        this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(data => {
          this.breadcrumb.heading = data.schemaDescription + ' Variant(s)';
          this.schemaListDetails = data;
        }, error => {
          console.error('Error while fetching schema details');
        });
      }
    });
  }

  onLoadVariantList() {
    this.schemaVariantService.getSchemaVariantDetails(this.schemaId).subscribe(response => {
      this.variarantDetails = response;
      this.variarantDetailsOb = of(this.variarantDetails);
      }, error => {
      console.log(`Error while fetching schema variants details ${error}`);
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

  public createVariant() {
    this.router.navigate(['/home/schema/schema-variants/create-variant', this.objectId, this.schemaId, 'new']);
  }

  editVariant(variantId: string) {
    this.router.navigate(['/home/schema/schema-variants/create-variant', this.objectId, this.schemaId, variantId]);
  }
  /**
   * Delete schema by variant id
   * @param variantId deleteable variantId
   */
  deleteVariant(variantId: string) {
    this.schemaVariantService.deleteVariant(variantId).subscribe(res=>{
      this.matSnackBar.open(`Successfully deleted `, 'Close',{duration:5000});
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload'
      this.router.navigate(['/home/schema/schema-variants', this.objectId, this.schemaId]);
    }, error=>{
      this.matSnackBar.open(`Something went wrong `, 'Close',{duration:5000});
    })
  }

}
