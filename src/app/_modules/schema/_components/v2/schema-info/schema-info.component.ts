import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '@services/home/schema.service';
import { SchemaStaticThresholdRes, CoreSchemaBrMap, SchemaListDetails, LoadDropValueReq } from '@models/schema/schemalist';
import { SchemaCollaborator, SchemaDashboardPermission } from '@models/collaborator';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { CategoryInfo, FilterCriteria } from '@models/schema/schemadetailstable';
import { MatSliderChange } from '@angular/material/slider';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaExecutionRequest } from '@models/schema/schema-execution';
import { SchemaExecutionService } from '@services/home/schema/schema-execution.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReadyForApplyFilter } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';

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
  loadDopValuesFor: LoadDropValueReq;
  collaboratorData: SchemaCollaborator;

  reInilize = true;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
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

    this.getAllCategoryInfo();
  }

  /**
   * get params of active route to get module id and schema id
   */
  private getRouteParams() {
    this.activateRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;
      this.getSchemaStatics(this.schemaId);
      this.getSubscriberList(this.schemaId);
      this.getBusinessRuleList(this.schemaId);

      this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res => {
        this.schemaDetails = res;
      }, error => console.error('Error : {}', error.message));
    })
  }


  getAllCategoryInfo() {
    this.schemaDetailsService.getAllCategoryInfo().subscribe(res => {
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
  public getSchemaStatics(schemaId: string) {
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
  public getPercentageStatics(statics: SchemaStaticThresholdRes) {
    this.thresholdValue = Math.round((statics.threshold + Number.EPSILON) * 100) / 100;
    this.errorValue = Math.round(((statics.errorCnt / statics.totalCnt) + Number.EPSILON) * 100 * 100) / 100;
    this.successValue = Math.round(((statics.successCnt / statics.totalCnt) + Number.EPSILON) * 100 * 100) / 100;
  }

  /**
   * update fragement of route according to the selected tab
   * @param event matTab event object
   */
  public updateFragment(tabLabel: string) {
    if (tabLabel) {
      this.router.navigate(['/home/schema/schema-info', this.moduleId, this.schemaId], { queryParams: { fragment: tabLabel } })
    }

    switch(tabLabel){
      case 'business-rules':
        this.selectedIndex = 1;
        break;
      case 'subscribers':
        this.selectedIndex = 2;
        break;
      case 'execution-logs':
        this.selectedIndex = 3;
        break;
    }
  }




  /**
   * Function to Api call to get subscribers according to schema ID
   * @param schemaId current schema id
   */
  public getSubscriberList(schemaId: string) {
    this.schemaDetailsService.getCollaboratorDetails(schemaId).subscribe((responseData) => {
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
          filter.filterCtrl = { fldCtrl: data.fldCtrl, selectedValeus: dropVal };
          data.filterCtrl = filter.filterCtrl;
        })
      }),
        this.subscriberData = responseData;
    }, error => {
      console.log('Error while fetching subscriber information', error.message)
    })
  }

  /**
   * Function to Api call to get business rules according to schema ID
   * @param schemaId current schema id
   */
  public getBusinessRuleList(schemaId: string) {
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
  public shortName(fName: string, lName: string) {
    if (fName.length >= 1 && lName.length >= 1) {
      return fName[0] + lName[0];
    } else {
      return '';
    }
  }


  /**
   * Function to open sidesheet to add subscriber
   */
  public addSubscriber() {
    this.router.navigate(['', { outlets: { sb: `sb/schema/subscriber/${this.moduleId}/${this.schemaId}/new` } }]);
  }

  /**
   * Function to open sidesheet to add business rule
   */
  public addBusinessRule() {
    this.router.navigate(['', { outlets: { sb: `sb/schema/business-rule/${this.moduleId}/${this.schemaId}/new` } }]);
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
    this.schemaService.updateBrMap(request).subscribe(res => {
      if (res) {
        this.getBusinessRuleList(this.schemaId);
      }
    }, error => console.error(`Error : ${error.message}`));
  }

  /**
   * update br category ..
   * @param cat updateable category ..
   * @param br business rule which is going for update
   */
  updateCategory(cat: CategoryInfo, br: CoreSchemaBrInfo) {
    br.brId = br.brIdStr;
    br.categoryId = cat.categoryId;
    this.schemaService.createBusinessRule(br).subscribe(res => {
      this.getBusinessRuleList(this.schemaId);
    }, error => {
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
      if (br) {
        const request: CoreSchemaBrMap = new CoreSchemaBrMap();
        request.schemaId = this.schemaId;
        request.brId = br.brIdStr;
        request.order = event.currentIndex;
        request.brWeightage = Number(br.brWeightage);
        request.status = br.status
        this.schemaService.updateBrMap(request).subscribe(res => {
          if (res) {
            this.getBusinessRuleList(this.schemaId);
          }
        }, error => console.error(`Error : ${error.message}`));
      }
    }
  }

  /**
   * Delete business rule by id
   * @param br delete by br id
   */
  deleteBr(br: CoreSchemaBrInfo) {
    if (br.brIdStr) {
      this.schemaService.deleteBr(br.brIdStr).subscribe(res => {
        this.getBusinessRuleList(this.schemaId);
      }, error => console.error(`Error : ${error.message}`));
    }
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


  makeFilterControl(event: ReadyForApplyFilter, sNo: number) {
    const exitingFilterCtrl = [];

    const filterCtrl: FilterCriteria = new FilterCriteria();
    filterCtrl.fieldId = event.fldCtrl.fieldId;
    filterCtrl.type = 'DROPDOWN';
    filterCtrl.values = event.selectedValeus.map(map => map.CODE);

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
              console.log(response);
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
    const selCtrl = ctrl.filterCtrl.selectedValeus.filter(fil => fil.FIELDNAME === ctrl.fieldId);
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
  public deleteSubscriber(sNo: string) {
    this.schemaDetailsService.deleteCollaborator(sNo).subscribe(res => {
      this.matSnackBar.open('Subscriber deleted successfully.', 'okay', {duration: 5000});
      this.getSubscriberList(this.schemaId);
    })
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
        console.log(subscriber.sno, sNo)
        if (subscriber.sno === sNo) {
          subscriber.schemaId = this.schemaId;
          subscriber.sno = sNo.toString();
          delete subscriber.userMdoModel;

          subscriber.filterCriteria.forEach((res) => {
            console.log(res.fieldId, selectedValues[0].FIELDNAME)
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
   * function to open dataScope side sheet(Add new data scope)
   */
  addDataScope(){
    this.router.navigate([{ outlets: { sb: `sb/schema/data-scope/new` } }])
  }
}