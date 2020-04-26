import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { FilterWidget, DropDownValues, Criteria, BlockType, ConditionOperator, WidgetHeader } from '../../../_models/widget';
import { ReportService } from '../../../_service/report.service';

@Component({
  selector: 'pros-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent extends GenericWidgetComponent implements OnInit, OnChanges {

  values: DropDownValues[] = [];
  filterWidget:BehaviorSubject<FilterWidget> = new BehaviorSubject<FilterWidget>(null);
  filteredOptions: Observable<DropDownValues[]> = of([]);
  filterFormControl = new FormControl();
  widgetHeader: WidgetHeader = new WidgetHeader();
  constructor(
    private widgetService : WidgetService,
    private reportService: ReportService
  ) {
    super();
  }

  /**
   * Automatic angular trigger when the filterCriteria changed by dashboard container
   *
   */
  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {
    this.filterWidget.subscribe(widget=>{
      if(widget) {
        this.loadAlldropData(widget.fieldId, this.filterCriteria);
      }
    });
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
          this.emitEvtFilterCriteria(null);
        }
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
      const buckets  = returnData.aggregations[`sterms#${fieldId}`]  ? returnData.aggregations[`sterms#${fieldId}`].buckets : [];
      const metadatas: DropDownValues[] = [];
      buckets.forEach(bucket => {
        const metaData = {CODE: bucket.key, FIELDNAME: fieldId} as DropDownValues;
        metadatas.push(metaData);
      });
      this.values = metadatas;
      const fieldIds = metadatas.map(map => map.CODE);
      this.getFieldsMetadaDesc(fieldIds, fieldId);
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
          critera1.conditionFieldValue = option ? option.CODE : '';
          critera1.blockType = BlockType.COND;
          critera1.conditionOperator = ConditionOperator.EQUAL;
          selectedOptions.push(critera1);
        }
      } else {
        const critera1: Criteria = new Criteria();
        critera1.fieldId = this.filterWidget.getValue().fieldId;
        critera1.conditionFieldId = this.filterWidget.getValue().fieldId;
        critera1.conditionFieldValue = option ? option.CODE : '';
        critera1.blockType = BlockType.COND;
        critera1.conditionOperator = ConditionOperator.EQUAL;
        selectedOptions.push(critera1);
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
        }
    }
    selectedOptions.forEach(op=> this.filterCriteria.push(op));
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
}
