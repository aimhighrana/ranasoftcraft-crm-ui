import { Component, OnInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { WidgetService } from 'src/app/_services/widgets/widget.service';
import { GenericWidgetComponent } from '../../generic-widget/generic-widget.component';
import { FilterWidget, DropDownValues, Criteria, BlockType, ConditionOperator } from '../../../_models/widget';
import { ReportService } from '../../../_service/report.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

export interface User {
  name: string;
}

@Component({
  selector: 'pros-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent extends GenericWidgetComponent implements OnInit, OnChanges {

  values: DropDownValues[] = [];
  filterWidget:BehaviorSubject<FilterWidget> = new BehaviorSubject<FilterWidget>(null);
  filteredOptions: Observable<DropDownValues[]> = of([]);
  filterFormControl: FormControl = new FormControl('');
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
      this.loadAlldropData(widget.fieldId, this.filterCriteria);
    });
  }

  ngOnInit(): void {
    this.getFilterMetadata();
    this.filterFormControl.valueChanges.subscribe(val=>{
      if(val && val !== '' && typeof val === 'string') {
        this.filteredOptions = of( this.values.filter(fill => fill.text.toLocaleLowerCase().indexOf(val.toLocaleLowerCase()) !==-1));
      } else {
        this.filteredOptions = of(this.values);
        if(typeof val === 'string' && val.trim() === ''){
          this.emitEvtFilterCriteria(null);
        }
      }
    });
    this.filterWidget.subscribe(fil=>{
      if(fil) {
        this.loadAlldropData(fil.fieldId, this.filterCriteria);
      }
    });
  }

  getFieldsMetadaDesc(code: string[], fieldId: string) {
    this.reportService.getMetaDataFldByFldIds(fieldId, code).subscribe(res=>{
      this.values = res;
      this.filteredOptions = of(res);
      console.log(res);
    },error=>{
      console.error(`Error : ${error}`);
    })
  }

  public getFilterMetadata():void{
    this.widgetService.getFilterMetadata(this.widgetId).subscribe(returndata=>{
      if(returndata.fieldId !== this.filterWidget.getValue().fieldId) {
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
        const metaData = {code: bucket.key, fieldName: bucket.key} as DropDownValues;
        metadatas.push(metaData);
      });
      this.values = metadatas;
      const fieldIds = metadatas.map(map => map.code);
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
  emitEvtFilterCriteria(event: MatAutocompleteSelectedEvent): void {
    const selectedData = new Criteria();
    selectedData.fieldId = this.filterWidget.getValue().fieldId;
    selectedData.conditionFieldValue = event ? event.option.value.CODE : '';
    selectedData.blockType = BlockType.COND;
    selectedData.conditionOperator = ConditionOperator.EQUAL;
    this.evtFilterCriteria.emit([selectedData]);
  }
}
