import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { Subscription } from 'rxjs';

export enum DetailView {
  DATAQUALITY_VIEW = 'DATAQUALITY_VIEW',
  DUPLICACY_VIEW = 'DUPLICACY_VIEW',
  MRO_CLASSIFICATION_VIEW = 'MRO_CLASSIFICATION_VIEW',
  POTEXT_VIEW = 'POTEXT_VIEW'
}

@Component({
  selector: 'pros-detail-builder',
  templateUrl: './detail-builder.component.html',
  styleUrls: ['./detail-builder.component.scss']
})
export class DetailBuilderComponent implements OnInit, OnDestroy {


  /**
   * Module / dataset id
   */
  moduleId: string;

  /**
   * Schema id
   */
  schemaId: string;

  /**
   * Variant id if have otherwise by default is 0 for all
   */
  variantId = '0';

  activeTab = 'error | success | warning | review';

  /**
   * Use this variable for render / draw different view of UI ..
   *
   * DetailView.DATAQUALITY_VIEW is default view ...
   */
  displayFormat : DetailView = DetailView.DATAQUALITY_VIEW;

  /**
   * Store schema informations..
   */
  schemaDetails: SchemaListDetails;

  /**
   * Hold all subscribers ..
   */
  subscribers: Subscription[] = [];


  constructor(
    private activatedRouter: ActivatedRoute,
    private schemaService: SchemalistService
  ) { }

  ngOnDestroy(): void {
    this.subscribers.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    // get moduel , schema and variant ids from params
    this.activatedRouter.params.subscribe(params=>{
      if(this.moduleId !== params.moduleId) {
        this.moduleId = params.moduleId;
      }
      if(this.schemaId !== params.schemaId) {
        this.schemaId = params.schemaId;
        this.getSchemaDetails(this.schemaId);
      }
      if(this.variantId !== params.variantId) {
        this.variantId = params.variantId ? params.variantId : '0' ;
      }

    });

     // get queryParams for status ..
     this.activatedRouter.queryParams.subscribe(queryParams=> {
      this.activeTab = queryParams.status ? queryParams.status: 'error';
    });

    // // TODO .. based on schema type ..
    // this.displayFormat = DetailView.CLASSIFICATION_VIEW;

  }

  /**
   * Get schema details / information by schema id
   * @param schemaId append on request as parameter
   */
  getSchemaDetails(schemaId: string) {
    const sub = this.schemaService.getSchemaDetailsBySchemaId(schemaId).subscribe(res=>{
      this.schemaDetails = res;
      this.displayFormat = res.schemaCategory as DetailView;
      console.log(this.schemaDetails);
    }, err=> console.error(`Error : ${err}`));
    this.subscribers.push(sub);

  }

}
