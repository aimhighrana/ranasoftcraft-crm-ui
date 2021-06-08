import { Component, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConditionOperator, Criteria, DisplayCriteria, ReportingWidget, OutputFormat, FormControlType, BlockType, WidgetType } from '@modules/report/_models/widget';
import { ReportService } from '@modules/report/_service/report.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'pros-configure-filters',
  templateUrl: './configure-filters.component.html',
  styleUrls: ['./configure-filters.component.scss']
})
export class ConfigureFiltersComponent implements OnInit {
  filterCriteria: any[] = [];
  columnDescs: any = {} as any;
  tableColumnMetaData: ReportingWidget[];
  selectedFilter: Criteria;
  dropDownDataList: any = {};
  filterApplied: any = {};
  selectedFieldMetaData: ReportingWidget;
  filteredCriteriaList: Criteria[] = [];
  private subscription: Subscription[] = [];
  configurationFilterForm: FormGroup;
  outputFormatList = [{ label: OutputFormat.CODE, value: DisplayCriteria.CODE }, { label: OutputFormat.TEXT, value: DisplayCriteria.TEXT }, { label: OutputFormat.CODE_TEXT, value: DisplayCriteria.CODE_TEXT }];
  rulesList = [{ label: 'Is', value: ConditionOperator.EQUAL }, { label: 'Is Not', value: ConditionOperator.NOT_EQUAL }];
  dateFormat = 'dd MMM, yyyy, h:mm:ss a';

  constructor(
    private router: Router,
    private reportService: ReportService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {
  }


  ngOnInit(): void {
    this.initializeForm();
    this.filteredCriteriaList = this.reportService.getFilterCriteria();
    this.getColumnNames();
  }

  initializeForm() {
    this.configurationFilterForm = this.formBuilder.group({});
  }

  close() {
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  getColumnNames() {
    const fieldsArray = [];
    this.tableColumnMetaData = this.reportService.getColumnMetaData();
    this.tableColumnMetaData.forEach(singlerow => {
      const obj = { fields: singlerow.fields, fieldOrder: singlerow.fieldOrder }
      fieldsArray.push(obj);
      this.columnDescs[singlerow.fields] = singlerow.fieldDesc ? singlerow.fieldDesc : singlerow.fldMetaData.fieldDescri;
    });

    if (this.filteredCriteriaList && this.filteredCriteriaList.length) {
      this.filteredCriteriaList.forEach(item => {
        const type = this.getFormFieldType(item.fieldId);
        if (type === FormControlType.MULTI_SELECT || type === FormControlType.CHECKBOX) {
          const index = this.filterCriteria.findIndex(filterData => item.fieldId == filterData.fieldId);
          if (index > -1) {
            this.filterCriteria[index].conditionFieldValue.push(item.conditionFieldValue);
          } else {
            this.filterCriteria.push({ ...item, conditionFieldValue: [item.conditionFieldValue] })
          }
        } else {
          this.filterCriteria.push({ ...item });
        }
      })
    }
    this.tableColumnMetaData.forEach(item => {
      const index = this.filterCriteria.findIndex(el => el.fieldId === item.fields);
      if (index === -1) {
        this.filterCriteria.push({ fieldId: item.fields, conditionOperator: ConditionOperator.EQUAL })
      }
    })
    this.filterCriteria.forEach((item, index) => {
      if (item.conditionFieldValue) {
        const type = this.getFormFieldType(item.fieldId)
        if (type === FormControlType.MULTI_SELECT || type === FormControlType.RADIO || type === FormControlType.CHECKBOX || type === FormControlType.DROP_DOWN) {
          this.getDropDownValue(item.fieldId);
        }
      }
    })

    if (this.filterCriteria && this.filterCriteria.length) {
      this.selectedFilter = this.filterCriteria[0];
      this.configurationFilterForm.addControl(this.selectedFilter.fieldId, new FormControl());
      const type = this.getFormFieldType(this.selectedFilter.fieldId);
      if (type === FormControlType.TEXT || type === FormControlType.TEXTAREA || type === FormControlType.NUMBER) {
        this.configurationFilterForm.controls[this.selectedFilter.fieldId].setValue(this.selectedFilter.conditionFieldValue);
      }
    }
    const index = this.tableColumnMetaData.findIndex(item => item.fields === this.selectedFilter.fieldId);
    this.selectedFieldMetaData = this.tableColumnMetaData[index];
    if (this.selectedFieldMetaData && !this.selectedFieldMetaData.displayCriteria) {
      this.selectedFieldMetaData['displayCriteria'] = DisplayCriteria.TEXT;
    }
  }


  onFilter(filter: Criteria, ind: number) {
    this.selectedFilter = filter;
    const type = this.getFormFieldType(this.selectedFilter.fieldId);
    const index = this.tableColumnMetaData.findIndex(item => item.fields === this.selectedFilter.fieldId);
    this.selectedFieldMetaData = this.tableColumnMetaData[index];
    if (!this.selectedFieldMetaData.displayCriteria) {
      this.selectedFieldMetaData.displayCriteria = DisplayCriteria.TEXT;
    }
    if (!this.configurationFilterForm.controls[filter.fieldId]) {
      this.configurationFilterForm.addControl(filter.fieldId, new FormControl());
    }
  }

  onChange(value) {
    const formFieldType = this.getFormFieldType(this.selectedFilter.fieldId);
    if (this.filterApplied && this.filterApplied[this.selectedFilter.fieldId] && this.filterApplied[this.selectedFilter.fieldId].length) {
      const selectedChk = this.filterApplied[this.selectedFilter.fieldId].find(fil => fil.CODE === value.CODE);
      console.log(selectedChk);
      if (!selectedChk) {
        const type = this.getFormFieldType(this.selectedFilter.fieldId);
        if (type === FormControlType.MULTI_SELECT || type === FormControlType.CHECKBOX) {
          value.forEach(item => {
            const ind = this.filterApplied[this.selectedFilter.fieldId].findIndex(el => el.CODE === item.CODE);
            if (ind === -1) {
              this.filterApplied[this.selectedFilter.fieldId].push(item);
            }
          })
        } else {
          this.filterApplied[this.selectedFilter.fieldId][0] = value;
        }
      }
    } else {
      if (Array.isArray(value)) {
        this.filterApplied[this.selectedFilter.fieldId] = [...value];
      } else {
        this.filterApplied[this.selectedFilter.fieldId] = [value];
      }
    }
    this.filterApplied[this.selectedFilter.fieldId].forEach(item => {
      const index = this.filterCriteria.findIndex(el => el.fieldId === this.selectedFilter.fieldId);
      if (formFieldType === FormControlType.MULTI_SELECT || formFieldType === FormControlType.CHECKBOX) {
        if (this.filterCriteria[index].conditionFieldValue) {
          this.filterCriteria[index].conditionFieldValue.push(item.CODE);
        }
        else {
          this.filterCriteria[index].conditionFieldValue = [item.CODE];
        }
        const filteredCriteria = new Criteria();
        filteredCriteria.fieldId = this.selectedFilter.fieldId;
        filteredCriteria.conditionFieldId = this.selectedFilter.conditionFieldId;
        filteredCriteria.conditionFieldValue = item.CODE;
        filteredCriteria.blockType = BlockType.COND;
        filteredCriteria.conditionOperator = this.selectedFilter.conditionOperator;
        this.filteredCriteriaList.push(filteredCriteria);
      } else {
        this.filterCriteria[index].conditionFieldValue = item.CODE;
        const ind = this.filteredCriteriaList.findIndex(el => el.fieldId === this.selectedFilter.fieldId);
        if (ind > -1) {
          this.filteredCriteriaList[ind].conditionFieldValue = item.CODE;
        } else {
          const filteredCriteria = new Criteria();
          filteredCriteria.fieldId = this.selectedFilter.conditionFieldId;
          filteredCriteria.conditionFieldId = this.selectedFilter.conditionFieldId;
          filteredCriteria.conditionFieldValue = item.CODE;
          filteredCriteria.blockType = BlockType.COND;
          filteredCriteria.conditionOperator = this.selectedFilter.conditionOperator;
          this.filteredCriteriaList.push(filteredCriteria);
        }
      }
    })
  }


  onInputValueChange(value: string) {
    const filterCriteriaIndex = this.filterCriteria.findIndex(item => item.fieldId === this.selectedFilter.fieldId);
    if (this.filterCriteria[filterCriteriaIndex].conditionFieldValue) {
      this.filterCriteria[filterCriteriaIndex].conditionFieldValue = [value]
      const index = this.filteredCriteriaList.findIndex(item => item.fieldId === this.selectedFilter.fieldId);
      this.filteredCriteriaList[index].conditionFieldValue = value;
    } else {
      const filterCriteria: Criteria = {
        fieldId: this.selectedFilter.fieldId,
        conditionFieldId: this.selectedFilter.fieldId,
        conditionFieldValue: value,
        blockType: BlockType.COND,
        widgetType: WidgetType.TABLE_LIST,
        conditionOperator: this.selectedFilter.conditionOperator,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null
      }
      this.filteredCriteriaList.push({ ...filterCriteria })
      this.filterCriteria[filterCriteriaIndex] = { ...filterCriteria, conditionFieldValue: [value] };
    }
  }

  getDropDownValue(fieldId: string, searchText?) {
    this.reportService.getDropDownValues(fieldId, searchText).subscribe(res => {
      this.dropDownDataList[fieldId] = res;
      const formFieldType = this.getFormFieldType(fieldId);
      const filteredCriteria = this.filterCriteria.find(item => item.fieldId === fieldId);
      this.filterApplied[filteredCriteria.fieldId] = []

      if (formFieldType === FormControlType.MULTI_SELECT || formFieldType === FormControlType.CHECKBOX) {
        filteredCriteria.conditionFieldValue.forEach(el => {
          const data = res.find(item => item.CODE === el);
          if (data) {
            this.filterApplied[filteredCriteria.fieldId] ? this.filterApplied[filteredCriteria.fieldId].push(data) : this.filterApplied[filteredCriteria.fieldId] = [{ ...data }];
          }
        })
      } else {
        const data = res.find(item => item.CODE === filteredCriteria.conditionFieldValue);
        this.filterApplied[filteredCriteria.fieldId] = [{ ...data }];
      }
    });
  }

  changeOutputFormat(type: DisplayCriteria) {
    const index = this.tableColumnMetaData.findIndex(item => item.fields == this.selectedFilter.fieldId);
    this.tableColumnMetaData[index].displayCriteria = type;
    this.selectedFieldMetaData.displayCriteria = type;
  }

  ngOnDestroy() {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    })
  }

  /**
   * 
   * @param fieldId id of field that 
   * @param value selected values for the filter
   * @returns text for the selected value
   */
  getSelectedValue(fieldId: string, value: string): string {
    if (this.dropDownDataList && this.dropDownDataList[fieldId]) {
      const selectedVal = this.dropDownDataList[fieldId].find(item => item.CODE === value);
      return selectedVal ? selectedVal.TEXT : '';
    } else {
      return null;
    }
  }


  /**
   * check whether the field is drop down type or not
   * @param fieldId id of field for the filter
   * @returns boolean value
   */
  isDropDown(fieldId: string) {
    if (this.tableColumnMetaData && this.tableColumnMetaData.length) {
      const hasFld = this.tableColumnMetaData.find(item => item.fields === fieldId);
      if (hasFld && hasFld.fldMetaData && (hasFld.fldMetaData.picklist === '1' || hasFld.fldMetaData.picklist === '30' || hasFld.fldMetaData.picklist === '37')) {
        return true;
      } else {
        return false;
      }
    }
  }

  removedSelectedFilter(code: string, index: number) {
    this.filterApplied[this.selectedFilter.fieldId] = this.filterApplied[this.selectedFilter.fieldId].filter(el => el.CODE !== code);
    const ind = this.filteredCriteriaList.findIndex(item => this.selectedFilter.fieldId === item.fieldId && item.conditionFieldValue === code);
    this.filteredCriteriaList.splice(ind, 1);
    const type = this.getFormFieldType(this.selectedFilter.fieldId)
    if (type === FormControlType.MULTI_SELECT || type === FormControlType.CHECKBOX) {
      const i = this.filterCriteria.findIndex(item => item.fieldId === this.selectedFilter.fieldId && item.conditionFieldValue.indexOf(code) > -1)
      if (i > -1) {
        const conditionFieldIndex = this.filterCriteria[i].conditionFieldValue.indexOf(code);
        this.filterCriteria[i].conditionFieldValue.splice(conditionFieldIndex, 1);
      }
    } else {
      const ind = this.filterCriteria.findIndex(item => item.fieldId === this.selectedFilter.fieldId && item.conditionFieldValue === code);
      this.filterCriteria[ind].conditionFieldValue = null
    }
  }

  applyFilter() {
    this.reportService.setFilterCriteria(this.filteredCriteriaList);
    this.reportService.setColumnMetaData(this.tableColumnMetaData);
    this.reportService.isSideSheetClose.next(true);
    this.router.navigate([{ outlets: { sb: null } }]);
  }

  changeCondition(condition: ConditionOperator) {
    this.filteredCriteriaList.forEach(item => {
      if (item.fieldId === this.selectedFilter.fieldId) {
        item.conditionOperator = condition;
      }
    })
    const index = this.filterCriteria.findIndex(item => item.fieldId === this.selectedFilter.fieldId);
    this.filterCriteria[index].conditionOperator = condition;
  }

  isDateType(): boolean {
    return this.selectedFieldMetaData ? ((this.selectedFieldMetaData.fldMetaData.dataType === 'DATS' || this.selectedFieldMetaData.fldMetaData.dataType === 'DTMS') ? true : false) : false;
  }

  getDateTypeValue(val: string): string {
    return Number(val) ? val : '';
  }


  getFormFieldType(fieldId) {
    const hasFld = this.tableColumnMetaData.find(item => item.fields === fieldId);
    if (hasFld?.fldMetaData?.picklist || hasFld?.fldMetaData?.dataType) {
      if (hasFld.fldMetaData.dataType === 'DATS') {
        return FormControlType.DATE;
      } else if (hasFld.fldMetaData.dataType === 'DTMS') {
        return FormControlType.DATE_TIME;
      } else if (hasFld.fldMetaData.dataType === 'TIMS') {
        return FormControlType.TIME;
      }
      else if (hasFld.fldMetaData.picklist === '1' || hasFld.fldMetaData.picklist === '30' || hasFld.fldMetaData.picklist === '37') {
        if (hasFld.fldMetaData.isCheckList === 'true') {
          return FormControlType.MULTI_SELECT;
        }
        else
          return FormControlType.DROP_DOWN;
      } else if (hasFld.fldMetaData.picklist === '0') {
        if (hasFld.fldMetaData.dataType === 'CHAR' || hasFld.fldMetaData.dataType === 'ALTN' || hasFld.fldMetaData.dataType === 'ICSN' || hasFld.fldMetaData.dataType === 'REQ' || hasFld.fldMetaData.dataType === 'TEXT') {
          return FormControlType.TEXT;
        } else if (hasFld.fldMetaData.dataType === 'NUMC' || hasFld.fldMetaData.dataType === 'DEC') {
          return FormControlType.NUMBER
        } else {
          return false;
        }
      } else if (hasFld.fldMetaData.picklist === '2') {
        return FormControlType.CHECKBOX;
      } else if (hasFld.fldMetaData.picklist === '4' || hasFld.fldMetaData.picklist === '35') {
        return FormControlType.RADIO;
      } else if (hasFld.fldMetaData.picklist === '22' && hasFld.fldMetaData.dataType === 'CHAR') {
        return FormControlType.TEXTAREA;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
  * returns the min or max value for range sliders
  * @param fieldId field id for the column
  * @param limitType min or max value
  * @returns minimum or max value for range slider
  */
  getRangeLimit(fieldId: string, limitType: string): number {
    const fieldData = this.tableColumnMetaData.find(item => item.fields === fieldId)
    if (limitType == 'max')
      return +fieldData.fldMetaData.maxChar;
  }


}