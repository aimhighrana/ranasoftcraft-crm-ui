import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SchemaVariantsModel, VarinatType } from '@models/schema/schemalist';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import * as moment from 'moment';
import { Observable, of, Subscription } from 'rxjs';



export interface StatisticsFilterParams {
  unit: string;
  exe_start_date: string;
  exe_end_date: string;
  _date_filter_type: 'today'  | 'this_week' | 'this_month' | 'specific_date' | 'date_range';
  _data_scope: SchemaVariantsModel;
}

@Component({
  selector: 'pros-statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss']
})
export class StaticsComponent implements OnInit, OnDestroy {


  @Input()
  moduleId: string;

  @Input()
  schemaId: string;

  /**
   * Filter params ...
   */
  statsFilterParams: StatisticsFilterParams;

  /**
   * Max date for block feature date ..
   */
  maxDate = new Date();

  /**
   * All https / service subscription ..
   */
  subscriptions: Subscription[] = [];

  /**
   * Data scopes ..
   */
  dataScope: SchemaVariantsModel[] = [];

  /**
   * Data scopes .. obserable for search in context .
   */
  dataScopeOb: Observable<SchemaVariantsModel[]> = of([]);

  constructor(
    private schemavariantService: SchemaVariantService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.getDataScope();
    // set default filter params ...
    const exeStartEndDate = this._momentDate('this_month');
    this.statsFilterParams = {unit: 'day', exe_end_date: exeStartEndDate[1], exe_start_date : exeStartEndDate[0],_date_filter_type:'this_month', _data_scope: {variantId:'0',variantName:'Entire data scope', variantType: VarinatType.RUNFOR} as SchemaVariantsModel};
  }

  /**
   * Update filter params ..
   * @param type determine what type of filter is applied ..
   * @param value filter value ...
   */
  applyFilter(type: string, value?: any) {
    if(type === 'unit') {
      this.statsFilterParams.unit = value;
    } else if(type === 'date') {
      const exeDate = this._momentDate(value);
      switch (value) {
        case 'today':
          this.statsFilterParams.exe_start_date = exeDate[0];
          this.statsFilterParams.exe_end_date = exeDate[1];
          this.statsFilterParams._date_filter_type = 'today';
          break;

        case 'this_week':
          this.statsFilterParams.exe_start_date = exeDate[0];
          this.statsFilterParams.exe_end_date = exeDate[1];
          this.statsFilterParams._date_filter_type = 'this_week';
          break;

        case 'this_month':
          this.statsFilterParams.exe_start_date = exeDate[0];
          this.statsFilterParams.exe_end_date = exeDate[1];
          this.statsFilterParams._date_filter_type = 'this_month';
          break;
        default:
          console.log(`Wrong type .. ${type}`)
          break;
      }
    } else if(type === 'data_scope'){
        this.statsFilterParams._data_scope = value;
        console.log(this.statsFilterParams);
    }

    this._updatefilterCriteria();
  }


  /**
   * Get units terms to readable format ..
   */
  get selectedUnit(): string {
    return this.statsFilterParams.unit === 'day' ? 'Daily' :
           this.statsFilterParams.unit === 'week' ? 'Weekly' :
           this.statsFilterParams.unit === 'month' ? 'Monthly' :
           this.statsFilterParams.unit === 'year' ? 'Yearly' : 'Unknown unit';
  }

  /**
   * Selected date filter .. text over chips ..
   */
  get selectedDateFilter(): string {
    return this.statsFilterParams._date_filter_type === 'today' ? 'Today' :
           this.statsFilterParams._date_filter_type === 'this_week' ? 'This week' :
           this.statsFilterParams._date_filter_type === 'this_month' ? 'This month' :
           this.statsFilterParams._date_filter_type === 'specific_date' ? moment(Number(this.statsFilterParams.exe_start_date)).format('DD-MMM-YYYY') :
           this.statsFilterParams._date_filter_type === 'date_range' ? `${moment(Number(this.statsFilterParams.exe_start_date)).format('DD-MMM-YYYY') } - ${moment(Number(this.statsFilterParams.exe_end_date)).format('DD-MMM-YYYY') }` : 'Unknown filter';
  }

  /**
   * Call after value change on specific date ...
   * @param evt event after changed value on specific range ..
   */
  changeSpecificDate(evt: MatDatepickerInputEvent<Date>) {
    if(evt && evt.value) {
      const exeStartDate = moment(evt.value).startOf('day').toDate().getTime();
      const execEndDate = moment(evt.value).endOf('day').toDate().getTime();
      this.statsFilterParams.exe_start_date = String(exeStartDate);
      this.statsFilterParams.exe_end_date = String(execEndDate);
      this.statsFilterParams._date_filter_type = 'specific_date';

      this._updatefilterCriteria();
    }
  }

  /**
   * Called after  value change on date range ..
   * @param type define its start_date or end_date ..
   * @param evt event after value change from date range...
   */
  changeDateRange(type: string , evt: MatDatepickerInputEvent<Date>) {
    if(type === 'start') {
      this.statsFilterParams.exe_start_date = String(moment(evt.value).startOf('day').toDate().getTime());
    } else if(type === 'end') {
      this.statsFilterParams.exe_end_date = String(moment(evt.value).endOf('day').toDate().getTime());
    }
    this.statsFilterParams._date_filter_type = 'date_range';
    this._updatefilterCriteria();
  }

  /**
   * Call service to retrive all data scopes ...
   */
  getDataScope() {
    const sub = this.schemavariantService.getDataScope(this.schemaId, 'RUNFOR').subscribe(res => {
      this.dataScope = res;
      this.dataScope.splice(0,0,{variantId:'0',variantName:'Entire data scope', variantType: VarinatType.RUNFOR} as SchemaVariantsModel);
      this.dataScopeOb = of(this.dataScope);
    }, err => console.error(`Exception : ${err.message}`));
    this.subscriptions.push(sub);
  }

  /**
   * Filter data scops .. based on searchable text ..
   * @param val searchable text ..
   */
  filterDataScope(val: string) {
    if(val && val.trim() !== '') {
      this.dataScopeOb = of(this.dataScope.filter(fil => fil.variantName.toLocaleLowerCase().indexOf(val.trim().toLocaleLowerCase()) !==-1));
    } else {
      this.dataScopeOb = of(this.dataScope);
    }
  }


  /**
   * Update filter criteria .. after value change on any filter ...
   * And notify child component for make api call based on filter params ..
   */
  _updatefilterCriteria() {
    this.statsFilterParams = { unit: this.statsFilterParams.unit,
      exe_end_date: this.statsFilterParams.exe_end_date,
      exe_start_date: this.statsFilterParams.exe_start_date,
      _date_filter_type: this.statsFilterParams._date_filter_type,
      _data_scope: this.statsFilterParams._data_scope};
  }

  /**
   * Return date in millis .. ref moment()
   * @param input what type of filter applied ..
   */
  _momentDate(input: string) {
    const startEndDate = [];
    switch (input) {
      case 'today':
        startEndDate.push(moment().startOf('day').toDate().getTime());
        startEndDate.push(moment().endOf('day').toDate().getTime());
        break;

      case 'this_week':
        startEndDate.push(moment().startOf('week').toDate().getTime());
        startEndDate.push(moment().endOf('day').toDate().getTime());
        break;

      case 'this_month':
        startEndDate.push(moment().startOf('month').toDate().getTime());
        startEndDate.push(moment().endOf('day').toDate().getTime());
        break;
      default:
        break;
    }
    return startEndDate;
  }
}
