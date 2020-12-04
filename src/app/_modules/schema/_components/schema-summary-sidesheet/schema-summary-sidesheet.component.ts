import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { MatSliderChange } from '@angular/material/slider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionOn, SchemaCollaborator, SchemaDashboardPermission, UserMdoModel } from '@models/collaborator';
import { AddFilterOutput, CheckDataBrs, CheckDataRequest, CheckDataSubscriber } from '@models/schema/schema';
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
import { forkJoin, Subscription } from 'rxjs';

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
  subscriberData: SchemaDashboardPermission[] = [];

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
   * Outlet name in which side sheet to be opened
   */
  outlet = 'outer';

  /**
   * To hold all business rules information
   */
  allBusinessRulesList: CoreSchemaBrInfo[] = [];

  /**
   * To hold all subscriber information
   */
  allSubscribers: UserMdoModel[] = [];

  /**
   * To hold fetchCount for getting subscriber api
   */
  fetchCount = 0;

  /**
   * To hold check data subscribers details
   */
  checkDataSubscribersData = [];

  /**
   * To hold check data busines rules details
   */
  checkDataBRsData = [];

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

    this.sharedService.getAfterBrSave().subscribe(res => {
      if (res) {
        this.businessRuleData.push(...res);
      }
    });

    this.sharedService.getAfterSubscriberSave().subscribe(res => {
      if (res) {
        this.subscriberData.push(...res);
      }
    })

    this.getCollaborators('', this.fetchCount); // To fetch all users details (will use to show in auto complete)
    this.getAllBusinessRulesList(this.moduleId, '', '', '0'); // To fetch all BRs details (will use to show in auto complete)
  }

  /**
   * get params of active route to get module id and schema id
   */
  private getRouteParams() {
    this.activateRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;

      this.getSchemaVariants(this.schemaId);
      this.getSchemaDetails(this.schemaId);
    })
  }


  /**
   * Function to get schema details
   * @param schemaId: Id of schema
   */
  getSchemaDetails(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId).subscribe(res => {
      this.schemaDetails = res;
      if (this.schemaDetails.runId) {
        this.getCheckDataDetails(this.schemaId);
      } else {
        this.getSubscriberList(this.schemaId);
        this.getBusinessRuleList(this.schemaId);
      }
    }, (error) => console.error('Error : {}', error.message));
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


  /**
   * Function to Api call to get subscribers according to schema ID
   * @param schemaId current schema id
   */
  public getSubscriberList(schemaId: string) {
    const subscriberData = this.schemaDetailsService.getCollaboratorDetails(schemaId).subscribe((responseData) => {
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
    const businessRuleList = this.schemaService.getBusinessRulesBySchemaId(schemaId).subscribe((responseData) => {
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
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      if (response && response === 'yes') {
        const brToBeDelete = this.businessRuleData.filter((businessRule) => businessRule.brId === br.brId)[0];
        const index = this.businessRuleData.indexOf(brToBeDelete);
        this.businessRuleData.splice(index, 1);
      }
    })
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
  runSchema() {
    const schemaExecutionReq: SchemaExecutionRequest = new SchemaExecutionRequest();
    schemaExecutionReq.schemaId = this.schemaId;
    schemaExecutionReq.variantId = '0'; // 0 for run all
    this.schemaExecutionService.scheduleSChema(schemaExecutionReq, true).subscribe(data => {
      this.schemaDetails.isInRunning = true;
    }, (error) => {
      console.log('Something went wrong while running schema', error.message);
    });
  }


  makeFilterControl(event: AddFilterOutput, sNo: number) {
    const exitingFilterCtrl = [];

    const filterCtrl: FilterCriteria = new FilterCriteria();
    filterCtrl.fieldId = event.fldCtrl.fieldId;
    filterCtrl.type = 'DROPDOWN';
    filterCtrl.values = [];
    event.selectedValues.forEach((value) => {
      if (value.FIELDNAME === filterCtrl.fieldId) {
        filterCtrl.values.push(value.CODE)
      }
    })
    filterCtrl.fldCtrl = event.fldCtrl;

    exitingFilterCtrl.push(filterCtrl);
    let flag = false;
    this.subscriberData.forEach((subscriber) => {
      if (subscriber.sno === sNo) {
        if (subscriber.filterCriteria.length === 0) {
          subscriber.filterCriteria = [];
          subscriber.filterCriteria.push(filterCtrl);
          return;
        }
        subscriber.filterCriteria.forEach((res) => {
          if (event.fldCtrl.fieldId === res.fieldId) {
            res.values.push(...filterCtrl.values);
            flag = true;
          }
        })
        if (flag === false) {
          subscriber.filterCriteria.push(filterCtrl);
        }
      }
    })
  }


  /**
   * Function to show chips of selected filters
   * @param ctrl Filter criteria
   */
  prepareTextToShow(ctrl: FilterCriteria) {
    if (ctrl.values.length > 1) {
      return ctrl.values.length;
    } else {
      return ctrl.values[0];
    }
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
        const subscriberToBeDel = this.subscriberData.filter((subscriber => subscriber.sno === sNo))[0];
        const index = this.subscriberData.indexOf(subscriberToBeDel);
        this.subscriberData.splice(index, 1);
      }
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
   * Function to fetch selected subscriber from a dropdown
   * @param selectedValues list of selected drop down values
   * @param sNo serial number of subscriber
   */
  fetchSelectedValues(selectedValues, sNo: number) {
    if (selectedValues.length > 0) {
      this.subscriberData.forEach((subscriber) => {
        if (subscriber.sno === sNo) {
          subscriber.filterCriteria.forEach((res) => {
            if (res.fieldId === selectedValues[0].FIELDNAME) {
              res.values = [];
              res.values = selectedValues.map((value) => value.CODE)
            }
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
   * Function to check for the maximum available threshold for business rule
   * @param weightage threshold of the business rule.
   * @returns maximum value of slider to available.
   */
  availableWeightage(weightage: string): number {
    let sumOfAllWeightage = 0; // store sum of all business rules weightage
    let freeWeight = 0;        // store max free weightage for any business rule

    this.businessRuleData.forEach((businessRule) => {
      sumOfAllWeightage = Number(businessRule.brWeightage) + sumOfAllWeightage;
    })
    freeWeight = 100 - sumOfAllWeightage;

    return freeWeight + Number(weightage); // max value to slide for a business rule
  }


  /**
   * Function to close summary sidesheet on click
   */
  close() {
    this.router.navigate([{ outlets: { sb: null } }])
  }

  /**
   * Function to open business rule library side sheet
   */
  openBusinessRuleSideSheet() {
    this.router.navigate(['', { outlets: { outer: `outer/schema/businessrule-library/${this.moduleId}/${this.schemaId}/${this.outlet}` } }])
  }

  /**
   * Function to open subscriber side sheet
   */
  openSubscriberSideSheet() {
    this.router.navigate(['', { outlets: { outer: `outer/schema/subscriber/${this.moduleId}/${this.schemaId}/new/${this.outlet}` } }])
  }

  /**
   * Function to get all business rules information
   */
  getAllBusinessRulesList(moduleId: string, searchString: string, brType: string, fetchCount: string) {
    const getAllBrSubscription = this.schemaService.getBusinessRulesByModuleId(moduleId, searchString, brType, fetchCount).subscribe((rules: CoreSchemaBrInfo[]) => {
      if (rules && rules.length > 0) {
        this.allBusinessRulesList = rules;
      }
    }, (error) => {
      console.error('Error while getting all business rules list', error.message);
    });
    this.subscriptions.push(getAllBrSubscription);
  }

  /**
   * function to get collaboratos/subscribers from the api
   * @param queryString: pass query param to fetch values from the api
   * @param fetchCount: count to fetch subscribers into batches
   */
  getCollaborators(queryString: string, fetchCount: number) {
    this.schemaDetailsService.getAllUserDetails(queryString, fetchCount)
      .subscribe((response: PermissionOn) => {
        if (response && response.users) {
          const subscribers: UserMdoModel[] = response.users;
          this.allSubscribers = subscribers;
        }
      }, (error) => {
        console.error('Something went wrong while getting subscribers', error.message);
      });
  }

  /**
   * Function to add business rule from autocomplete
   * @param brInfo: object contains business rule info
   */
  addBusinessRule(brInfo) {
    this.businessRuleData.push(brInfo); // Push it into current Business rule listing array..
  }

  /**
   * Function to add subscriber from autocomplete
   * @param subscriberInfo: object contains subscriber info
   */
  addSubscriber(subscriberInfo) {
    const subscriber = {
      sno: Math.floor(Math.random() * Math.pow(100000, 2)),
      userMdoModel: subscriberInfo,
      filterCriteria: [],
      schemaId: this.schemaId,
      isAdmin: false,
      isReviewer: false,
      isViewer: true,
      isEditer: false,
      groupid: '',
      roleId: '',
      userid: subscriberInfo.userName,
      permissionType: 'USER',
      plantCode: '',
      isCopied: false
    } as SchemaDashboardPermission;

    this.subscriberData.push(subscriber); // Push it into current Subscribers listing array..
  }

  /**
   * Function to get schema check data information
   * @param schemaId: Schema Id
   * @param runId: run Id of schema
   */
  getCheckDataDetails(schemaId: string) {
    this.schemaService.getCheckData(schemaId).subscribe((res) => {
      console.log(res);
      this.subscriberData = res.CollaboratorModel;
      this.businessRuleData = res.BrModel;
      if (this.subscriberData.length === 0 && this.businessRuleData.length === 0) {
        this.getSubscriberList(this.schemaId);
        this.getBusinessRuleList(this.schemaId);
      }
    }, (error) => {
      console.log('Something went wrong while getting check data details', error.message);
    })
  }

  /**
   * Function to save check data
   */
  saveCheckData() {
    const checkDataSubscriber = [];
    const checkDataBrs = [];

    this.subscriberData.forEach((subscriber) => {
      subscriber.sno = Math.floor(Math.random() * Math.pow(100000, 2));
      subscriber.isCopied = true;
      subscriber.schemaId = this.schemaId;

      const subscriberObj = {} as CheckDataSubscriber;


      subscriberObj.collaboratorId = subscriber.sno;
      checkDataSubscriber.push(subscriberObj);
    });

    const forkObj = {};
    this.businessRuleData.forEach((businessRule, index) => {
      businessRule.isCopied = true;
      businessRule.brId = null;
      businessRule.brIdStr = null;
      businessRule.moduleId = this.moduleId;
      businessRule.schemaId = this.schemaId;

      forkObj[index] = this.schemaService.createBusinessRule(businessRule)
    })

    const subscriberSnos = this.schemaDetailsService.createUpdateUserDetails(this.subscriberData)

    forkJoin({ ...forkObj, subscriberSnos }).subscribe(res => {
      console.log(res);
      if (res) {
        let keyArr: any = Object.values(res);
        keyArr = keyArr.slice(0, keyArr.length - 1);
        console.log(keyArr);
        keyArr.forEach(key => {
          const businessRuleObj = {} as CheckDataBrs;
          businessRuleObj.brId = key.brIdStr,
            businessRuleObj.brExecutionOrder = key.order

          checkDataBrs.push(businessRuleObj);
        })

        const checkDataObj: CheckDataRequest = {
          schemaId: this.schemaId,
          runId:  null,
          brs: checkDataBrs,
          collaborators: checkDataSubscriber
        }
        console.log(checkDataObj)

        this.schemaService.createUpdateCheckData(checkDataObj).subscribe((result) => {
          console.log(result);
          // this.createSchedule();
          this.runSchema();
          this.close();
          this.matSnackBar.open('This action has been confirmed..', 'Okay', {
            duration: 2000
          })
        }, (error) => {
          console.log('Something went wrong while checking data', error.message);
        });
      }
    })
  }

  /**
   * Function to open sidesheet to Upload data
   */
  public openUploadSideSheet() {
    this.router.navigate(['', { outlets: { outer: `outer/schema/upload-data/${this.moduleId}/${this.outlet}` } }]);
  }
}
