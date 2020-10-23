import { Component, OnInit, OnChanges, OnDestroy, Input, LOCALE_ID, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { FilterWidget, DropDownValues, Criteria, BlockType, ConditionOperator, WidgetHeader, FilterResponse, DateFilterQuickSelect, DateBulder, DateSelectionType } from '../../../_models/widget';
import { ReportService } from '../../../_service/report.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSliderChange } from '@angular/material/slider';
import { UDRBlocksModel } from '@modules/admin/_components/module/business-rules/business-rules.modal';

@Component({
  selector: 'pros-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
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

  /**
   * Date filter quick selection..
   */
  dateFilterQuickSelect: DateFilterQuickSelect[] =[
    {
      code: 'TODAY',
      isSelected: false,
      text: 'Today'
    },{
      code: 'DAY_7',
      isSelected: false,
      text: '7 Days'
    },{
      code: 'DAY_10',
      isSelected: false,
      text: '10 Days'
    },{
      code: 'DAY_20',
      isSelected: false,
      text: '20 Days'
    },{
      code: 'DAY_30',
      isSelected: false,
      text:' 30 Days'
    }
  ];

  /** To check clear filter clicked or not */
  isClearFilter = false;

  /**
   * Constructor of Class
   */
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
      if(typeof val === 'string') {
        this.loadAlldropData(this.filterWidget.value.fieldId, this.filterCriteria,val);
      }else {
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

  getFieldsMetadaDesc(buckets:any[], fieldId: string) {
    const finalVal = {} as any;
    buckets.forEach(bucket=>{
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
                  ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
                  (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
                  ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          if(v.t) {
            valArray.push(v.t);
          }
        });
        const finalText = valArray.toString();
        if(finalText) {
          finalVal[key] = finalText
        } else {
          finalVal[key] = key;
        }
      } else {
        finalVal[key] = key;
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

  updateObjRefDescription(buckets:any[], fieldId: string) {
    let  locale = this.locale!==''?this.locale.split('-')[0]:'EN';
    locale = locale.toUpperCase();
    const finalVal = {} as any;
    buckets.forEach(bucket=>{
      const key = bucket.key;
      const hits = bucket['top_hits#items'] ? bucket['top_hits#items'].hits.hits[0] : null;
      const val = hits._source.hdvs?(hits._source.hdvs[fieldId] ?
        ( hits._source.hdvs[fieldId] ? hits._source.hdvs[fieldId].vc : null) : null):
        (hits._source.staticFields && hits._source.staticFields[fieldId]) ?
        ( hits._source.staticFields[fieldId] ? hits._source.staticFields[fieldId].vc : null) : null;
      if(val) {
        const valArray = [];
        val.forEach(v=>{
          if(v.t) {
            valArray.push(v.t);
          }
        });
        const finalText = valArray.toString();
        if(finalText) {
          finalVal[key] = finalText
        } else {
          finalVal[key] = key;
        }
      } else {
        finalVal[key] = key;
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

      // check if date type field and has default filter then apply it
      if(returndata.isGlobal
        && ((returndata.fieldId === 'STAGE' || returndata.fieldId === 'APPDATE')
        || (returndata.metaData && returndata.metaData.picklist === '0'
        && (returndata.metaData.dataType === 'DATS' || returndata.metaData.dataType === 'DTMS')))) {

          const dateFilterBlock: UDRBlocksModel = returndata.udrBlocks ? returndata.udrBlocks[0] : null;
          if(dateFilterBlock && dateFilterBlock.blockDesc) {
            const strtEndDt = new DateBulder().build(dateFilterBlock.blockDesc as DateSelectionType);
            if(strtEndDt) {
              dateFilterBlock.conditionFieldStartValue = strtEndDt[0];
              dateFilterBlock.conditionFieldEndValue = strtEndDt[1];
            }
            const criteria: Criteria = new Criteria();
            criteria.fieldId = returndata.fieldId;
            criteria.blockType = dateFilterBlock.blockType;
            criteria.conditionFieldId = dateFilterBlock.conditionFieldId;
            criteria.conditionFieldStartValue = dateFilterBlock.conditionFieldStartValue;
            criteria.conditionFieldEndValue = dateFilterBlock.conditionFieldEndValue;
            criteria.conditionOperator = dateFilterBlock.conditionOperator as ConditionOperator;
            criteria.udrid = dateFilterBlock.udrid;

            // set selected value
            this.startDateCtrl = new FormControl(new Date(Number(dateFilterBlock.conditionFieldStartValue)));
            this.endDateCtrl = new FormControl(new Date(Number(dateFilterBlock.conditionFieldEndValue)));

            this.setSelectedQuickDateFilter(dateFilterBlock.blockDesc);

            this.filterCriteria.push(criteria);

            // emit value for apply filter
            setTimeout(()=>{
              this.emitEvtFilterCriteria(this.filterCriteria);
            },2000);
          }

      }

    },error=>{
      console.error(`Error : ${error}`);
    });
  }

  setSelectedQuickDateFilter(code: string) {
    switch (code) {
      case 'TODAY':
        const todayFill = this.dateFilterQuickSelect.filter(f=> f.code === 'TODAY')[0];
        todayFill.isSelected = true;
        break;

      case 'DAY_7':
        const day7Fill = this.dateFilterQuickSelect.filter(f=> f.code === 'DAY_7')[0];
        day7Fill.isSelected = true;
        break;

      case 'DAY_10':
        const day10Fill = this.dateFilterQuickSelect.filter(f=> f.code === 'DAY_10')[0];
        day10Fill.isSelected = true;
        break;

      case 'DAY_20':
        const day20Fill = this.dateFilterQuickSelect.filter(f=> f.code === 'DAY_20')[0];
        day20Fill.isSelected = true;
        break;

      case 'DAY_30':
        const day30Fill = this.dateFilterQuickSelect.filter(f=> f.code === 'DAY_30')[0];
        day30Fill.isSelected = true;
        break;
      default:
        break;
    }
  }

  selectQuickDate(code: string, isSelected: boolean) {

    // unselect all
    this.dateFilterQuickSelect.forEach(f=>{
      f.isSelected = false;
    });
    if(!isSelected) {
      const strtEndDt = new DateBulder().build(code as DateSelectionType);
      if(strtEndDt) {
        // set selected value
        this.startDateCtrl = new FormControl(new Date(Number(strtEndDt[0])));
        this.endDateCtrl = new FormControl(new Date(Number(strtEndDt[1])));
        this.startDate = strtEndDt[0];
        this.endDate = strtEndDt[1];

        // codeTxt.isSelected = true;
        // this.dateFilterQuickSelect[idx] = codeTxt;
        this.setSelectedQuickDateFilter(code);
        this.emitDateChangeValues();
      }
    } else {
      this.clearSelectedPicker();
    }
  }

  private loadAlldropData(fieldId: string, criteria: Criteria[],searchString?:string):void{
    this.widgetService.getWidgetData(String(this.widgetId), criteria,searchString).subscribe(returnData=>{
      const buckets  = returnData.aggregations[`sterms#FILTER`]  ? returnData.aggregations[`sterms#FILTER`].buckets : [];
      if(this.filterWidget.getValue().metaData &&(this.filterWidget.getValue().metaData.picklist === '1' || this.filterWidget.getValue().metaData.picklist === '30' || this.filterWidget.getValue().metaData.picklist === '37')) {
        const metadatas: DropDownValues[] = [];
        buckets.forEach(bucket => {
          const metaData = {CODE: bucket.key, FIELDNAME: fieldId, TEXT: bucket.key} as DropDownValues;
          metadatas.push(metaData);
        });
        this.values = metadatas;
        if(this.filterWidget.getValue().metaData.picklist === '1' || this.filterWidget.getValue().metaData.picklist === '37' || this.filterWidget.getValue().metaData.picklist === '4' || this.filterWidget.getValue().metaData.picklist === '38') {
          this.getFieldsMetadaDesc(buckets, fieldId);
        } else if(this.filterWidget.getValue().metaData.picklist === '30'){
          this.updateObjRefDescription(buckets, fieldId);
        } else {
          this.filteredOptions = of(this.values);
        }
      } else if(this.filterWidget.getValue().metaData && (this.filterWidget.getValue().metaData.picklist === '0' && this.filterWidget.getValue().metaData.dataType === 'NUMC')) {
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
    }
  }

  toggleSelection(option: DropDownValues) {
    let selectedOptions = this.filterCriteria.filter(fill => fill.conditionFieldId === option.FIELDNAME);
    const codeAvail = this.filterCriteria.filter(fill => (fill.conditionFieldId === option.FIELDNAME && fill.conditionFieldValue === option.CODE)).length >0 ? true : false;
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
    const isPreViusSelected = this.filterCriteria.filter(fill => ( fill.conditionFieldId === this.filterWidget.getValue().fieldId && fill.conditionFieldValue === option.CODE));
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
      this.startDate = String(event.value.getTime());
      this.emitDateChangeValues();
    }
    // unselect all
    this.dateFilterQuickSelect.forEach(f=>{
      f.isSelected = false;
    });
  }

  changeEndtDate(event: MatDatepickerInputEvent<Date>) {
    if(event.value && event.value.getTime()) {
      this.endDate = String(event.value.getTime());
      this.emitDateChangeValues();
    }
    // unselect all
    this.dateFilterQuickSelect.forEach(f=>{
      f.isSelected = false;
    });
  }
  emitDateChangeValues() {
    if(this.startDate && this.endDate) {
      if(this.startDate === this.endDate) {
        this.endDate = String(Number(this.startDate) + 24*60*60*1000);
      }
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

    this.dateFilterQuickSelect.forEach(f=>{
      f.isSelected = false;
    });

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
    const picklist = this.filterWidget.getValue() ? (this.filterWidget.getValue().metaData ? this.filterWidget.getValue().metaData.picklist : '') : '';
    const dataType = this.filterWidget.getValue() ? (this.filterWidget.getValue().metaData ? this.filterWidget.getValue().metaData.dataType : '') : '';
    switch (picklist) {
      case '0':
        if(dataType === 'NUMC') {
          const checkPreviousApplied = this.filterCriteria.filter(fill => fill.conditionFieldId === this.filterWidget.getValue().fieldId);
          this.removeOldFilterCriteria(checkPreviousApplied);
          this.emitEvtFilterCriteria(this.filterCriteria);
          this.numericValCtrl.setValue(this.filterResponse.max);
        } else if(dataType === 'DTMS' || dataType === 'DATS') {
          this.clearSelectedPicker();
        }
        break;
      case '1':
      case '30':
      case '37':
        this.removeSingleSelectedVal(true);
        break;
      case '29':
        this.isClearFilter = !this.isClearFilter;
        break;
      default:
        break;
    }
    this.enableClearIcon = false;
  }


  /**
   * function to get value of location selection
   * @param node selection change of location
   */
  getLocationSelection(node: string[]){
    console.log(node);
    const filterCriteria = this.filterCriteria;
    const hasCondition = this.filterCriteria.filter(fil => fil.conditionFieldId === this.filterWidget.getValue().fieldId);
    if(node) {
      if(hasCondition) {
        hasCondition.forEach(has=>{
          filterCriteria.splice(filterCriteria.indexOf(has),1);
        });
      }
      node.forEach(n=>{
        const criteria = new Criteria();
        criteria.conditionFieldValue = n;
        criteria.conditionOperator = ConditionOperator.LOCATION;
        criteria.blockType = BlockType.COND;
        criteria.conditionFieldId  = this.filterWidget.getValue().fieldId;
        criteria.fieldId = this.filterWidget.getValue().fieldId;
        filterCriteria.push(criteria);
      });
    } else {
      if(hasCondition) {
        hasCondition.forEach(has=>{
          filterCriteria.splice(filterCriteria.indexOf(has),1);
        });
      }
    }
    this.filterCriteria = filterCriteria;
    this.emitEvtFilterCriteria(this.filterCriteria);
    console.log(node);
  }
}
