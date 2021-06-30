import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddFilterOutput, SchemaVariantReq } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { LoadDropValueReq } from '@models/schema/schemalist';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { UserService } from '@services/user/userservice.service';
import { TransientService } from 'mdo-ui-library';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';

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

  /**
   * To pass formControl to form-input Component
   */
  variantName= new FormControl('');

  outlet: string;

  /**
   * To hold all subscriptions
   */
  subscriptions: Subscription[] = [];

  scopeCnt = 0;
  entireDatasetCnt = 0;

  /**
   * holds list of all available filters
   */
  allFilters = [];
  /**
   * holds list of filters based on user search text
   */
  filtersDisplayList = [];
  /**
   * holds list of all available user selected filters
   */
  selectedFilters = [];
  /**
   * holds list of selected filters based on user search text
   */
  selectedFiltersDisplayList = [];
  /**
   * holds currently active filter data
   */
  currentFilter: any;
  /**
   * holds user search string for filter list
   */
  searchString = '';
  /**
   * holds filter list search subject that gets trigerred as user types search text
   */
  filterSearchSub: Subject<string> = new Subject();
  /**
   * holds filter criteria subjects that gets trigerred on any update to filter criteria
   */
  filterCriteriaSub: Subject<string> = new Subject();

  /**
   * holds data for obtaining filter datatype
   */
  dynmaicFilterSchema = {
    0: [
      { dataType: 'CHAR', type: 'input_text' },
      { dataType: 'NUMC', type: 'input_numeric' },
      { dataType: 'DEC', type: 'input_desc' },
      { dataType: 'ALTN', type: 'input_text' },
      { dataType: 'ISCN', type: 'input_text' },
      { dataType: 'REQ', type: 'input_text' }
    ],
    1: [
      { dataType: 'AJAX', type: 'dropdown_single' },
      { dataType: 'AJAX', isCheckList: 'true', type: 'dropdown_multi' }
    ],
    30: [
      { dataType: 'AJAX', type: 'dropdown_single' },
      { dataType: 'AJAX', isCheckList: 'true', type: 'dropdown_multi' }
    ],
    37: [
      { dataType: 'AJAX', type: 'dropdown_single' },
      { dataType: 'AJAX', isCheckList: 'true', type: 'dropdown_multi' }
    ],
    2: [
      { dataType: 'CHAR', type: 'checkbox' }
    ],
    4: [
      { dataType: 'CHAR', type: 'radio' }
    ],
    22: [
      { dataType: 'CHAR', type: 'textarea' }
    ],
    DATS: [
      { dataType: 'CHAR', type: 'picker_date' }
    ],
    DTMS: [
      { dataType: 'CHAR', type: 'picker_date' }
    ],
    TIMS: [
      { dataType: 'Char', type: 'picker_time' }
    ],
    35: [
      { dataType: null, type: 'radio' }
    ]
  };

  /**
   * holds filter data
   */
  filterData = {
    inputTextVal: undefined,
    inputNumericVal: undefined,
    textareaVal: undefined,
    selectedValue: undefined
  };
  /**
   * hold dropdown values for mulitple choice filter types
   */
  dropdownValues = [];
  /**
   * holds control for multiple choice list search
   */
  dropdownSearchCtrl: FormControl = new FormControl('');
  /**
   * holds filtered dropdown values based on searched text for multiple choice filter types
   */
  dropdownFilteredValues = [];
  /**
   * holds chips for multi dropdown
   */
  dropdownSelectedChips = [];
  /**
   * holds type of active filter
   */
  filterControlType = '';
  /**
   * holds list of selected filter criteria
   */
  selectedFilterCriteria = [];
  /**
   * holds date range value
   */
  dateRangeValue: { start: Date; end: Date } = { start: null, end: null };
  /**
   * holds time range value
   */
  selectedTimeRange =  {
    start: {
      hours: 0,
      minutes: 0
    },
    end: {
      hours: 0,
      minutes: 0
    }
  };

  /**
   * Constructor of the class
   */
  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              private schemaService: SchemaService,
              private sharedService: SharedServiceService,
              private schemaVariantService: SchemaVariantService,
              private schemaDetailService: SchemaDetailsService,
              private toasterService: TransientService,
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
      this.getModuleInfo();

      if(this.variantId !== 'new') {
        this.getDataScopeDetails(this.variantId);
      } else {
        this.getAllFilters();
      }
    });

    const filterSearchSub = this.filterSearchSub.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((searchString) => {
      this.searchFilters(this.allFilters, 'allList', searchString);
      this.searchFilters(this.selectedFilters, 'selectedList', searchString);
    });
    this.subscriptions.push(filterSearchSub);

    const filterCriteriaUpdateSub = this.filterCriteriaSub.pipe(debounceTime(300)).subscribe((res) => {
      this.updateDataScopeCount();
    });
    this.subscriptions.push(filterCriteriaUpdateSub);


    const dropdownSearchCtrlSub = this.dropdownSearchCtrl.valueChanges.pipe(debounceTime(300), distinctUntilChanged()).subscribe((val) => {
      if (this.dropdownValues.length) {
        this.dropdownFilteredValues = this.dropdownValues.filter((x) => x.value.toLowerCase().includes(val.trim().toLowerCase()));
      }
    });
    this.subscriptions.push(dropdownSearchCtrlSub);

  }

  getModuleInfo() {
    const moduleInfoByModuleId = this.schemaService.getModuleInfoByModuleId(this.moduleId).subscribe((moduleData) => {
      const module = moduleData[0];
      if (module) {
        this.entireDatasetCnt = module.datasetCount;
        if (this.variantId === 'new') {
          this.scopeCnt = module.datasetCount;
        }
      }
    }, error => {
      console.error('Error: {}', error.message);
    });
    this.subscriptions.push(moduleInfoByModuleId);
  }

  /**
   * Function to get variant details
   * @param variantId ID of variant for which details needed.
   */
  getDataScopeDetails(variantId: string) {
    const userSub = this.userService.getUserDetails().pipe(distinctUntilChanged()).subscribe(user => {
      const variantDetais = this.schemaVariantService.getVariantdetailsByvariantId(variantId, user.currentRoleId, user.plantCode, user.userName).subscribe((res) => {
        if (res) {
          this.variantInfo.variantName = res.variantName || '';
          this.variantName.setValue(this.variantInfo.variantName);
          this.variantInfo.filterCriteria = res.filterCriteria || [];
          this.variantInfo.variantId = res.variantId || '';
          this.selectedFilterCriteria = this.variantInfo.filterCriteria;
          this.updateDataScopeCount();
          this.getAllFilters();
        }
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
    filterCtrl.selectedValues = [];

    event.selectedValues.forEach((value) => {
      if(value.FIELDNAME === filterCtrl.fieldId) {
        filterCtrl.values.push(value.CODE);
        filterCtrl.textValues.push(value.TEXT);
        filterCtrl.selectedValues.push(value);
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
          filCtrl.values =  filterCtrl.values || [];

          filCtrl.selectedValues = filCtrl.selectedValues ? filCtrl.selectedValues.filter(sVal => filterCtrl.selectedValues.some(v => v.CODE === sVal.CODE)) : [];
          filterCtrl.selectedValues.forEach(v => {
            if(!filCtrl.selectedValues.some(value => value.CODE === v.CODE)) {
              filCtrl.selectedValues.push(v);
            }
          });

          filCtrl.textValues = [];
          filCtrl.selectedValues.forEach(v => {
              filCtrl.textValues.push(v.TEXT);
          });
        }
      })
      if(flag === false){
        this.variantInfo.filterCriteria.push(filterCtrl);
      }
    }

    this.updateDataScopeCount();
  }

  updateDataScopeCount() {
    if (this.selectedFilterCriteria.length) {
      const sub = this.schemaService.getDataScopeCount(this.moduleId, this.selectedFilterCriteria).subscribe((res) => {
        const count = (res && res > 0) ? res : 0;
        this.scopeCnt = count;
      });

      this.subscriptions.push(sub);
    } else {
      this.scopeCnt = this.entireDatasetCnt;
    }
  }

  /**
   * Function to show text on chips
   * @param ctrl: object of filterCriteria array from variantInfo..
   */
  prepareTextToShow(ctrl: FilterCriteria) {
    if(ctrl.values.length > 1) {
      return ctrl.values.length;
    } else {
      if(ctrl.textValues && ctrl.textValues.length) {
        return ctrl.textValues[0] || ctrl.fieldId;
      } else {
        const selected = ctrl.selectedValues && ctrl.selectedValues.find(s => s.CODE === ctrl.values[0]);
        return selected ? selected.TEXT : ctrl.fieldId;
      }
    }
  }

  /**
   * Function to load dropdown values for already seleted filters
   */
  loadDropValues(fldC: FilterCriteria) {
    if (fldC && fldC.values) {
      const dropArray: DropDownValue[] = [];
      fldC.values.forEach(val => {
        const dropDetails = fldC.selectedValues && fldC.selectedValues.find(v => v.CODE === val);
        const drop: DropDownValue = dropDetails || { CODE: val, FIELDNAME: fldC.fieldId } as DropDownValue;
        dropArray.push(drop);
      });
      this.loadDropValuesFor = { fieldId: fldC.fieldId, checkedValue: dropArray };
    }
  }

  /**
   * Function to save varient
   */
  saveVarient() {
    this.variantInfo.variantName = this.variantName.value;
    this.variantInfo.variantId = this.variantInfo.variantId === 'new' ? '' : this.variantInfo.variantId;
    this.variantInfo.schemaId = this.schemaId;
    this.variantInfo.variantType = 'RUNFOR';
    this.variantInfo.filterCriteria = this.selectedFilterCriteria;
    const saveVariant = this.schemaService.saveUpdateDataScope(this.variantInfo).subscribe((res) => {
      this.close();
      this.sharedService.setDataScope(res);
      this.toasterService.open('This action has been performed.', 'Okay', {
        duration: 2000
      });
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

    this.updateDataScopeCount();
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
        filterCtrl.selectedValues = selectedValues;
        selectedValues.forEach((value) => {
          filterCtrl.values.push(value.CODE);
          filterCtrl.textValues.push(value.TEXT ? value.TEXT : value.CODE);
        })
      }
    });

    this.updateDataScopeCount();
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

  /**
   * fetches all available filters
   */
  getAllFilters() {
    if (this.allFilters.length) {
      return;
    }
    const selectedFiltersList = [];
    const fieldIdsList = this.selectedFilterCriteria.length ? this.selectedFilterCriteria.map((x) => x.fieldId) : [];
    const schemaDetailsSub = this.schemaDetailService.getMetadataFields(this.moduleId).subscribe(res => {
      const headers = res.headers;
      for (const headerField in headers) {
        if (headers[headerField]) {
          const field = {...headers[headerField]};
          field.type = 'header';
          field.show = true;
          this.allFilters.push(field);
          if (fieldIdsList.includes(field.fieldId)) {
            selectedFiltersList.push(field);
          }
        }
      }

      const grids = res.grids;
      const gridFields = res.gridFields;
      for (const grid in grids) {
        if (grids[grid]) {
          const parentField = {...grids[grid]};
          parentField.type = 'grid';
          parentField.child = [];
          parentField.show = true;
          const val = parentField;
          const gridChilds = gridFields[grid] || {};
          if (Object.keys(gridChilds).length) {
            for (const gridChild in gridChilds) {
              if (gridChilds[gridChild]) {
                const childField = {...gridChilds[gridChild]};
                childField.type = 'grid';
                childField.isChild = 1;
                childField.parentFieldId = val.fieldId;
                childField.show = true;
                val.child.push(childField);
                if (fieldIdsList.includes(childField.fieldId)) {
                  selectedFiltersList.push(childField);
                }
              }
            }
          }
          this.allFilters.push(val);
        }
      }

      const hierarchy = res.hierarchy;
      const hierarchyFields = res.hierarchyFields;
      hierarchy.forEach((x: any) => {
        const parentField = {...x};
        parentField.type = 'hierarchy';
        parentField.child = [];
        parentField.show = true;
        parentField.fieldId = x.heirarchyId;
        parentField.fieldDescri = x.heirarchyText;
        const val = parentField;
        const childs = hierarchyFields[x.heirarchyId];
        if (Object.keys(childs).length) {
          for (const key in childs) {
            if (childs[key]) {
              const childField = {...childs[key]};
              childField.type = 'hierarchy';
              childField.isChild = 1;
              childField.parentFieldId = val.fieldId;
              childField.show = true;
              val.child.push(childField);
              if (fieldIdsList.includes(childField.fieldId)) {
                selectedFiltersList.push(childField);
              }
            }
          }
        }
        this.allFilters.push(val);
      });

      this.filtersDisplayList = this.allFilters;
      selectedFiltersList.forEach((x) => {
        if (x.isChild) {
          this.selectFilter(x, true, false);
        } else {
          this.selectFilter(x, false, false);
        }
      });
    }, error => {
      console.error(`Error : ${error.message}`);
    });

    this.subscriptions.push(schemaDetailsSub);
  }

  /**
   * filters list based on search text
   * @param parentList parent list that contains all values
   * @param targetList target list that contains filtererd values
   * @param searchString search string
   */
  searchFilters(parentList, targetList, searchString) {
    if (parentList.length) {
      const res = [];
      parentList.forEach((field) => {
        if (field.type === 'header' && field.fieldDescri.toLowerCase().includes(searchString.toLowerCase())) {
          res.push(field);
        } else {
          if (field.child && field.child.length) {
            const childs = field.child.filter((x) => x.fieldDescri.toLowerCase().includes(searchString.toLowerCase()));
            if (childs.length) {
              const parent = field;
              parent.child = childs;
              res.push(parent);
            } else if (field.fieldDescri.toLowerCase().includes(searchString.toLowerCase())) {
              res.push(field);
            }
          } else if (field.fieldDescri.toLowerCase().includes(searchString.toLowerCase())) {
            res.push(field);
          }
        }
      });
      if (targetList === 'allList') {
        this.filtersDisplayList = res;
      } else {
        this.selectedFiltersDisplayList = res;
      }
    }
  }

  /**
   * triggers search for filter list
   * @param searchString search text
   */
  triggerFilterSearch(searchString: string) {
    this.searchString = searchString;
    this.filterSearchSub.next(searchString);
  }

  filterTrackBy(index: any, itemId: any) {
    return index;
  }

  /**
   * selects filter and appends to selected filters list
   * @param filter filter data
   * @param isChild will be true if child is selected
   * @param openDynamicFilter if true options for editing filter values will be displayed
   */
  selectFilter(filter, isChild = false, openDynamicFilter = true) {
    if (filter.type !== 'header' && !isChild) {
      return;
    }
    const currentField = this.filtersDisplayList.find((x) => x.fieldId === (isChild ? filter.parentFieldId : filter.fieldId));
    if (isChild) {
      const child = currentField.child.find((x) => x.fieldId === filter.fieldId);
      const selectedParent = this.selectedFilters.find((x) => x.fieldId === filter.parentFieldId);
      if (selectedParent) {
        selectedParent.child.push(child);
      } else {
        const parent = JSON.parse(JSON.stringify(currentField));
        parent.child = [child];
        this.selectedFilters.push(parent);
      }
      child.show = false;
      const enabledChildren = currentField.child.filter((x) => x.show === true);
      if (!enabledChildren.length) {
        currentField.show = false;
      }
    } else {
      this.selectedFilters.push(currentField);
      currentField.show = false;
    }
    this.selectedFiltersDisplayList = this.selectedFilters;
    if (this.searchString) {
      this.searchFilters(this.selectedFilters, 'selectedList', this.searchString);
    }
    if (openDynamicFilter) {
      this.selectDynamicFilter(filter);
    }
    this.addFilterCriteria(filter);
  }

  /**
   * removes child from selected list
   * @param filter filter data
   * @param isChild will be true if child is removed
   */
  removeField(filter, isChild = false) {
    const currentField = this.filtersDisplayList.find((x) => x.fieldId === (isChild ? filter.parentFieldId : filter.fieldId));
    if (isChild) {
      const child = currentField.child.find((x) => x.fieldId === filter.fieldId);
      currentField.show = true;
      child.show = true;
      const selectedParent = this.selectedFilters.find((x) => x.fieldId === filter.parentFieldId);
      selectedParent.child = selectedParent.child.filter((x) => x.fieldId !== filter.fieldId);
      if (!selectedParent.child.length) {
        this.selectedFilters = this.selectedFilters.filter((x) => x.fieldId !== filter.parentFieldId);
      }
    } else {
      this.selectedFilters = this.selectedFilters.filter((x) => x.fieldId !== filter.fieldId);
      currentField.show = true;
    }
    this.selectedFiltersDisplayList = this.selectedFilters;
    if (this.searchString) {
      this.searchFilters(this.selectedFilters, 'selectedList', this.searchString);
    }
    this.removeFilterCriteria(filter.fieldId);
  }

  /**
   * opens editable section for selected filter for editing filter values
   * @param filter filter data
   * @param isUpdate will be true if there are existing value that needs to be set
   */
  selectDynamicFilter(filter, isUpdate = false) {
    if (filter.type !== 'header' && !filter.isChild) {
      return;
    }
    this.clearValues();
    this.currentFilter = filter;
    const picklist = this.currentFilter.picklist || null;
    const dataType = this.currentFilter.dataType || null;

    if (picklist) {
      const dropdownPickLists = ['1', '30', '37'];
      if (dropdownPickLists.includes(picklist)) {
        this.filterControlType = (this.currentFilter.isCheckList === 'true') ? 'dropdown_multi' : 'dropdown_single';
      } else if (this.dynmaicFilterSchema[picklist]) {
        const res = this.dynmaicFilterSchema[picklist].find((x) => x.dataType === dataType.toUpperCase());
        if (res) {
          this.filterControlType = res.type;
        }
      }
      this.getFilterValues(filter.fieldId, isUpdate);
    }
  }

  /**
   * adds selected filter to filter criteria list
   * @param filter filter data
   */
  addFilterCriteria(filter) {
    const existingFilter = this.selectedFilterCriteria.filter((x) => x.fieldId === filter.fieldId);
    if (existingFilter.length) {
      return;
    }
    const CrntFilter = JSON.parse(JSON.stringify(filter));
    delete CrntFilter.show;
    if (CrntFilter.type === 'grid' || CrntFilter.type === 'hierarchy') {
      delete CrntFilter.child;
    }
    delete CrntFilter.type;
    if (CrntFilter.isChild) {
      delete CrntFilter.isChild;
      delete CrntFilter.parentFieldId;
    }

    const fieldType = (this.filterControlType === 'dropdown_single' || this.filterControlType === 'dropdown_multi') ? 'DROPDOWN' : 'INLINE';
    const fieldOperator = (this.filterControlType === 'picker_date' || this.filterControlType === 'picker_time') ? 'RANGE' : 'EQUAL';
    const filterCtrl = {
      fieldId: filter.fieldId,
      fldCtrl: CrntFilter,
      values: [],
      startValue: null,
      endValue: null,
      type: fieldType,
      operator: fieldOperator
    };

    this.selectedFilterCriteria.push(filterCtrl);
    this.filterCriteriaSub.next('true');
  }

  /**
   * removed removed filter from filter criteria list
   * @param fieldId filter id
   */
  removeFilterCriteria(fieldId) {
    this.selectedFilterCriteria = this.selectedFilterCriteria.filter((x) => x.fieldId !== fieldId);
    this.filterCriteriaSub.next('true');
  }

  /**
   * gets dropdown values for multi choice filter types
   * @param filterId holds filter id
   */
  getFilterValues(filterId, isUpdate) {
    this.schemaService.dropDownValues(filterId, '').subscribe((data) => {
      if (data) {
        data.forEach((x) => {
          const res: any = {...x};
          res.value = x.TEXT,
          res.key = x.CODE
          res.checked = false;

          this.dropdownValues.push(res);
        });
        this.dropdownFilteredValues = this.dropdownValues;
      }
      if (isUpdate) {
        this.setFilterExistingValues();
      }
    });
  }

  /**
   * sets existing values to appropriate variables
   */
  setFilterExistingValues() {
    if (this.currentFilter) {
      const currentFilterCriteria = this.selectedFilterCriteria.find((x) => x.fieldId === this.currentFilter.fieldId);
      if (currentFilterCriteria && currentFilterCriteria.values.length) {
        if (this.filterControlType === 'input_text' || this.filterControlType === 'input_desc') {
          this.filterData.inputTextVal = currentFilterCriteria.values[0];
        } else if (this.filterControlType === 'input_numeric') {
          this.filterData.inputNumericVal = Number(currentFilterCriteria.values[0]);
        } else if (this.filterControlType === 'textarea') {
          this.filterData.textareaVal = currentFilterCriteria.values[0];
        } else if (this.filterControlType === 'radio') {
          this.filterData.selectedValue = currentFilterCriteria.values[0];
        } else if (this.filterControlType === 'checkbox') {
          this.dropdownValues.forEach((x, i) => {
            if (currentFilterCriteria.values.includes(x.CODE)) {
              this.dropdownValues[i].checked = true;
            }
          });
        } else if (this.filterControlType === 'dropdown_single') {
          const field = this.dropdownValues.find((x) => x.key === currentFilterCriteria.values[0]);
          this.dropdownSearchCtrl.setValue(field.value);
        } else if (this.filterControlType === 'dropdown_multi') {
          this.dropdownValues.forEach((x, i) => {
            if (currentFilterCriteria.values.includes(x.CODE)) {
              this.dropdownValues[i].checked = true;
            }
          });
          this.dropdownSelectedChips = this.dropdownValues.filter((x) => x.checked === true);
        } else if (this.filterControlType === 'picker_date') {
          this.dateRangeValue = {
            start: currentFilterCriteria.startValue ? new Date(Number(currentFilterCriteria.startValue)) : null,
            end: currentFilterCriteria.endValue ? new Date(Number(currentFilterCriteria.endValue)) : null
          }
        } else if (this.filterControlType === 'picker_time') {
          const startDate = currentFilterCriteria.startValue ? new Date(Number(currentFilterCriteria.startValue)) : null;
          const endDate = currentFilterCriteria.endValue ? new Date(Number(currentFilterCriteria.endValue)) : null;
          if (startDate) {
            this.selectedTimeRange.start = {
              hours: startDate.getHours(),
              minutes: startDate.getMinutes()
            };
          }
          if (endDate) {
            this.selectedTimeRange.end = {
              hours: endDate.getHours(),
              minutes: endDate.getMinutes()
            };
          }
        }
      }
    }
  }

  /**
   * updated filter values to filter criteria in appropriate format
   */
  updateFilterValue(ev) {
    if (this.currentFilter && (ev || ev === '')) {
      const currentFilterCriteria = this.selectedFilterCriteria.find((x) => x.fieldId === this.currentFilter.fieldId);
      if (this.filterControlType === 'input_text' || this.filterControlType === 'input_desc') {
        currentFilterCriteria.values = [`${this.filterData.inputTextVal}`];
      } else if (this.filterControlType === 'input_numeric') {
        currentFilterCriteria.values = [`${this.filterData.inputNumericVal}`];
      } else if (this.filterControlType === 'textarea') {
        currentFilterCriteria.values = [`${this.filterData.textareaVal}`];
      } else if (this.filterControlType === 'radio') {
        this.filterData.selectedValue = ev;
        const value = this.dropdownValues.find((x) => x.value === ev);
        currentFilterCriteria.values = [`${value.key}`];
      }

      this.filterCriteriaSub.next('true');
    }
  }

  /**
   * updates check box value based on user click
   * @param code field code
   * @param ind index
   */
  checkboxChanged(ev, code, ind) {
    this.dropdownValues[ind].checked = (ev === true) ? true : false;
    if (this.currentFilter) {
      const currentFilterCriteria = this.selectedFilterCriteria.find((x) => x.fieldId === this.currentFilter.fieldId);
      if (ev === true && !currentFilterCriteria.values.includes(code)) {
        currentFilterCriteria.values.push(code);
      } else if (ev === false && currentFilterCriteria.values.includes(code)) {
        currentFilterCriteria.values = currentFilterCriteria.values.filter((x) => x !== code);
      }

      this.filterCriteriaSub.next('true');
    }
  }

  /**
   * updates time range
   */
  timeRangeChanged(ev) {
    if (this.currentFilter) {
      const currentFilterCriteria = this.selectedFilterCriteria.find((x) => x.fieldId === this.currentFilter.fieldId);
      const start = ev.start;
      const end = ev.end;

      if (start.hours === 0 && start.minutes === 0 && end.hours === 0 && end.minutes === 0) {
        return;
      } else {
        const startDate = new Date();
        startDate.setHours(start.hours);
        startDate.setMinutes(start.minutes);

        const endDate = new Date();
        endDate.setHours(end.hours);
        endDate.setMinutes(end.minutes);

        currentFilterCriteria.startValue = String(startDate.getTime());
        const endOfDay = moment().endOf('day').toDate().getTime();
        currentFilterCriteria.endValue = (end.hours === 0 && end.minutes === 0) ? String(endOfDay) : String(endDate.getTime());

        this.filterCriteriaSub.next('true');
      }
    }
  }

  /**
   * updated date range
   */
  dateChanged(ev) {
    if (this.currentFilter) {
      const currentFilterCriteria = this.selectedFilterCriteria.find((x) => x.fieldId === this.currentFilter.fieldId);
      if (ev && ev.start) {
        const date = new Date(ev.start);
        const startOfDay = moment(date).startOf('day').toDate().getTime();
        currentFilterCriteria.startValue = (date.getHours() === 0) ? String(startOfDay) : String(date.getTime());
      }
      if (ev && ev.end) {
        const date = new Date(ev.end);
        const endOfDay = moment(date).endOf('day').toDate().getTime();
        currentFilterCriteria.startValue = (date.getHours() === 0) ? String(endOfDay) : String(date.getTime());
      }

      this.filterCriteriaSub.next('true');
    }
  }

  /**
   * updates value in case of single select dropdown
   */
  selectSingle(ev) {
    const value = ev.option.value;
    const code = this.dropdownValues.find((x) => x.value === value)?.key || null;
    if (this.currentFilter && code) {
      const currentFilterCriteria = this.selectedFilterCriteria.find((x) => x.fieldId === this.currentFilter.fieldId);
      currentFilterCriteria.values = [`${code}`];

      this.filterCriteriaSub.next('true');
    }
  }

  /**
   * updates values in case of multi select dropdown
   * @param type specifies to add or remove
   */
  selectMulti(ev, type) {
    const value = (type === 'add') ?  ev.option.value : ev;
    const field = this.dropdownValues.find((x) => x.TEXT === value);
    const code = field.CODE || null;
    if (this.currentFilter && code) {
      const currentFilterCriteria = this.selectedFilterCriteria.find((x) => x.fieldId === this.currentFilter.fieldId);
      if (type === 'add') {
        field.checked = true;
        if (!currentFilterCriteria.values.includes(code)) {
          currentFilterCriteria.values.push(code);
        }
      } else if (type === 'remove') {
        field.checked = false;
        if (currentFilterCriteria.values.includes(code)) {
         currentFilterCriteria.values = currentFilterCriteria.values.filter((x) => x !== code);
        }
      }
    }

    this.dropdownSelectedChips = this.dropdownValues.filter((x) => x.checked === true);
    this.filterCriteriaSub.next('true');
  }

  /**
   * clears all values for new filter to be selected
   */
  clearValues() {
    this.filterControlType = '';
    this.filterData = {
      inputTextVal: undefined,
      inputNumericVal: undefined,
      textareaVal: undefined,
      selectedValue: undefined
    };
    this.dropdownValues = [];
    this.dropdownFilteredValues = [];
    this.dropdownSearchCtrl.setValue('');
    this.dropdownSelectedChips = [];
    this.dateRangeValue = { start: null, end: null };
    this.selectedTimeRange = {
      start: {
        hours: 0,
        minutes: 0
      },
      end: {
        hours: 0,
        minutes: 0
      }
    };
  }
}
