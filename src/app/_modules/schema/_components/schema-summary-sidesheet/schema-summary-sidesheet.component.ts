import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaCollaborator, SchemaDashboardPermission } from '@models/collaborator';
import { AddFilterOutput } from '@models/schema/schema';
import { SchemaExecutionRequest } from '@models/schema/schema-execution';
import { CategoryInfo, FilterCriteria } from '@models/schema/schemadetailstable';
import { CoreSchemaBrMap, LoadDropValueReq, SchemaListDetails, SchemaStaticThresholdRes, VariantDetails } from '@models/schema/schemalist';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaExecutionService } from '@services/home/schema/schema-execution.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-schema-summary-sidesheet',
  templateUrl: './schema-summary-sidesheet.component.html',
  styleUrls: ['./schema-summary-sidesheet.component.scss']
})
export class SchemaSummarySidesheetComponent implements OnInit, OnDestroy {

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
  loadDopValuesFor: LoadDropValueReq;
  collaboratorData: SchemaCollaborator;
  reInilize = true;
  /** FormGroup to have schema summary form.. */
  schemaSummaryForm: FormGroup;

  /** To have variant details of a schema */
  variantDetails: VariantDetails[];

  /**
   * To hold all the subscriptions related to component
   */
  subscriptions: Subscription[] = [];

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
    private schemaListService: SchemalistService,
    private schemaExecutionService: SchemaExecutionService,
    private schemaVariantService: SchemaVariantService,
    private matSnackBar: MatSnackBar,
    private globalDialogService: GlobaldialogService
  ) { }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
    this.getRouteParams();
    // this.getQueryParams();

    this.sharedService.getAfterBrSave().subscribe(res => {
      if (res) {
        this.getBusinessRuleList(this.schemaId);
      }
    });

    this.sharedService.getAfterSubscriberSave().subscribe(res => {
      if (res) {
        this.getSubscriberList(this.schemaId);
      }
    })
  }

  /**
   * get params of active route to get module id and schema id
   */
  private getRouteParams() {
    this.activateRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;

      this.getSubscriberList(this.schemaId);
      this.getBusinessRuleList(this.schemaId);
      this.getSchemaVariants(this.schemaId);

      this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
        this.schemaDetails = res;
        console.log(this.schemaDetails);
      }, error => console.error('Error : {}', error.message));
    })
  }


  /**
   * Function to get dataScope/variants of schema
   * @param schemaId : ID of schema
   */
  getSchemaVariants(schemaId: string) {
    const schemaVariantList = this.schemaVariantService.getSchemaVariantDetails(schemaId).subscribe(response => {
      this.variantDetails = response;
    }, error => {
      console.log('Error while getting schema variants', error.message)
    })
    this.subscriptions.push(schemaVariantList);
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
   * Function to Api call to get subscribers according to schema ID
   * @param schemaId current schema id
   */
  public getSubscriberList(schemaId: string) {
   const subscriberData = this.schemaDetailsService.getCollaboratorDetails(schemaId).subscribe((responseData) => {
      responseData.forEach((subscriber) => {
        subscriber.filterCriteria.forEach((data) => {
          const filter: FilterCriteria = new FilterCriteria();
          filter.fieldId = data.fieldId;
          filter.type = data.type;
          filter.values = data.values;

          const dropVal: DropDownValue[] = [];
          filter.values.forEach(val => {
            const dd: DropDownValue = { CODE: val, FIELDNAME: data.fieldId } as DropDownValue;
            dropVal.push(dd);
          })
          filter.filterCtrl = { fldCtrl: data.fldCtrl, selectedValues: dropVal };
          data.filterCtrl = filter.filterCtrl;
        })
      }),
        this.subscriberData = responseData;
    }, error => {
      console.log('Error while fetching subscriber information', error.message)
    })
    this.subscriptions.push(subscriberData);
  }

  /**
   * Function to Api call to get business rules according to schema ID
   * @param schemaId current schema id
   */
  public getBusinessRuleList(schemaId: string) {
   const businessRuleList = this.schemaService.getAllBusinessRules(schemaId).subscribe((responseData) => {
      this.businessRuleData = responseData;
    }, error => {
      console.log('Error while fetching business rule info for schema', error);
    })
    this.subscriptions.push(businessRuleList);
  }

  /**
   * to convert name into shortName for subscriber tab
   * @param fname firstName of the subscriber
   * @param lname lastName of the subscriber
   */
  public shortName(fName: string, lName: string) {
    if (fName.length >= 1 && lName.length >= 1) {
      return fName[0] + lName[0];
    } else {
      return '';
    }
  }

  /**
   *
   * @param br updateable business rules...
   * @param event value of chnaged
   */
  updateBr(br: CoreSchemaBrInfo, event?: any) {
    const request: CoreSchemaBrMap = new CoreSchemaBrMap();
    if (event instanceof MatSliderChange) {
      request.brWeightage = (event as MatSliderChange).value;
    } else if (event instanceof MatSlideToggleChange) {
      request.status = (event as MatSlideToggleChange).checked ? '1' : '0';
    }
    request.schemaId = this.schemaId;
    request.brId = br.brIdStr;
    request.order = br.order;
    if (!request.brWeightage) {
      request.brWeightage = Number(br.brWeightage);
    }
    if (!request.status) {
      request.status = br.status
    }
    const updateBusinessRule = this.schemaService.updateBrMap(request).subscribe(res => {
      if (res) {
        this.getBusinessRuleList(this.schemaId);
      }
    }, error => console.error(`Error : ${error.message}`));
    this.subscriptions.push(updateBusinessRule);
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
      if (br) {
        const request: CoreSchemaBrMap = new CoreSchemaBrMap();
        request.schemaId = this.schemaId;
        request.brId = br.brIdStr;
        request.order = event.currentIndex;
        request.brWeightage = Number(br.brWeightage);
        request.status = br.status
        const updateBusinessRule = this.schemaService.updateBrMap(request).subscribe(res => {
          if (res) {
            this.getBusinessRuleList(this.schemaId);
          }
        }, error => console.error(`Error : ${error.message}`));
        this.subscriptions.push(updateBusinessRule);
      }
    }
  }

  /**
   * Delete business rule by id
   * @param br delete by br id
   */
  deleteBr(br: CoreSchemaBrInfo) {
    this.globalDialogService.confirm({label:'Are you sure to delete ?'}, (response) =>{
      if(response && response === 'yes') {
        if (br.brIdStr) {
         const deleteSubscriber = this.schemaService.deleteBr(br.brIdStr).subscribe(res => {
            this.getBusinessRuleList(this.schemaId);
          }, error => console.error(`Error : ${error.message}`));
          this.subscriptions.push(deleteSubscriber);
        }
      }
    });
  }

  /**
   * Edit curren business rule..
   * @param br editable business rule ..
   */
  editBr(br: CoreSchemaBrInfo) {
    this.router.navigate(['', { outlets: { sb: `sb/schema/business-rule/${this.moduleId}/${this.schemaId}/${br.brIdStr}` } }]);
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


  makeFilterControl(event: AddFilterOutput, sNo: number) {
    const exitingFilterCtrl = [];

    const filterCtrl: FilterCriteria = new FilterCriteria();
    filterCtrl.fieldId = event.fldCtrl.fieldId;
    filterCtrl.type = 'DROPDOWN';
    filterCtrl.values = event.selectedValues.map(map => map.CODE);

    exitingFilterCtrl.push(filterCtrl);

    this.subscriberData.forEach((subscriber) => {
      if (subscriber.sno === sNo) {
        if (subscriber.filterCriteria.length === 0) {
          this.updateSubscriberInfo(sNo, exitingFilterCtrl)
          return;
        }
        subscriber.filterCriteria.forEach((res) => {
          if (event.fldCtrl.fieldId === res.fieldId) {
            res.values.push(...filterCtrl.values);

            const updateSubscriber: SchemaDashboardPermission = subscriber;

            delete updateSubscriber.userMdoModel;

            updateSubscriber.sno = subscriber.sno.toString();
            updateSubscriber.schemaId = this.schemaId;
            this.schemaDetailsService.createUpdateUserDetails(Array(updateSubscriber)).subscribe(response => {
              this.getSubscriberList(this.schemaId);
            })
          } else {
            this.updateSubscriberInfo(sNo, exitingFilterCtrl)
          }
        })
      }
    })
  }


  /**
   * Function to show chips of selected filters
   * @param ctrl Filter criteria
   */
  prepareTextToShow(ctrl: FilterCriteria): string {
    const selCtrl = ctrl.filterCtrl.selectedValues.filter(fil => fil.FIELDNAME === ctrl.fieldId);
    if (selCtrl && selCtrl.length > 1) {
      return String(selCtrl.length);
    }
    return ((selCtrl && selCtrl.length === 1) ? (selCtrl[0].TEXT ? selCtrl[0].TEXT : selCtrl[0].CODE) : 'Unknown');
  }



  /**
   * Function to load dropdown values of already selcted filters
   */
  loadDropValues(fldC: FilterCriteria) {
    if (fldC) {
      const dropArray: DropDownValue[] = [];
      fldC.values.forEach(val => {
        const drop: DropDownValue = { CODE: val, FIELDNAME: fldC.fieldId } as DropDownValue;
        dropArray.push(drop);
      });
      this.loadDopValuesFor = { fieldId: fldC.fieldId, checkedValue: dropArray };
    }
  }


  /**
   * Function to remove filters on clicking cross icon
   * @param ctrl Filter criteria
   */
  removeAppliedFilter(ctrl: FilterCriteria, sNo: number) {
    this.subscriberData.forEach((subscriber) => {
      if (subscriber.sno === sNo) {
        subscriber.filterCriteria.forEach((res) => {
          if (res.fieldId === ctrl.fieldId) {
            subscriber.filterCriteria.splice(subscriber.filterCriteria.indexOf(res), 1);
          }
        })
        subscriber.schemaId = this.schemaId;
        subscriber.sno = sNo.toString();
        delete subscriber.userMdoModel;

        this.schemaDetailsService.createUpdateUserDetails(Array(subscriber)).subscribe((res) => {
          this.getSubscriberList(this.schemaId);
        }, error => {
          console.log('Error while removing filter from subscriber', error.message);
        })
      }
    })
  }


  /**
   * Function to delete subscriber from schema
   * @param sNo serial No of the subscriber.
   */
  public deleteSubscriber(sNo: number) {
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      if (response && response === 'yes') {
       const sNoList = [];
       sNoList.push(sNo);
       const deleteSubscriber = this.schemaDetailsService.deleteCollaborator(sNoList).subscribe(res => {
          this.matSnackBar.open('Subscriber deleted successfully.', 'okay', { duration: 5000 });
          this.getSubscriberList(this.schemaId);
        }, error => {
          console.log('Error while deleting subscriber', error.message)
        })
        this.subscriptions.push(deleteSubscriber);
      }
    });
  }

  /**
   * Function to edit subscriber details of schema
   * @param sNo serial Number of subscriber
   */
  public editSubscriberInfo(sNo: number) {
    this.router.navigate([{ outlets: { sb: `sb/schema/subscriber/${this.moduleId}/${this.schemaId}/${sNo}` } }])
  }


  /**
   * Function to update subscriber filter criteria
   * @param sNo serial number of subscriber
   * @param schemaId schema id
   * @param exitingFilterCtrl array of filter criteria
   */
  updateSubscriberInfo(sNo: number, exitingFilterCtrl) {
    /**
     * Filter data according to sNo.
     */
    this.subscriberData.filter((data) => {
      if (data.sno === sNo) {
        /**
         * Prepare the data of subscriber to send into API
         */
        data.schemaId = this.schemaId;
        data.sno = data.sno.toString();
        /**
         * Delete not required fields for UPDATE api
         */
        delete data.userMdoModel;

        exitingFilterCtrl.map((filter) => {
          data.filterCriteria.push(filter);
        })
        const collaboratorArray = [];
        collaboratorArray.push(data)
        this.schemaDetailsService.createUpdateUserDetails(collaboratorArray).subscribe((res) => {
          this.getSubscriberList(this.schemaId);
        }, error => {
          console.log('Error while update subscriber filter information', error.message)
        })
      }
    })
  }

  /**
   * Function to fetch selected subscriber from a dropdown
   * @param selectedValues list of selected drop down values
   * @param sNo serial number of subscriber
   */
  fetchSelectedValues(selectedValues, sNo: number) {
    if (selectedValues.length > 0) {
      this.subscriberData.forEach((subscriber) => {
        if (subscriber.sno === sNo) {
          subscriber.schemaId = this.schemaId;
          subscriber.sno = sNo.toString();
          delete subscriber.userMdoModel;

          subscriber.filterCriteria.forEach((res) => {
            if (res.fieldId === selectedValues[0].FIELDNAME) {
              res.values = [];
              res.values = selectedValues.map((value) => value.CODE)
            }
          })
          this.schemaDetailsService.createUpdateUserDetails(Array(subscriber)).subscribe(res => {
            this.getSubscriberList(this.schemaId)
          })
        }
      })
    }
  }

  /**
   * ANGULAR HOOK
   * To destroy all the subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    })
  }

  /**
   * Function to close summary sidesheet on click
   */
  close(){
    this.router.navigate([{outlets: {sb: null}}])
  }

}
