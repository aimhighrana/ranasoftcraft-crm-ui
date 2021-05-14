import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatSliderChange } from '@angular/material/slider';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionOn, SchemaCollaborator, SchemaDashboardPermission, UserMdoModel, ROLES, RuleDependentOn } from '@models/collaborator';
import { AddFilterOutput, CheckDataBrs, CheckDataRequest, CheckDataSubscriber } from '@models/schema/schema';
import { SchemaExecutionRequest } from '@models/schema/schema-execution';
import { CategoryInfo, FilterCriteria } from '@models/schema/schemadetailstable';
import { CoreSchemaBrMap, LoadDropValueReq, SchemaListDetails, VariantDetails } from '@models/schema/schemalist';
import { CoreSchemaBrInfo, CreateUpdateSchema, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaExecutionService } from '@services/home/schema/schema-execution.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { TransientService } from 'mdo-ui-library';
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

  /**
   * to have subscribers data of schema
   */
  subscriberData: SchemaDashboardPermission[] = [];

  /**
   * To have business rule data of schema
   */
  businessRuleData: CoreSchemaBrInfo[] = [];
  activeTab: string;
  selectedIndex: number;
  category: CategoryInfo[];
  schemaDetails: SchemaListDetails = new SchemaListDetails();
  loadDopValuesFor: LoadDropValueReq;
  collaboratorData: SchemaCollaborator;
  reInilize = true;

  /**
   * To have variant details of a schema
   */
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
   * Null state message to show when schema does not have any business rule added
   */
  brsNullMessage = `You don't have any business rules selected. Type the business rule in the box above to add one.`;

  /**
   * Null state message to show when schema does not have any subscriber added
   */
  subscribersNullMessage = `You don't have any subscribers selected. Type the user's name in the box above to add one.`;

  /**
   * formcontrol for schema Name to be passed to child component
   */
  schemaName: FormControl = new FormControl('', Validators.required);

  /**
   * formcontrol for data scope
   */
  dataScopeControl: FormControl = new FormControl('0');

  /**
   * formcontrol for schema threshold
   */
  schemaThresholdControl: FormControl = new FormControl(0);

  /**
   * To hold updated schema name
   */
  updatedSchemaName: string;

  /**
   * To hold all the roles of subscriber
   */
  roles = ROLES;

  /**
   * To check whether to show schema name input field
   */
  isFromCheckData = false;

  moduleDesc: string;

  /**
   * To hold all the subscriptions related to component
   */
  subscriptions: Subscription[] = [];

  depRuleList = [{ value: 'ALL', key: 'ALL' }, { value: 'SUCCESS', key: 'SUCCESS' }, { value: 'FAILURE', key: 'ERROR' }];

  submitted = false;

  /**
   * function to format slider thumbs label.
   * @param percent percent
   */
  rangeSliderLabelFormat(percent) {
    return `${percent}%`;
  }

  getCurrentBrStatusObj(status) {
    return this.depRuleList.find(depRule => depRule.key === status) || this.depRuleList[0];
  }

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
    private schemaListService: SchemalistService,
    private schemaExecutionService: SchemaExecutionService,
    private schemaVariantService: SchemaVariantService,
    private toasterService: TransientService,
    private globalDialogService: GlobaldialogService
  ) { }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {

    this.getRouteParams();

    const brSave = this.sharedService.getAfterBrSave().subscribe(res => {
      if (res) {
        console.log(res);
        this.businessRuleData = this.businessRuleData.concat(res);
        console.log(this.businessRuleData);
      }
    });
    this.subscriptions.push(brSave);

    this.sharedService.getAfterSubscriberSave().subscribe(res => {
      if (res) {
        this.subscriberData.push(...res);
      }
    });

    this.sharedService.getDataScope().subscribe(res => {
      if(res) {
        this.dataScopeControl.setValue(res);
        this.getSchemaVariants(this.schemaId, 'RUNFOR');
      }
    })

    this.getCollaborators('', this.fetchCount); // To fetch all users details (will use to show in auto complete)
    this.getAllBusinessRulesList(this.moduleId, '', '', '0'); // To fetch all BRs details (will use to show in auto complete)
  }

  /**
   * get params of active route to get module id and schema id
   */
  public getRouteParams() {

    this.activateRoute.queryParams.subscribe((params) => {
      console.log(params);
      this.isFromCheckData = Boolean(params.isCheckData === 'true');
      this.moduleDesc = params.name;
    })


    this.activateRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;

      if(this.schemaId && this.schemaId !== 'new') {
        this.getSchemaVariants(this.schemaId, 'RUNFOR');
        this.getSchemaDetails(this.schemaId);
      } else {
        this.getModuleInfo();
      }

    });
  }


  /**
   * Function to get schema details
   * @param schemaId: Id of schema
   */
  getSchemaDetails(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId).subscribe(res => {
      this.schemaDetails = res;
      this.getModuleInfo();
      this.schemaName.setValue(this.schemaDetails.schemaDescription);
      this.schemaThresholdControl.setValue(this.schemaDetails.schemaThreshold);
      if (this.schemaDetails.runId && this.isFromCheckData) {
        this.getCheckDataDetails(this.schemaId);
      } else {
        this.getSubscriberList(this.schemaId);
        this.getBusinessRuleList(this.schemaId);
      }
    }, (error) => console.error('Error : {}', error.message));
  }

  public getModuleInfo() {
    const moduleInfoByModuleId = this.schemaService.getModuleInfoByModuleId(this.moduleId).subscribe((moduleData) => {
      const module = moduleData[0];
      if (module) {
        this.schemaDetails.moduleDescription = module.moduleDesc;
        this.schemaDetails.moduleId = module.moduleId;
      }
    }, error => {
      console.error('Error: {}', error.message);
    });
    this.subscriptions.push(moduleInfoByModuleId);
  }

  /**
   * Function to get dataScope/variants of schema
   * @param schemaId : ID of schema
   */
  getSchemaVariants(schemaId: string, type: string) {
    const schemaVariantList = this.schemaVariantService.getAllDataScopeList(schemaId, type).subscribe(response => {
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
      if(responseData && responseData.length>0){
        this.businessRuleData = responseData;
        this.businessRuleData.forEach((businessRule) => {
          businessRule.isCopied = true;
          businessRule.copiedFrom = null;
          businessRule.schemaId = null;
          businessRule.dependantStatus=RuleDependentOn.ALL;
        })
        console.log(this.businessRuleData)
      }
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
    if (fName && lName && fName.length >= 1 && lName.length >= 1) {
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
  updateBr(br: CoreSchemaBrInfo, event?: any, eventName?: string) {
    const businessRule: CoreSchemaBrInfo = this.businessRuleData.filter((rule) => rule.brIdStr === br.brIdStr)[0];
    if (event instanceof MatSliderChange) {
      businessRule.brWeightage = String((event as MatSliderChange).value);
    }
    else if (eventName === 'checkbox') {
      businessRule.status = event ? '1' : '0';
    }
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
        request.status = br.status;
      }
    }
  }

  /**
   * Delete business rule by id
   * @param br delete by br id
   */
  deleteBr(br: CoreSchemaBrInfo) {
    const index= this.businessRuleData.findIndex(element=>element.brId===br.brId);
    let label='Are you sure to delete ?';
    if(this.businessRuleData[index].dep_rules)
    label='After delete the dependent rules will removed';
    this.globalDialogService.confirm({ label }, (response) => {
      if (response && response === 'yes') {
        const brToBeDelete = this.businessRuleData.filter((businessRule) => businessRule.brId === br.brId)[0];
        const innerindex = this.businessRuleData.indexOf(brToBeDelete);
        this.businessRuleData.splice(innerindex, 1);
      }
    })
  }

  /**
   * Delete child business rule  by id
   * @param br delete by br id
   */
  deleteBrChild(br: CoreSchemaBrInfo,parentbr: CoreSchemaBrInfo) {
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      if (response && response === 'yes') {
        const idx=this.businessRuleData.findIndex(element=>element.brId===parentbr.brId);
        const childIdx=this.businessRuleData[idx].dep_rules;
        const brToBeDelete = childIdx.filter((businessRule) => businessRule.brId === br.brId)[0];
        const index = this.businessRuleData.indexOf(brToBeDelete);
       this.businessRuleData[idx].dep_rules.splice(index,1);
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
    schemaExecutionReq.variantId = this.dataScopeControl.value ? this.dataScopeControl.value : '0'; // 0 for run all
    this.schemaExecutionService.scheduleSChema(schemaExecutionReq, true).subscribe(data => {
      this.schemaDetails.isInRunning = true;
      this.sharedService.setSchemaRunNotif(true);
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
  openBrLibrarySideSheet() {
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
    if(this.businessRuleData.length > 0) {
      const checkExistence = this.businessRuleData.filter((businessRule) => businessRule.brIdStr === brInfo.brIdStr)[0];
      console.log(checkExistence,this.businessRuleData)
      if(checkExistence) {
        this.toasterService.open('Business rule already added.', 'ok', {
          duration: 2000,
        });
        return;
      }
    }
    brInfo.brWeightage = 0;
    brInfo.isCopied = false;
    brInfo.schemaId = null;
    brInfo.copiedFrom = brInfo.brIdStr;
    brInfo.dependantStatus=RuleDependentOn.ALL;
    this.businessRuleData.push(brInfo); // Push it into current Business rule listing array..
  }

  /**
   * Function to add subscriber from autocomplete
   * @param subscriberInfo: object contains subscriber info
   */
  addSubscriber(subscriberInfo) {

    const checkExistence = this.subscriberData.filter((sub) => sub.userid === subscriberInfo.userName)[0];
    if(checkExistence) {
      this.toasterService.open('Subscriber already added.', 'ok', {
        duration: 2000
      });
      return;
    }

    const subscriber = {
      sno: subscriberInfo.sno ? subscriberInfo.sno : Math.floor(Math.random() * Math.pow(100000, 2)),
      userMdoModel: subscriberInfo,
      filterCriteria: [],
      schemaId: this.schemaId,
      isAdmin: false,
      isReviewer: false,
      isViewer: false,
      isEditer: true,
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
    this.submitted = true;
    if(!this.schemaName.valid) {
      return;
    }
    this.updatedSchemaName=this.schemaName.value;
    if((this.schemaDetails.schemaDescription !== this.updatedSchemaName ||
        this.schemaDetails.schemaThreshold !== this.schemaThresholdControl.value)||
        this.schemaId === 'new'){
        const schemaReq: CreateUpdateSchema = new CreateUpdateSchema();
        schemaReq.schemaId = this.schemaId === 'new' ? '' : this.schemaId;
      schemaReq.moduleId = this.moduleId;
      schemaReq.discription = this.updatedSchemaName ? this.updatedSchemaName : this.schemaDetails.schemaDescription;
      schemaReq.schemaThreshold = this.schemaThresholdControl.value;

      this.schemaService.createUpdateSchema(schemaReq).subscribe((response) => {
        console.log('Schema updated successfully.');
        this.prepareData(response);
      },(error) => {
        console.error('Something went wrong while updating schema.', error.message);
      })
    }
    else {
      this.prepareData(this.schemaId);
    }
  }


  /**
   * Function to add business rules and subscribers
   * @param schemaId Schema Id
   */
  prepareData(schemaId) {
    const checkDataSubscriber = [];
    const checkDataBrs = [];

    this.subscriberData.forEach((subscriber) => {
      subscriber.sno = subscriber.sno ? subscriber.sno : Math.floor(Math.random() * Math.pow(100000, 2));
      subscriber.isCopied = this.isFromCheckData ? true : false;
      subscriber.schemaId = schemaId;

      const subscriberObj = {} as CheckDataSubscriber;


      subscriberObj.collaboratorId = Number(subscriber.sno);
      checkDataSubscriber.push(subscriberObj);
    });

    const forkObj = {};
    let counter=0;
    this.businessRuleData.forEach((businessRule) => {
      businessRule.isCopied = true;
      businessRule.brId = businessRule.brIdStr ? businessRule.brIdStr : null;
      businessRule.brIdStr = businessRule.brIdStr ? businessRule.brIdStr : null;
      businessRule.moduleId = this.moduleId;
      businessRule.schemaId = schemaId;
      businessRule.order = counter;
      businessRule.dependantStatus = RuleDependentOn.ALL;
      forkObj[counter] = this.isFromCheckData ?
            this.schemaService.createCheckDataBusinessRule(businessRule) :
            this.schemaService.createBusinessRule(businessRule);
      counter++;
      if (businessRule.dep_rules)
        businessRule.dep_rules.forEach(element => {
            element.order = counter;
            forkObj[counter] = this.isFromCheckData ?
                this.schemaService.createCheckDataBusinessRule(element) :
                this.schemaService.createBusinessRule(element);
            counter++
        });

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
          schemaId,
          runId:  null,
          brs: checkDataBrs,
          collaborators: checkDataSubscriber
        }
        console.log(checkDataObj)

        this.schemaService.createUpdateCheckData(checkDataObj).subscribe((result) => {
          console.log(result);
          this.runSchema();
          this.close();
          this.toasterService.open('Schema run triggered successfully..', 'Okay', {
            duration: 2000
          })
        }, (error) => {
          console.log('Something went wrong while checking data', error.message);
        });
      }
      else {
        this.close();
      }
    })
  }

  /**
   * Function to open sidesheet to Upload data
   */
  public openUploadSideSheet() {
    this.router.navigate(['', { outlets: { outer: `outer/schema/upload-data/${this.moduleId}/${this.outlet}` } }]);
  }

  /**
   * Function to update role of subscriber
   * @param subscriber subscriber object
   * @param role new role of subscriber
   */
  updateRole(subscriber, role) {
    this.roles.forEach((r) => {
      subscriber[r.code] = false;
    });

    this.subscriberData.forEach((subs) => {
      if(subs.userid === subscriber.userid) {
        subs[role] = true;
        return;
      }
    })
  }


  updateDepRule(br: CoreSchemaBrInfo, event?: any) {
    console.log('Update dep rule', br, event);
    const index = this.businessRuleData.findIndex(item=>item.brIdStr===br.brIdStr);
    console.log(index,br,event)
    if(event.value!==RuleDependentOn.ALL)
    { const tobeChild=this.businessRuleData[index]
    console.log(tobeChild)
    console.log(this.businessRuleData)
    if(this.businessRuleData[index-1].dep_rules)
    {
     this.addChildatSameRoot(tobeChild,index)
    }
    else{
    this.businessRuleData[index-1].dep_rules=[];
    this.addChildatSameRoot(tobeChild,index)
    }
    const idxforChild=this.businessRuleData[index-1].dep_rules.indexOf(tobeChild);
    this.businessRuleData[index-1].dep_rules[idxforChild].dependantStatus=event.key || event.value;
    this.businessRuleData.splice(index,1)
    }
  }

  addChildatSameRoot(tobeChild:CoreSchemaBrInfo,index:number){
    this.businessRuleData[index-1].dep_rules.push(tobeChild)
    if(tobeChild.dep_rules)
    tobeChild.dep_rules.forEach(element=>{
      this.businessRuleData[index-1].dep_rules.push(element);
    });
  }

  updateDepRuleForChild(br: CoreSchemaBrInfo,index:number, event?: any) {
   const idx=this.businessRuleData.findIndex(item=>item.brIdStr===br.brIdStr);
  //  this.businessRuleData[idx].dep_rules[index].dependantStatus=event.value;
   if(event.value===RuleDependentOn.ALL)
  { const childBr=this.businessRuleData[idx].dep_rules[index]
  console.log(childBr)
  childBr.dependantStatus=event.value;
  this.businessRuleData.push(childBr)
  this.businessRuleData[idx].dep_rules.splice(index,1);
  }
    console.log(this.businessRuleData)
  }

  get getBusinessRulesLength(){
    let inn=0;
    const count=this.businessRuleData.map(element=>{
      if(element.dep_rules)
     inn+= element.dep_rules.length;
    }).length
    return count+inn;
  }
  /**
   * Function to open data scope side sheet
   */
  openDataScopeSideSheet() {
    this.router.navigate([ { outlets: { outer: `outer/schema/data-scope/${this.moduleId}/${this.schemaId}/new/${this.outlet}` } }], {queryParamsHandling: 'preserve'});
  }
  /**
   * Function to open new br sidesheet
   */
  openBusinessRuleSideSheet() {
    this.router.navigate(['', { outlets: { outer: `outer/schema/business-rule/${this.moduleId}/${this.schemaId}/new/outer`} }]);
  }
}
