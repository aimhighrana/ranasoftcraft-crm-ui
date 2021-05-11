import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetailView } from '@models/schema/schemadetailstable';
import { SchemaListDetails } from '@models/schema/schemalist';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'pros-detail-builder',
  templateUrl: './detail-builder.component.html',
  styleUrls: ['./detail-builder.component.scss']
})
export class DetailBuilderComponent implements OnInit, OnDestroy {

  DetailView = DetailView;


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
  displayFormat : DetailView ;

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
      // only update module id once schema details are loaded
      if(this.schemaId !== params.schemaId) {
        // this.schemaId = params.schemaId;
        this.getSchemaDetails(params.moduleId, params.schemaId, params.variantId);
      } else if(this.variantId !== params.variantId) {
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
  getSchemaDetails(moduleId: string, schemaId: string, variantId: string) {
    const sub = this.schemaService.getSchemaDetailsBySchemaId(schemaId).subscribe(res=>{
      // update all inputs once schema details gets loaded
      this.moduleId = moduleId;
      this.schemaId = schemaId;
      this.variantId = variantId || '0';
      this.schemaDetails = res;
      this.displayFormat = (res.schemaCategory || DetailView.DATAQUALITY_VIEW) as DetailView;
      console.log(this.schemaDetails);
    }, err=> console.error(`Error : ${err}`));
    this.subscribers.push(sub);

  }

}
