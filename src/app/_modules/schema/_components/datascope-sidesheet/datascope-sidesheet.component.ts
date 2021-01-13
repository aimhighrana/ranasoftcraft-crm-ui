import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { AddFilterOutput, SchemaVariantReq } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { LoadDropValueReq } from '@models/schema/schemalist';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { UserService } from '@services/user/userservice.service';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'pros-datascope-sidesheet',
  templateUrl: './datascope-sidesheet.component.html',
  styleUrls: ['./datascope-sidesheet.component.scss']
})
export class DatascopeSidesheetComponent implements OnInit, OnDestroy {
  /**
   * To hold schema ID of variant
   */
  schemaId: string;

  /**
   * To hold module ID of variant
   */
  moduleId: string;

  /**
   * To hold variant ID
   */
  variantId: string;

  /**
   * To hold all the information about variant..
   */
  variantInfo: SchemaVariantReq = {} as SchemaVariantReq;
  reInilize = true;

  /**
   * To hold fieldId and selected values of filter
   */
  loadDropValuesFor: LoadDropValueReq;

  outlet: string;

  /**
   * To hold all subscriptions
   */
  subscriptions: Subscription[] = [];

  /**
   * Constructor of the class
   */
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private schemaService: SchemaService,
              private sharedService: SharedServiceService,
              private schemaVariantService: SchemaVariantService,
              private matSnackBar: MatSnackBar,
              private userService: UserService) { }


  /**
   * ANGULAR HOOK
   * It will be called once when component will be loaded.
   */
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.schemaId = params.schemaId;
      this.moduleId = params.moduleId;
      this.variantId = params.variantId;
      this.outlet = params.outlet;

      if(this.variantId !== 'new') {
        this.getDataScopeDetails(this.variantId);
      }
    })
  }

  /**
   * Function to get variant details
   * @param variantId ID of variant for which details needed.
   */
  getDataScopeDetails(variantId: string) {
    const userSub = this.userService.getUserDetails().pipe(distinctUntilChanged()).subscribe(user => {
      const variantDetais = this.schemaVariantService.getVariantdetailsByvariantId(variantId, user.currentRoleId, user.plantCode, user.userName).subscribe((res) => {
        this.variantInfo.variantName = res.variantName;
        this.variantInfo.filterCriteria = res.filterCriteria;
        this.variantInfo.variantId = res.variantId;
      }, (error) => {
        console.log('Something went wrong while getting variant details.', error.message);
      })
      this.subscriptions.push(variantDetais);
    });
    this.subscriptions.push(userSub);
  }

  /**
   * function to close dataScope side sheet
   */
  close(){
    this.router.navigate([{ outlets: { [`${this.outlet}`]: null } }], {queryParamsHandling: 'preserve'});
  }

  /**
   * Function to get value of form-control
   */
  getValue(dataScopeName: string) {
    this.variantInfo.variantName = dataScopeName;
  }


  /**
   * Function to prepare data on filter selection
   * @param event: object emitted on filter selection.
   */
  makeFilterCtrl(event: AddFilterOutput) {
    const filterCtrl: FilterCriteria = new FilterCriteria();
    filterCtrl.fieldId = event.fldCtrl.fieldId;
    filterCtrl.fldCtrl = event.fldCtrl;
    filterCtrl.type = 'DROPDOWN';
    filterCtrl.values = [];
    filterCtrl.textValues = [];
    event.selectedValues.forEach((value) => {
      if(value.FIELDNAME === filterCtrl.fieldId) {
        filterCtrl.values.push(value.CODE);
        filterCtrl.textValues.push(value.TEXT);
      }
    })
    // In case we are adding data-scope
    if(!this.variantInfo.filterCriteria){
      this.variantInfo.filterCriteria = [];
      this.variantInfo.filterCriteria.push(filterCtrl);
    }else{
      // this.variantInfo.filterCriteria.push(filterCtrl);
      let flag = false;
      this.variantInfo.filterCriteria.forEach((filCtrl) => {
        if(filCtrl.fieldId === event.fldCtrl.fieldId) {
          flag = true;
          filCtrl.values = [];
          filCtrl.textValues = [];

          filCtrl.values.push(...filterCtrl.values);
          filCtrl.textValues.push(...filterCtrl.textValues);
        }
      })
      if(flag === false){
        this.variantInfo.filterCriteria.push(filterCtrl);
      }
    }
  }

  /**
   * Function to show text on chips
   * @param ctrl: object of filterCriteria array from variantInfo..
   */
  prepareTextToShow(ctrl: FilterCriteria) {
    if(ctrl.values.length > 1) {
      return ctrl.values.length;
    }else {
      return ctrl.textValues ? ctrl.textValues[0] : ctrl.selectedValues[0].TEXT;
    }
  }

  /**
   * Function to load dropdown values for already seleted filters
   */
  loadDropValues(fldC: FilterCriteria) {
    if (fldC) {
      const dropArray: DropDownValue[] = [];
      fldC.values.forEach(val => {
        const drop: DropDownValue = { CODE: val, FIELDNAME: fldC.fieldId } as DropDownValue;
        dropArray.push(drop);
      });
      this.loadDropValuesFor = { fieldId: fldC.fieldId, checkedValue: dropArray };
    }
  }

  /**
   * Function to save varient
   */
  saveVarient() {
    this.variantInfo.variantId = this.variantInfo.variantId === 'new' ? '' : this.variantInfo.variantId;
    this.variantInfo.schemaId = this.schemaId;
    this.variantInfo.variantType = 'RUNFOR';
    const saveVariant = this.schemaService.saveUpdateDataScope(this.variantInfo).subscribe((res) => {
      this.close();
      this.sharedService.setDataScope(res);
      this.matSnackBar.open('This action has been performed.', 'Okay', {
        duration: 2000
      })
    }, (error) => {
      console.log('Something went wrong while saving data scope', error.message)
    })
    this.subscriptions.push(saveVariant);
  }

  /**
   * Function to remove filter
   * @param ctrl: filterCriteria of variantInfo
   */
  removeFilter(ctrl: FilterCriteria) {
    const filterToBeRemoved = this.variantInfo.filterCriteria.filter((filterCtrl) => filterCtrl.fieldId === ctrl.fieldId)[0];
    const index = this.variantInfo.filterCriteria.indexOf(filterToBeRemoved);
    this.variantInfo.filterCriteria.splice(index, 1);
  }

  /**
   * Function to update chip filter dropdown values
   * @param selectedValues seleted value of chip filter
   * @param fieldId fieldID of filter.
   */
  updateChipFilter(selectedValues, fieldId) {
    this.variantInfo.filterCriteria.forEach((filterCtrl) => {
      if(filterCtrl.fieldId === fieldId) {
        filterCtrl.values.length = 0;
        filterCtrl.textValues = [];
        selectedValues.forEach((value) => {
          filterCtrl.values.push(value.CODE);
          filterCtrl.textValues.push(value.TEXT ? value.TEXT : value.CODE);
        })
      }
    })
  }

  /**
   * ANGULAR HOOK
   * Call once after component lifecycle ends..
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }
}
