import { Component, OnInit, OnChanges, OnDestroy, Input, LOCALE_ID, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { FilterWidget, DropDownValues, Criteria, BlockType, ConditionOperator, WidgetHeader, FilterResponse } from '../../../_models/widget';
import { ReportService } from '../../../_service/report.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSliderChange } from '@angular/material/slider';

@Component({
  selector: 'pros-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent extends GenericWidgetComponent implements OnInit, OnChanges,OnDestroy {

  values: DropDownValues[] = [];
  filterWidget:BehaviorSubject<FilterWidget> = new BehaviorSubject<FilterWidget>(null);
  filteredOptions: Observable<DropDownValues[]> = of([]);
  filterFormControl = new FormControl();
  widgetHeader: WidgetHeader = new WidgetHeader();
  selectedDropVals: DropDownValues[] = [];
  enableClearIcon = false;
  startDate: string;
  endDate: string;
  startDateCtrl: FormControl = new FormControl();
  endDateCtrl: FormControl = new FormControl();
  numericValCtrl: FormControl = new FormControl();
  filterResponse: FilterResponse;

  /**
   * When reset filter from main container value should be true
   */
  @Input()
  hasFilterCriteria: boolean;

  constructor(
    private widgetService : WidgetService,
    private reportService: ReportService,
    @Inject(LOCALE_ID) public locale: string
  ) {
    super();
  }

  ngOnDestroy(): void {
    this.filterWidget.complete();
    this.filterWidget.unsubscribe();
  }

  /**
   * Automatic angular trigger when the filterCriteria changed by dashboard container
   *
   */
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    if(changes && changes.hasFilterCriteria && changes.hasFilterCriteria.previousValue !== changes.hasFilterCriteria.currentValue) {
      this.clearFilterCriteria();
    }
  }

  ngOnInit(): void {
    this.getFilterMetadata();
    this.getHeaderMetaData();
    this.filterFormControl.valueChanges.subscribe(val=>{
      if(val && val !== '' && typeof val === 'string') {
        this.filteredOptions = of( this.values.filter(fill => fill.TEXT.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !==-1));
      } else {
        this.filteredOptions = of(this.values);
        if(typeof val === 'string' && val.trim() === '' && !this.filterWidget.getValue().isMultiSelect){
          this.removeSingleSelectedVal(false);
        }
      }
    });
    this.filterWidget.subscribe(widget=>{
      if(widget) {
        this.loadAlldropData(widget.fieldId, this.filterCriteria);
      }
    });
  }

  getFieldsMetadaDesc(code: string[], fieldId: string) {
    this.reportService.getMetaDataFldByFldIds(fieldId, code).subscribe(res=>{
      res.forEach(data=>{
        const valOld = this.values.filter(fill => fill.CODE === data.CODE);
        if(valOld.length >0) {
          const index = this.values.indexOf(valOld[0]);
          valOld[0].TEXT = data.TEXT;
          valOld[0].FIELDNAME = data.FIELDNAME;
          this.values[index] = valOld[0];
        }
      });
      this.filteredOptions = of(this.values);
    },error=>{
      console.error(`Error : ${error}`);
    })
  }

  updateObjRefDescription(buckets:any[], fieldId: string) {
    let  locale = this.locale!==''?this.locale.split('-')[0]:'EN';
    locale = locale.toUpperCase();
    const finalVal = {} as any;
    buckets.forEach(bucket=>{
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const ddv = hits._source.hdvs[fieldId] ?( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].ddv : null) : null;
      if(ddv) {
        const hasValue =  ddv.filter(fil=> fil.lang === locale)[0];
        if(hasValue) {
          finalVal[key] = hasValue.val;
        }
      } else {
        finalVal[key] = hits._source.hdvs[fieldId].vc;
      }
    });

    Object.keys(finalVal).forEach(key=>{
        const valOld = this.values.filter(fill => fill.CODE === key);
        if(valOld.length >0) {
          const index = this.values.indexOf(valOld[0]);
          valOld[0].TEXT = finalVal[key];
          valOld[0].FIELDNAME = fieldId;
          this.values[index] = valOld[0];
        }
    });
    this.filteredOptions = of(this.values);
  }

  public getHeaderMetaData():void{
    this.widgetService.getHeaderMetaData(this.widgetId).subscribe(returnData=>{
      this.widgetHeader = returnData;
    },error=> console.error(`Error : ${error}`));
  }

  public getFilterMetadata():void{
    this.widgetService.getFilterMetadata(this.widgetId).subscribe(returndata=>{
      if(returndata && returndata.fieldId !== (this.filterWidget.getValue() ? this.filterWidget.getValue().fieldId : null)){
        this.filterWidget.next(returndata);
      }
    },error=>{
      console.error(`Error : ${error}`);
    });
  }

  private loadAlldropData(fieldId: string, criteria: Criteria[]):void{
    this.widgetService.getWidgetData(String(this.widgetId), criteria).subscribe(returnData=>{
      const buckets  = returnData.aggregations[`sterms#FILTER`]  ? returnData.aggregations[`sterms#FILTER`].buckets : [];
      if(this.filterWidget.getValue().metaData.picklist === '1' || this.filterWidget.getValue().metaData.picklist === '30' || this.filterWidget.getValue().metaData.picklist === '37') {
        const metadatas: DropDownValues[] = [];
        buckets.forEach(bucket => {
          const metaData = {CODE: bucket.key, FIELDNAME: fieldId, TEXT: bucket.key} as DropDownValues;
          metadatas.push(metaData);
        });
        this.values = metadatas;
        const fieldIds = metadatas.map(map => map.CODE);
        if(this.filterWidget.getValue().metaData.picklist === '1' || this.filterWidget.getValue().metaData.picklist === '37') {
          this.getFieldsMetadaDesc(fieldIds, fieldId);
        } else if(this.filterWidget.getValue().metaData.picklist === '30'){
          this.updateObjRefDescription(buckets, fieldId);
        } else {
          this.filteredOptions = of(this.values);
        }
      } else if(this.filterWidget.getValue().metaData.picklist === '0' && this.filterWidget.getValue().metaData.dataType === 'NUMC') {
        // static data  TODO
        const filterResponse = new FilterResponse();
        filterResponse.min = 1;
        filterResponse.max = 2000;
        filterResponse.fieldId = this.filterWidget.getValue().fieldId;
        this.filterResponse = filterResponse;
      }

    }, error=>{
      console.error(`Error : ${error}`);
    });
  }

  fieldDisplayFn(data): string {
    return data ? data.TEXT : '';
  }

  emitEvtClick(): void {
    throw new Error('Method not implemented.');
  }
  emitEvtFilterCriteria(criteria: Criteria[]): void {
    this.evtFilterCriteria.emit(criteria);
  }

  optionClicked(event: Event, option: DropDownValues) {
    if(event) {
      event.stopPropagation();
      this.toggleSelection(option);
      console.log(this.filterFormControl);
    }
  }

  toggleSelection(option: DropDownValues) {
    let selectedOptions = this.filterCriteria.filter(fill => fill.conditionFieldId === option.FIELDNAME);
    const codeAvail = this.filterCriteria.filter(fill => fill.conditionFieldValue === option.CODE).length >0 ? true : false;
    this.removeOldFilterCriteria(selectedOptions);
    if(this.filterWidget.getValue() && this.filterWidget.getValue().isMultiSelect) {
      if(selectedOptions.length >0) {
        const cri = selectedOptions.filter(fill => fill.conditionFieldValue === option.CODE);
        if(cri.length >0) {
          selectedOptions.splice(selectedOptions.indexOf(cri[0]),1);
        } else {
          const critera1: Criteria = new Criteria();
          critera1.fieldId = this.filterWidget.getValue().fieldId;
          critera1.conditionFieldId = this.filterWidget.getValue().fieldId;
          critera1.conditionFieldValue = option.CODE ? option.CODE : '';
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          selectedOptions.push(critera1);
          this.enableClearIcon = true;
        }
      } else {
        const critera1: Criteria = new Criteria();
        critera1.fieldId = this.filterWidget.getValue().fieldId;
        critera1.conditionFieldId = this.filterWidget.getValue().fieldId;
        critera1.conditionFieldValue = option ? option.CODE : '';
        critera1.blockType = BlockType.COND;
        critera1.conditionOperator = ConditionOperator.EQUAL;
        selectedOptions.push(critera1);
        this.enableClearIcon = true;
      }
    } else {
        selectedOptions = []; // reset previous selection
        if(!codeAvail) {
          const critera1: Criteria = new Criteria();
          critera1.fieldId = this.filterWidget.getValue().fieldId;
          critera1.conditionFieldId = this.filterWidget.getValue().fieldId;
          critera1.conditionFieldValue = option ? option.CODE : '';
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          selectedOptions.push(critera1);
          this.enableClearIcon = true;
        }
    }
    selectedOptions.forEach(op=> this.filterCriteria.push(op));
    this.selectedDropVals = this.returnSelectedDropValues(this.filterCriteria);
    this.emitEvtFilterCriteria(this.filterCriteria);
  }

  /**
   * Remove old filter criteria for field
   * selectedOptions as parameter
   */
  removeOldFilterCriteria(selectedOptions: Criteria[]) {
    selectedOptions.forEach(option=>{
      this.filterCriteria.splice(this.filterCriteria.indexOf(option), 1);
    });
  }

  isSelected(option: DropDownValues): boolean {
    const isPreViusSelected = this.filterCriteria.filter(fill => fill.conditionFieldValue === option.CODE);
    if(isPreViusSelected.length>0) {
      return true;
    } else {
      return false;
    }
  }

  returnSelectedDropValues(selectedOptions: Criteria[]): DropDownValues[] {
    const returnValue: DropDownValues[] = [];
    selectedOptions.forEach(value => {
      if(value.fieldId === this.filterWidget.value.fieldId){
        const textVal = this.values.filter(val => val.CODE === value.conditionFieldValue);
        const text = textVal.length >0 ? textVal[0].TEXT : value.conditionFieldValue;
        returnValue.push({CODE: value.conditionFieldValue,FIELDNAME: value.fieldId,TEXT: text,langu:'EN',sno: null});
      }

    });
    return returnValue;
  }

  remove(option: DropDownValues) {
    this.toggleSelection(option);
  }

  removeSingleSelectedVal(isClearCall: boolean) {
    const appliedFiltered = this.filterCriteria.filter(fill => fill.fieldId === this.filterWidget.getValue().fieldId);
    appliedFiltered.forEach(fill=>{
      this.filterCriteria.splice(this.filterCriteria.indexOf(fill),1);
    });
    this.enableClearIcon = false;
    if(isClearCall) {
      this.selectedDropVals = [];
    }
    this.emitEvtFilterCriteria(this.filterCriteria);
  }


  setPositionOfDatePicker() {
    setTimeout(()=>{
      if(document.getElementsByClassName('cdk-overlay-pane mat-datepicker-popup')[0]) {
        let leftPos1 = (document.getElementsByClassName('cdk-overlay-pane mat-datepicker-popup')[0] as HTMLDivElement).style.left;
        leftPos1 = leftPos1.split('px')[0];

        let leftPos2 = (document.getElementsByClassName('cdk-overlay-pane mat-datepicker-popup')[1] as HTMLDivElement).style.left;
        leftPos2 = leftPos2.split('px')[0];

        if(Number(leftPos2)<50) {
          (document.getElementsByClassName('cdk-overlay-pane mat-datepicker-popup')[0] as HTMLDivElement).style.left = (Number(leftPos1) + 200) + 'px';
        } else {
          (document.getElementsByClassName('cdk-overlay-pane mat-datepicker-popup')[1] as HTMLDivElement).style.left = (Number(leftPos1) - 300) + 'px';
        }
      }
    },100);
  }


  changeStartDate(event: MatDatepickerInputEvent<Date>) {
    if(event.value && event.value.getTime()) {
      this.startDate = `${event.value.getTime()}`;
      this.emitDateChangeValues();
    }
  }

  changeEndtDate(event: MatDatepickerInputEvent<Date>) {
    if(event.value && event.value.getTime()) {
      this.endDate = `${event.value.getTime()}`;
      this.emitDateChangeValues();
    }
  }
  emitDateChangeValues() {
    if(this.startDate && this.endDate) {
      this.enableClearIcon = true;
      let checkPreviousApplied = this.filterCriteria.filter(fill => fill.conditionFieldId === this.filterWidget.getValue().fieldId);
      this.removeOldFilterCriteria(checkPreviousApplied);
      if(checkPreviousApplied.length) {
        checkPreviousApplied[0].conditionFieldStartValue = this.startDate;
        checkPreviousApplied[0].conditionFieldEndValue = this.endDate;
      } else {
        checkPreviousApplied = [];
        const critera: Criteria = new Criteria();
        critera.fieldId = this.filterWidget.getValue().fieldId;
        critera.conditionFieldId = this.filterWidget.getValue().fieldId;
        critera.conditionFieldEndValue = this.endDate;
        critera.conditionFieldStartValue = this.startDate;
        critera.blockType = BlockType.COND;
        critera.conditionOperator = ConditionOperator.RANGE;
        checkPreviousApplied.push(critera);
      }
      checkPreviousApplied.forEach(op=> this.filterCriteria.push(op));
      this.emitEvtFilterCriteria(this.filterCriteria);
    }
  }
  clearSelectedPicker() {
    this.startDate = null;
    this.endDate = null;
    this.startDateCtrl = new FormControl('');
    this.endDateCtrl = new FormControl('');
    this.enableClearIcon = false;
    const checkPreviousApplied = this.filterCriteria.filter(fill => fill.conditionFieldId === this.filterWidget.getValue().fieldId);
    this.removeOldFilterCriteria(checkPreviousApplied);
    this.emitEvtFilterCriteria(this.filterCriteria);
  }
  formatMatSliderLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return value;
  }

  sliderValueChange(event: MatSliderChange) {
    if(event && event.value) {
      this.enableClearIcon = true;
      let checkPreviousApplied = this.filterCriteria.filter(fill => fill.conditionFieldId === this.filterWidget.getValue().fieldId);
      this.removeOldFilterCriteria(checkPreviousApplied);
      if(checkPreviousApplied.length) {
        checkPreviousApplied[0].conditionFieldStartValue = String(this.filterResponse.min);
        checkPreviousApplied[0].conditionFieldEndValue = String(event.value);
      } else {
        checkPreviousApplied = [];
        const critera: Criteria = new Criteria();
        critera.fieldId = this.filterWidget.getValue().fieldId;
        critera.conditionFieldId = this.filterWidget.getValue().fieldId;
        critera.conditionFieldEndValue = String(event.value);
        critera.conditionFieldStartValue = String(this.filterResponse.min);
        critera.blockType = BlockType.COND;
        critera.conditionOperator = ConditionOperator.RANGE;
        checkPreviousApplied.push(critera);
      }
      checkPreviousApplied.forEach(op=> this.filterCriteria.push(op));
      this.emitEvtFilterCriteria(this.filterCriteria);
    }
  }

  clearFilterCriteria() {
    const picklist = this.filterWidget.getValue() ? this.filterWidget.getValue().metaData.picklist : '';
    const dataType = this.filterWidget.getValue() ? this.filterWidget.getValue().metaData.dataType : '';
    switch (picklist) {
      case '0':
        if(dataType === 'NUMC') {
          const checkPreviousApplied = this.filterCriteria.filter(fill => fill.conditionFieldId === this.filterWidget.getValue().fieldId);
          this.removeOldFilterCriteria(checkPreviousApplied);
          this.emitEvtFilterCriteria(this.filterCriteria);
          this.numericValCtrl.setValue(this.filterResponse.max);
        } else if(dataType === 'DTMS') {
          this.clearSelectedPicker();
        }
        break;
      case '1':
      case '30':
      case '37':
        this.removeSingleSelectedVal(true);
        break;
      default:
        break;
    }
    this.enableClearIcon = false;
  }

}
