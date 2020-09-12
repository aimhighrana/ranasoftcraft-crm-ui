import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '@services/home/schema.service';
import { SchemaStaticThresholdRes, CoreSchemaBrMap, SchemaListDetails } from '@models/schema/schemalist';
import { SchemaDashboardPermission } from '@models/collaborator'
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { CategoryInfo } from '@models/schema/schemadetailstable';
import { MatSliderChange } from '@angular/material/slider';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaExecutionRequest } from '@models/schema/schema-execution';
import { SchemaExecutionService } from '@services/home/schema/schema-execution.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pros-schema-info',
  templateUrl: './schema-info.component.html',
  styleUrls: ['./schema-info.component.scss']
})
export class SchemaInfoComponent implements OnInit {

  /**
   * module ID of current module
   */
  moduleId: string;

  /**
   * schema ID of current schema
   */
  schemaId: string;

  thresholdValue: number;
  errorValue: number;
  successValue: number;

  /**
   * complete statics of schema
   */
  schemaStatics: SchemaStaticThresholdRes;

  /**
   * to have subscribers data of schema
   */
  subscriberData: SchemaDashboardPermission[];

  businessRuleData: CoreSchemaBrInfo[];

  activeTab: string;

  selectedIndex: number;

  category: CategoryInfo[];

  schemaDetails: SchemaListDetails;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private globalDialogService: GlobaldialogService,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
    private schemaListService: SchemalistService,
    private schemaExecutionService: SchemaExecutionService,
    private matSnackBar: MatSnackBar
  ) { }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
    console.log('inside ngoninit..')
    this.getRouteParams();
    // this.getQueryParams();
    this.sharedService.getAfterBrSave().subscribe(res=>{
      if(res){
        this.getBusinessRuleList(this.schemaId);
      }
    });

    this.getAllCategoryInfo();
  }

  /**
   * get params of active route to get module id and schema id
   */
  private getRouteParams(){
    this.activateRoute.params.subscribe((params) => {
      console.log('get params..')
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;
      this.getSchemaStatics(this.schemaId);
      this.getSubscriberList(this.schemaId);
      this.getBusinessRuleList(this.schemaId);

      this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res=>{
        this.schemaDetails = res;
      }, error=> console.error('Error : {}', error.message));
    })
  }


  getAllCategoryInfo() {
    this.schemaDetailsService.getAllCategoryInfo().subscribe(res=>{
      this.category = res;
    }, error => console.error(`Error : ${error.message}`));
  }

  // private getQueryParams(){
  //   this.activateRoute.queryParams.subscribe(Queryparams => {
  //     console.log('Inside query params',Queryparams);

  //     this.activeTab = Queryparams.fragment;
  //     // this.updateFragment(this.activeTab);

  //     console.log(this.activeTab);
  //   })
  // }

  /**
   * get statics of the schema
   * @param schemaId schema ID to get schema statics
   */
  public getSchemaStatics(schemaId: string){
    this.schemaService.getSchemaThresholdStatics(schemaId).subscribe((schemaData) => {
      this.schemaStatics = schemaData;
      this.getPercentageStatics(this.schemaStatics)
    }, error => {
      console.log('Error when get schema statics', error);
      this.thresholdValue = 0;
      this.successValue = 0;
      this.errorValue = 0;
    })
  }

  /**
   * Convert the statics into percentage
   * @param statics object of schema statics
   */
  public getPercentageStatics(statics: SchemaStaticThresholdRes){
    this.thresholdValue = Math.round((statics.threshold + Number.EPSILON) * 100) / 100;
    this.errorValue = Math.round(((statics.errorCnt/statics.totalCnt) + Number.EPSILON) * 100 * 100) / 100;
    this.successValue = Math.round(((statics.successCnt/statics.totalCnt) + Number.EPSILON) * 100 * 100) / 100;
  }


  /**
   * update fragement of route according to the selected tab
   * @param event matTab event object
   */
  public updateFragment(tabLabel: string){

    if(tabLabel){
      this.router.navigate(['/home/schema/schema-info', this.moduleId, this.schemaId], {queryParams:{fragment:tabLabel}})
    }

    /**
     * while business-rules tab is selected
     */
    if(tabLabel==='business-rules'){
      this.selectedIndex = 0;
    }

    /**
     * while subscribers tab is selected
     */
    if(tabLabel==='subscribers'){
      this.selectedIndex = 1;
    }

    /**
     * while execution logs tab is selected
     */
    if(tabLabel==='execution-logs'){
      this.selectedIndex = 2;
    }
  }




  /**
   * Function to Api call to get subscribers according to schema ID
   * @param schemaId current schema id
   */
  public getSubscriberList(schemaId: string){
    this.schemaDetailsService.getCollaboratorDetails(schemaId).subscribe((responseData) => {
      console.log(responseData)
      this.subscriberData = responseData;
    }, error => {
      console.error('Error while fetching subscribers for schema', error);
    })
  }

  /**
   * Function to Api call to get business rules according to schema ID
   * @param schemaId current schema id
   */
  public getBusinessRuleList(schemaId: string){
    this.schemaService.getAllBusinessRules(schemaId).subscribe((responseData) => {
      console.log(responseData);
      this.businessRuleData = responseData;
    }, error => {
      console.log('Error while fetching business rule info for schema', error);
    })
  }

  /**
   * to convert name into shortName for subscriber tab
   * @param fname firstName of the subscriber
   * @param lname lastName of the subscriber
   */
  public shortName(fName:string, lName:string){
    if(fName.length>=1 && lName.length>=1)
    {
      return fName[0]+lName[0];
    }else{
      return '';
    }
  }


  /**
   * Function to open dialog to add subscriber
   */
  public addSubscriber(){
    // this.globalDialogService.openDialog(NewSchemaCollaboratorsComponent, {});
    // this.router.navigate(['', { outlets: { sb: 'sb/schema/subscriber-add' } } ]);
    this.router.navigate(['', { outlets: { sb: 'sb/schema/business-rule/new' } } ]);
  }

  /**
   * Function to open dialog to add business rule
   */
  public addBusinessRule(){
    // this.globalDialogService.openDialog(NewBusinessRulesComponent, {});
    this.router.navigate(['', { outlets: { sb: `sb/schema/business-rule/${this.moduleId}/${this.schemaId}/new` } } ]);
  }

  /**
   *
   * @param br updateable business rules...
   * @param event value of chnaged
   */
  updateBr(br: CoreSchemaBrInfo, event?: any) {
    const request: CoreSchemaBrMap = new CoreSchemaBrMap();
    if(event instanceof MatSliderChange) {
      request.brWeightage = (event as MatSliderChange).value;
    } else if(event instanceof MatSlideToggleChange) {
      request.status = (event as MatSlideToggleChange).checked ? '1' : '0';
    }
    request.schemaId = this.schemaId;
    request.brId = br.brIdStr;
    request.order = br.order;
    if(!request.brWeightage) {
      request.brWeightage = Number(br.brWeightage);
    }
    if(!request.status) {
      request.status = br.status
    }
    this.schemaService.updateBrMap(request).subscribe(res=>{
      if(res) {
        this.getBusinessRuleList(this.schemaId);
      }
    }, error=> console.error(`Error : ${error.message}`));
  }

  /**
   * update br category ..
   * @param cat updateable category ..
   * @param br business rule which is going for update
   */
  updateCategory(cat: CategoryInfo, br: CoreSchemaBrInfo) {
    br.brId = br.brIdStr;
    br.categoryId = cat.categoryId;
    this.schemaService.createBusinessRule(br).subscribe(res=>{
      this.getBusinessRuleList(this.schemaId);
    }, error=>{
      console.error(`Error while updating schema .. `);
    });
  }

  /**
   * Update order of business rule
   * @param event updateable ordre
   */
  drop(event: CdkDragDrop<any>) {
    console.log(event.item.data);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      const br = this.businessRuleData[event.previousIndex];
      if(br) {
        const request: CoreSchemaBrMap = new CoreSchemaBrMap();
        request.schemaId = this.schemaId;
        request.brId = br.brIdStr;
        request.order = event.currentIndex;
        request.brWeightage = Number(br.brWeightage);
        request.status = br.status
        this.schemaService.updateBrMap(request).subscribe(res=>{
          if(res) {
            this.getBusinessRuleList(this.schemaId);
          }
        }, error=> console.error(`Error : ${error.message}`));
        }
    }
  }

  /**
   * Delete business rule by id
   * @param br delete by br id
   */
  deleteBr(br: CoreSchemaBrInfo) {
    if(br.brIdStr) {
      this.schemaService.deleteBr(br.brIdStr).subscribe(res=>{
        this.getBusinessRuleList(this.schemaId);
      }, error=> console.error(`Error : ${error.message}`));
    }
  }

  /**
   * Edit curren business rule..
   * @param br editable business rule ..
   */
  editBr(br: CoreSchemaBrInfo) {
    this.router.navigate(['', { outlets: { sb: `sb/schema/business-rule/${this.moduleId}/${this.schemaId}/${br.brIdStr}` } } ]);
  }

  /**
   * Run schema now ..
   * @param schema runable schema details .
   */
  runSchema(schema: SchemaListDetails) {
    const schemaExecutionReq: SchemaExecutionRequest = new SchemaExecutionRequest();
    schemaExecutionReq.schemaId = schema.schemaId;
    schemaExecutionReq.variantId = '0'; // 0 for run all
    this.schemaExecutionService.scheduleSChema(schemaExecutionReq).subscribe(data => {
      this.schemaDetails.isInRunning = true;
    }, error => {
      this.matSnackBar.open(`Something went wrong while running schema`, 'Close', { duration: 5000 });
    });
  }
}