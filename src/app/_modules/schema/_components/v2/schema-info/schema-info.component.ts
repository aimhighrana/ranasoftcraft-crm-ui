import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SchemaService } from '@services/home/schema.service';
import { CoreSchemaBrMap, SchemaListDetails, LoadDropValueReq, VariantDetails } from '@models/schema/schemalist';
import { PermissionOn, ROLES, RuleDependentOn, SchemaCollaborator, SchemaDashboardPermission, UserMdoModel } from '@models/collaborator';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { CoreSchemaBrInfo, CreateUpdateSchema, DropDownValue, DuplicateRuleModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SecondaynavType } from '@models/menu-navigation';
import { CategoryInfo, FilterCriteria } from '@models/schema/schemadetailstable';
import { MatSliderChange } from '@angular/material/slider';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddFilterOutput } from '@models/schema/schema';
import { FormControl, FormGroup } from '@angular/forms';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { GlobaldialogService } from '@services/globaldialog.service';
import { forkJoin, Subject, Subscription } from 'rxjs';
import { SchemaScheduler } from '@models/schema/schemaScheduler';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { TransientService } from 'mdo-ui-library';

@Component({
  selector: 'pros-schema-info',
  templateUrl: './schema-info.component.html',
  styleUrls: ['./schema-info.component.scss']
})
export class SchemaInfoComponent implements OnInit, OnDestroy {

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

  businessRuleData: CoreSchemaBrInfo[] = [];
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
   * To have the info about schedule
   */
  scheduleInfo: SchemaScheduler;

  /**
   * To check whether show edit schedule or add schedule button
   */
  canEditSchedule: boolean;

  /**
   * To store all subscribers..
   */
  allSubscribers = [];

  allBusinessRulesList: CoreSchemaBrInfo[] = [];

  /**
   * outlet name in which sheets to be opened
   */
  outlet = 'sb';

  /**
   * To hold all roles of suscribers
   */
  roles = ROLES;

  /**
   * Null state message to show when schema does not have any business rule
   */
  brsNullMessage = `You don't have any business rules selected. Type the business rule in the box above to add one.`;

  /**
   * Null state message to show when schema does not have any subscriber
   */
  subscribersNullMessage = `You don't have any subscribers selected. Type the user's name in the box above to add one.`;

  /**
   * To hold all the subscriptions related to component
   */
  subscriptions: Subscription[] = [];

  /**
   * To hold all tab labels
   */
  infoTabs: string[] = ['summary', 'business-rules', 'subscribers', 'Schedule', 'Statistics'];

  depRuleList = [{ value: 'ALL', key: 'ALL' }, { value: 'SUCCESS', key: 'SUCCESS' }, { value: 'FAILURE', key: 'ERROR' }];

  /**
   * To trigger debounced event on schema name changed
   */
  schemaValueChanged: Subject<string> = new Subject<string>();
  schemaThresholdChanged: Subject<string> = new Subject<string>();

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private route: ActivatedRoute,
    private schemaService: SchemaService,
    private schemaDetailsService: SchemaDetailsService,
    private sharedService: SharedServiceService,
    private schemaListService: SchemalistService,
    private schemaVariantService: SchemaVariantService,
    private matSnackBar: MatSnackBar,
    private toasterService: TransientService,
    private globalDialogService: GlobaldialogService
  ) {
  }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
    this.getRouteParams();
    // this.getQueryParams();

    this.initializeSummaryForm(); // To initialize schema summary tab form

    const getBrSubscription = this.sharedService.getAfterBrSave().subscribe(res => {
      if (res) {
        this.getBusinessRuleList(this.schemaId);
        this.getAllBusinessRulesList(this.moduleId, '', '', '0')
      }
    });
    this.subscriptions.push(getBrSubscription);

    const getSubscriberSubscription = this.sharedService.getAfterSubscriberSave().subscribe(res => {
      if (res) {
        this.getSubscriberList(this.schemaId);
      }
    })
    this.subscriptions.push(getSubscriberSubscription);

    const getScheduleSubscription = this.sharedService.getScheduleInfo().subscribe((res) => {
      if (res) {
        this.getScheduleInfo(this.schemaId);
      }
    })
    this.subscriptions.push(getScheduleSubscription);

    const getDataScopeSubscription = this.sharedService.getDataScope().subscribe((res) => {
      if (res) {
        this.getSchemaVariants(this.schemaId, 'RUNFOR');
      }
    })
    this.subscriptions.push(getDataScopeSubscription);

    this.getAllCategoryInfo(); // To get info of business rules categories

    this.getScheduleInfo(this.schemaId); // To get info about schedule

    this.getCollaborators('', 0); // To get all the subscribers

    this.getAllBusinessRulesList(this.moduleId, '', '', '0'); // To get all business rules list
  }

  /**
   * get params of active route to get module id and schema id
   */
  private getRouteParams() {
    this.activateRoute.params.subscribe((params) => {
      this.moduleId = params.moduleId;
      this.schemaId = params.schemaId;

      this.getSchemaDetails(this.schemaId);
      this.getSubscriberList(this.schemaId);
      this.getBusinessRuleList(this.schemaId);
      this.getSchemaVariants(this.schemaId, 'RUNFOR');
    })
  }

  /**
   * Function to initialize schema summary tab form
   */
  initializeSummaryForm() {
    this.schemaSummaryForm = new FormGroup({
      schemaName: new FormControl(''),
      schemaDescription: new FormControl(''),
      schemaThreshold: new FormControl()
    })
    // this.schemaSummaryForm.get('schemaThreshold').disable(); // disable threshold slider..
  }

  /**
   * method to return the formcontrol
   */
  schemaField(fieldName) {
    return this.schemaSummaryForm.get(fieldName);
  }

  /**
   * function to get schema details
   * @param schemaId: Id of schema
   */
  getSchemaDetails(schemaId: string) {
    this.schemaListService.getSchemaDetailsBySchemaId(schemaId).subscribe(res => {
      this.schemaDetails = res;
      this.getModuleInfo();
      this.schemaSummaryForm.controls.schemaThreshold.setValue(this.schemaDetails.schemaThreshold);
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
   * Function to delete variant of a schema
   * @param variantId : ID of variant needs to be deleted
   */
  deleteVariant(variantId: string) {
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      this.deleteVariantAfterConfirm(response, variantId);
    });
  }

  deleteVariantAfterConfirm(response, variantId: string) {
    if (response && response === 'yes') {
      const deleteVariant = this.schemaVariantService.deleteVariant(variantId).subscribe(res => {
        if (res) {
          this.getSchemaVariants(this.schemaId, 'RUNFOR');
          this.toasterService.open('SuccessFully Deleted!!', 'close', { duration: 3000 })
        }
      }, error => {
        console.log('Error while deleting schema variant', error.message)
      })
      this.subscriptions.push(deleteVariant);
    }
  }

  /**
   * Function to open data scope side sheet in edit mode
   * @param variantId: ID of variant/data-scope
   */
  editDataScope(variantId: string) {
    this.router.navigate([{ outlets: { sb: `sb/schema/data-scope/${this.moduleId}/${this.schemaId}/${variantId}/sb` } }])
  }

  /**
   * Function to get all business rule categories..
   */
  getAllCategoryInfo() {
    const categoryInfo = this.schemaDetailsService.getAllCategoryInfo().subscribe(res => {
      this.category = res;
    }, error => console.error(`Error : ${error.message}`));
    this.subscriptions.push(categoryInfo);
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
   * update fragement of route according to the selected tab
   * @param event matTab event object
   */
  public updateFragment(tabLabel: string) {
    if (tabLabel) {
      this.router.navigate(['/home/schema/schema-info', this.moduleId, this.schemaId], { queryParams: { fragment: tabLabel } })
    }

    switch (tabLabel) {
      case 'business-rules':
        this.selectedIndex = 1;
        break;
      case 'subscribers':
        this.selectedIndex = 2;
        break;
      case 'execution-logs':
        this.selectedIndex = 3;
        break;
      default:
        break;
    }
  }
  /**
   * update fragement of route according to the selected tab index
   * @param event matTab event object
   */
  updateFragmentByIndex(tabIndex: number) {
    this.updateFragment(this.infoTabs[tabIndex]);
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
   * function to add subscriber from autocomplete list menu
   * @param subscriberInfo: Object having details of subscriber
   */
  addSubscriber(subscriberInfo) {
    const subscriber = {
      sno: Math.floor(Math.random() * Math.pow(100000, 2)),
      schemaId: this.schemaId,
      userid: subscriberInfo.userName,
      roleId: '',
      groupid: '',
      isAdmin: false,
      isViewer: false,
      isEditer: true,
      isReviewer: false,
      permissionType: 'USER',
      description: '',
      userMdoModel: {
        userId: subscriberInfo.userName,
        userName: subscriberInfo.userName,
        fName: subscriberInfo.fName,
        lName: subscriberInfo.lName,
        fullName: subscriberInfo.fullName,
        email: subscriberInfo.email
      },
      rolesModel: {
        roleId: '',
        roleDesc: ''
      },
      plantCode: '',
      filterCriteria: [],
      isCopied: false
    } as SchemaDashboardPermission

    const existSubscriber = this.subscriberData.filter((sub) => sub.userid === subscriber.userid)[0];
    if (existSubscriber) {
      this.matSnackBar.open('This subscriber is already added.', 'Okay', {
        duration: 2000
      })
    }
    else {
      this.schemaDetailsService.createUpdateUserDetails(Array(subscriber)).subscribe((response) => {
        if (response) {
          this.getSubscriberList(this.schemaId);
        }
      }, (error) => {
        console.error('Something went wrong while adding subscriber', error.message);
      })
    }
  }


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
    const businessRuleList = this.schemaService.getBusinessRulesBySchemaId(schemaId).subscribe((responseData) => {
      this.businessRuleData = responseData;
      this.businessRuleData.forEach(element => {
        if(!element.dependantStatus) {
          element.dependantStatus = 'ALL';
        }
      });
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
   * Function to open sidesheet to add subscriber
   */
  public openSubscriberSideSheet() {
    this.router.navigate(['', { outlets: { sb: `sb/schema/subscriber/${this.moduleId}/${this.schemaId}/new/${this.outlet}` } }]);
  }

  /**
   * Function to open sidesheet to add business rule
   */
  public openBusinessRuleSideSheet() {
    this.schemaService.currentweightage = this.availableWeightage('0');
    this.router.navigate(['', { outlets: { sb: `sb/schema/business-rule/${this.moduleId}/${this.schemaId}/new` } }]);
  }

  /**
   * @param br updateable business rules...
   * @param event value of chnaged
   * @param eventName name of the event
   */
  updateBr(br: CoreSchemaBrInfo, event?: any, eventName?: string) {
    const request: CoreSchemaBrMap = new CoreSchemaBrMap();
    if (event instanceof MatSliderChange) {
      request.brWeightage = (event as MatSliderChange).value;
    } else if (eventName === 'checkbox') {
      request.status = event ? '1' : '0';
    }
    request.schemaId = this.schemaId;
    request.brId = br.brIdStr;
    request.order = br.order;
    request.dependantStatus = br.dependantStatus;
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
   * update br category ..
   * @param cat updateable category ..
   * @param br business rule which is going for update
   */
  updateCategory(cat: CategoryInfo, br: CoreSchemaBrInfo) {
    const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();
    request.brId = br.brIdStr;
    request.schemaId = this.schemaId;
    request.categoryId = cat.categoryId;
    request.brInfo = br.brInfo;
    request.brType = br.brType;
    request.fields = br.fields;
    request.message = br.message;
    request.moduleId = this.moduleId;
    request.isCopied = false;
    request.brWeightage = br.brWeightage;
    request.status = br.status;
    const model = new DuplicateRuleModel();
    model.coreBrInfo = { ...request };
    const params = { objectId: this.moduleId, autoMerge: '', groupId: '' };
    if (br.brType === 'BR_DUPLICATE_CHECK') {
      this.schemaService.getBusinessRulesBySchemaId(this.schemaId).pipe(map(content => content.filter(dup => dup.brIdStr === br.brIdStr)[0])).subscribe(dupBr => {
        model.addFields = dupBr.duplicacyField;
        model.addFields[0].fId = model.addFields[0].fieldId;
        model.mergeRules = dupBr.duplicacyMaster;
        model.removeList = [];
        this.schemaService.saveUpdateDuplicateRule(model, params).subscribe(res => {
          this.getBusinessRuleList(this.schemaId);
        }, error => {
          console.error(`Error while updating schema .. `, error);
        });
      });

    }
    else {
      this.schemaService.createBusinessRule(request).subscribe(res => {
        this.getBusinessRuleList(this.schemaId);
      }, error => {
        console.error(`Error while updating schema .. `);
      });
    }
  }

  /**
   * Update order of business rule
   * @param event updateable ordre
   */
  drop(event: CdkDragDrop<any>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
      this.updateBrOrder();
    }
  }

  updateBrOrder() {
    const forkObj = {};
    let currentIndex = 0;
    this.businessRuleData.forEach((br) => {
      if (br) {
        const request: CoreSchemaBrMap = new CoreSchemaBrMap();
        request.schemaId = this.schemaId;
        request.brId = br.brIdStr;
        request.order = currentIndex;
        request.brWeightage = Number(br.brWeightage);
        request.status = br.status ? br.status : '0';
        request.dependantStatus = br.dependantStatus;
        forkObj[currentIndex] = this.schemaService.updateBrMap(request);
        currentIndex++;
        if (br.dep_rules)
          br.dep_rules.forEach(element => {
            request.schemaId = this.schemaId;
            request.brId = element.brIdStr;
            request.order = currentIndex;
            request.brWeightage = Number(element.brWeightage);
            request.status = br.status ? br.status : '0';
            request.dependantStatus = element.dependantStatus;
            forkObj[currentIndex] = this.schemaService.updateBrMap(request);
            currentIndex++;
          });
      }
    });
    forkJoin(forkObj).subscribe(res => {
      if (res)
        this.getBusinessRuleList(this.schemaId);
    });
  }

  /**
   * Delete business rule by id
   * @param br delete by br id
   */
  deleteBr(br: CoreSchemaBrInfo) {
    const index = this.businessRuleData.findIndex(item => item.brIdStr === br.brIdStr);
    let label = 'Are you sure to delete ?';
    if (this.businessRuleData[index].dep_rules)
      label = 'All the dependent rules will also be deleted. Do you wish to proceed ?';
    this.globalDialogService.confirm({ label }, (response) => {
      if (response && response === 'yes') {
        const forkObj = {};
        let counter = 0;
        if (br.brIdStr) {
          forkObj[counter] = this.schemaService.deleteBr(br.brIdStr);
          counter++;
          if (br.dep_rules)
            br.dep_rules.forEach(element => {
              forkObj[counter] = this.schemaService.deleteBr(element.brIdStr);;
              counter++;
            });
          const deleteSubscriber = forkJoin(forkObj).subscribe(res => {
            if (res)
              this.getBusinessRuleList(this.schemaId);
          });
          // const deleteSubscriber = this.schemaService.deleteBr(br.brIdStr).subscribe(res => {
          //   this.getBusinessRuleList(this.schemaId);
          // }, error => console.error(`Error : ${error.message}`));
          this.subscriptions.push(deleteSubscriber);
        }
      }
    });
  }

  /**
   * Delete child business rule  by id
   * @param br delete by br id
   */
  deleteBrChild(br: CoreSchemaBrInfo, parentbr: CoreSchemaBrInfo) {
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      if (response && response === 'yes') {
        const idx = this.businessRuleData.indexOf(parentbr);
        const childIdx = this.businessRuleData[idx].dep_rules;
        const brToBeDelete = childIdx.filter((businessRule) => businessRule.brId === br.brId)[0];
        const index = this.businessRuleData.indexOf(brToBeDelete);
        this.businessRuleData[idx].dep_rules.splice(index, 1);
      }
    })
  }

  deleteBrAfterConfirm(response: string, br: CoreSchemaBrInfo) {
    if (response && response === 'yes') {
      if (br.brIdStr) {
        const deleteSubscriber = this.schemaService.deleteBr(br.brIdStr).subscribe(res => {
          this.getBusinessRuleList(this.schemaId);
        }, error => console.error(`Error : ${error.message}`));
        this.subscriptions.push(deleteSubscriber);
      }
    }
  }

  /**
   * Edit curren business rule..
   * @param br editable business rule ..
   */
  editBr(br: CoreSchemaBrInfo) {
    this.schemaService.currentweightage = this.availableWeightage('0');
    this.router.navigate(['', { outlets: { sb: `sb/schema/business-rule/${this.moduleId}/${this.schemaId}/${br.brIdStr}` } }]);
  }

  makeFilterControl(event: AddFilterOutput, sNo: number) {
    const exitingFilterCtrl = [];

    const filterCtrl: FilterCriteria = new FilterCriteria();
    filterCtrl.fieldId = event.fldCtrl.fieldId;
    filterCtrl.type = 'DROPDOWN';
    filterCtrl.values = event.selectedValues.map(val => val.CODE);

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
  public deleteSubscriber(sNo: string) {
    console.log(sNo);
    this.globalDialogService.confirm({ label: 'Are you sure to delete ?' }, (response) => {
      this.deleteSubsAfterConfirm(response, sNo)
    });
  }

  deleteSubsAfterConfirm(response: string, sNo: string) {
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
   * function to open dataScope side sheet(Add new data scope).
   */
  addDataScope() {
    this.router.navigate([{ outlets: { sb: `sb/schema/data-scope/${this.moduleId}/${this.schemaId}/new/sb` } }]);
  }

  /**
   * Function to open summary side sheet of schema
   */
  openSummarySideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/check-data/${this.moduleId}/${this.schemaId}` } }], {
      queryParams: {
        isCheckData: true
      }
    });
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
   * Function to open schedule side-sheet
   * @param scheduleId: schedule Id
   */
  openScheduleSideSheet(scheduleId?: string) {
    if (!scheduleId) {
      this.router.navigate([{ outlets: { sb: `sb/schema/schedule/${this.schemaId}/new` } }])
    }
    else {
      this.router.navigate([{ outlets: { sb: `sb/schema/schedule/${this.schemaId}/${scheduleId}` } }])
    }
  }

  /**
   * Function to change state of enable/disable schedule
   */
  toggleScheduleState() {
    this.scheduleInfo.isEnable = !this.scheduleInfo.isEnable;
    const updateSubscriber = this.schemaService.createUpdateSchedule(this.schemaId, this.scheduleInfo).subscribe((response) => {
      this.matSnackBar.open('This action has been confirmed..', 'okay', {
        duration: 3000
      })
    }, (error) => {
      console.log('Error while updating scheduler..', error.message);
      this.matSnackBar.open('Something went wrong..', 'okay', {
        duration: 3000
      })
    })
    this.subscriptions.push(updateSubscriber);
  }

  /**
   * Function to get schedule information
   * @param schemaId: Id of schema for which schedule info needed
   */
  getScheduleInfo(schemaId: string) {
    const scheduleSubscription = this.schemaService.getSchedule(schemaId).subscribe((response) => {
      this.scheduleInfo = response;
      response ? this.canEditSchedule = true : this.canEditSchedule = false;
    }, (error) => {
      console.log('Something went wrong when getting schedule information.', error.message);
    })
    this.subscriptions.push(scheduleSubscription);
  }

  /**
   * Function to open business rule library side sheet
   * It holds all the business rules inside it.
   */
  openBrLibrarySideSheet() {
    this.router.navigate([{ outlets: { sb: `sb/schema/businessrule-library/${this.moduleId}/${this.schemaId}/${this.outlet}` } }])
  }

  /**
   * Function to get info of all business rules.
   * @param moduleId ID of module
   * @param searchString string to be searched
   * @param brType type of business rule
   * @param fetchCount count to be fetched data
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
   * Function to add business rule to schema
   * @param brInfo: business rule information for schema.
   */
  addBusinessRule(brInfo) {
    console.log(brInfo);
    const request: CoreSchemaBrInfo = new CoreSchemaBrInfo();

    request.brId = '';
    request.schemaId = this.schemaId;
    request.brInfo = brInfo.brInfo;
    request.brType = brInfo.brType;
    request.fields = brInfo.fields;
    request.message = brInfo.message;
    request.moduleId = this.moduleId;
    request.isCopied = true;
    request.copiedFrom = brInfo.brIdStr;
    console.log(brInfo);
    const checkExistBr = this.businessRuleData.filter((businessRule) => businessRule.brIdStr === brInfo.brIdStr)[0];
    const checkExistCopiedBr = this.businessRuleData.filter((businessRule) => businessRule.copiedFrom === brInfo.brIdStr)[0];
    if (checkExistBr || checkExistCopiedBr) {
      this.matSnackBar.open('This business rule is already added.', 'Okay', {
        duration: 2000
      })
    }
    else {
      if (brInfo.brType === 'BR_DUPLICATE_CHECK') {
        const subscription = this.schemaService.copyDuplicateRule(request).subscribe((response) => {
          console.log(response);
          this.getBusinessRuleList(this.schemaId);
        }, (error) => {
          console.log('Error while adding business rule', error.message);
        })
        this.subscriptions.push(subscription);
      }

      else {
        const subscription = this.schemaService.createBusinessRule(request).subscribe((response) => {
          console.log(response);
          this.getBusinessRuleList(this.schemaId);
        }, (error) => {
          console.log('Error while adding business rule', error.message);
        })
        this.subscriptions.push(subscription);
      }
    }
  }

  /**
   * Function to change role of subscriber
   * @param subscriber information of subscriber
   * @param role updated role
   */
  updateRole(subscriber, role) {
    this.roles.forEach((r) => {
      subscriber[r.code] = false;
    })

    subscriber[role] = true;
    subscriber.schemaId = this.schemaId;

    const subscription = this.schemaDetailsService.createUpdateUserDetails(Array(subscriber)).subscribe(res => {
      this.getSubscriberList(this.schemaId)
    }, (error) => {
      console.log('Something went wrong while update role..', error.message);
    })
    this.subscriptions.push(subscription);
  }

  /**
   * Function to update schema name and desc
   * @param schemaDescription: updated schema description.
   * @param event: event of mat slider(for schema threshold).
   */
  updateSchemaInfo(schemaDescription: string, event?: any) {
    console.log(event);
    if (schemaDescription !== this.schemaDetails.schemaDescription || event) {
      const schemaReq: CreateUpdateSchema = new CreateUpdateSchema();
      schemaReq.moduleId = this.moduleId;
      schemaReq.schemaId = this.schemaId;
      schemaReq.discription = schemaDescription;
      schemaReq.schemaThreshold = event ? event.value : this.schemaDetails.schemaThreshold;
      schemaReq.schemaCategory = this.schemaDetails.schemaCategory;

      const subscription = this.schemaService.createUpdateSchema(schemaReq).subscribe((response) => {
        this.sharedService.setRefreshSecondaryNav(SecondaynavType.schema, true, this.moduleId);
        this.toasterService.open('Schema description updated successfully.', 'ok', {
          duration: 2000
        })
        this.getSchemaDetails(this.schemaId);
      }, (error) => {
        this.toasterService.open('Something went wrong', 'ok', {
          duration: 2000
        });
        console.error('Something went wrong while updating schema info', error.message);
      })
      this.subscriptions.push(subscription);
    }
  }

  /**
   * Function to call when schema threshold is changed in slider
   * @param $event: updated schema description.
   */
   onChangeSchemaThreshold($event) {
    console.log($event);
    if (this.schemaThresholdChanged.observers.length === 0) {
      this.schemaThresholdChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(threshold => {
          this.updateSchemaInfo(this.schemaDetails.schemaDescription, {value: threshold});
        });
    }
    this.schemaThresholdChanged.next($event);
  }
  /**
   * Function to call when schema description is changed in inputbox
   * @param $event: updated schema description.
   */
  onChangeSchemaDescription($event) {
    console.log($event);
    if (this.schemaValueChanged.observers.length === 0) {
      this.schemaValueChanged
        .pipe(debounceTime(1000), distinctUntilChanged())
        .subscribe(schema => {
          this.updateSchemaInfo(schema);
        });
    }
    this.schemaValueChanged.next($event);
  }

  updateDepRule(br: CoreSchemaBrInfo, event?: any) {
    const index = this.businessRuleData.findIndex(item => item.brIdStr === br.brIdStr);
    if (event.value !== RuleDependentOn.ALL) {
      const tobeChild = this.businessRuleData[index]
      if (this.businessRuleData[index - 1].dep_rules) {
        this.addChildatSameRoot(tobeChild, index)
      }
      else {
        this.businessRuleData[index - 1].dep_rules = [];
        this.addChildatSameRoot(tobeChild, index)
      }
      const idxforChild = this.businessRuleData[index - 1].dep_rules.findIndex(item => item.brIdStr === tobeChild.brIdStr);
      this.businessRuleData[index - 1].dep_rules[idxforChild].dependantStatus = event.value;
      this.businessRuleData.splice(index, 1);
      const request: CoreSchemaBrMap = new CoreSchemaBrMap();
      request.brWeightage = Number(br.brWeightage);
      request.schemaId = this.schemaId;
      request.brId = br.brIdStr;
      request.order = br.order;
      request.status = br.status
      request.dependantStatus = event.key || br.dependantStatus;
      const updateBusinessRule = this.schemaService.updateBrMap(request).subscribe(res => {
        if (res) {
          this.getBusinessRuleList(this.schemaId);
        }
      }, error => console.error(`Error : ${error.message}`));
      this.subscriptions.push(updateBusinessRule);
    }
  }

  addChildatSameRoot(tobeChild: CoreSchemaBrInfo, index: number) {
    this.businessRuleData[index - 1].dep_rules.push(tobeChild)
    if (tobeChild.dep_rules)
      tobeChild.dep_rules.forEach(element => {
        this.businessRuleData[index - 1].dep_rules.push(element);
      });
  }

  updateDepRuleForChild(br: CoreSchemaBrInfo, index: number, event?: any) {
    const idx = this.businessRuleData.findIndex(item => item.brIdStr === br.brIdStr);
    this.businessRuleData[idx].dep_rules[index].dependantStatus = event.value;
    const childIdx = this.businessRuleData[idx].dep_rules[index]

    if (event.value === RuleDependentOn.ALL) {
      childIdx.dep_rules = [];
      this.businessRuleData.push(childIdx);
      this.businessRuleData[idx].dep_rules.splice(index, 1);
    }

    const request: CoreSchemaBrMap = new CoreSchemaBrMap();
    request.brWeightage = Number(childIdx.brWeightage);
    request.schemaId = this.schemaId;
    request.brId = childIdx.brIdStr;
    request.order = childIdx.order;
    request.status = childIdx.status
    request.dependantStatus = this.depRuleList.find(x => x.value === childIdx.dependantStatus)?.key;
    const updateBusinessRule = this.schemaService.updateBrMap(request).subscribe(res => {
      if (res) {
        this.getBusinessRuleList(this.schemaId);
      }
    }, error => console.error(`Error : ${error.message}`));
    this.subscriptions.push(updateBusinessRule);
  }

  deleteSchema() {
    this.schemaService.deleteSChema(this.schemaId)
      .subscribe(resp => {
        this.router.navigate(['home', 'schema', this.moduleId]);
        this.sharedService.setRefreshSecondaryNav(SecondaynavType.schema, true, this.moduleId);
        this.toasterService.open('Schema deleted successfully.', 'ok', { duration: 2000 });
      }, error => {
        this.toasterService.open('Something went wrong', 'ok', { duration: 2000 });
      })
  }

  get getBusinessRulesLength() {
    let inn = 0;
    const count = this.businessRuleData.map(element => {
      if (element.dep_rules)
        inn += element.dep_rules.length;
    }).length
    return count + inn;
  }
  getCurrentBrStatus(status) {
    return status ? status : 'ALL';
  }
  getCurrentBrStatusObj(status) {
    return this.depRuleList.find(depRule => depRule.key === status || depRule.value === status) || this.depRuleList[0];
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
}