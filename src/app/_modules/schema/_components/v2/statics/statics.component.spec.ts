import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { SchemaVariantsModel } from '@models/schema/schemalist';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ExecutionResultComponent } from './execution-result/execution-result.component';
import { StaticsComponent } from './statics.component';
import * as moment from 'moment';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { of } from 'rxjs';
import { SchemaExecutionTrendComponent } from '@modules/shared/_components/statistics/schema-execution-trend/schema-execution-trend.component';

describe('StaticsComponent', () => {
  let component: StaticsComponent;
  let fixture: ComponentFixture<StaticsComponent>;
  let schemavariantService: SchemaVariantService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticsComponent, ExecutionResultComponent, SchemaExecutionTrendComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]

    })
    .compileComponents();
  }));

  beforeEach(() => {
    // jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    fixture = TestBed.createComponent(StaticsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    schemavariantService = fixture.debugElement.injector.get(SchemaVariantService);
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applyFilter(), apply filter ', async(()=>{

    // call actaul method
    component.applyFilter('unit','day');
    expect(component.statsFilterParams.unit).toEqual('day');

    component.applyFilter('date','today');
    expect(component.statsFilterParams._date_filter_type ).toEqual('today');

    component.applyFilter('date','this_week');
    expect(component.statsFilterParams._date_filter_type ).toEqual('this_week');

    component.applyFilter('date','this_month');
    expect(component.statsFilterParams._date_filter_type ).toEqual('this_month');

    component.applyFilter('data_scope',{variantId:'26462427'} as SchemaVariantsModel);
    expect(component.statsFilterParams._data_scope.variantId ).toEqual('26462427');


  }));

  it('changeSpecificDate(), change date picker ..', async(()=>{
    // mock data
    const evt  = {value:new Date()} as MatDatepickerInputEvent<Date>;

    component.changeSpecificDate(evt);
    expect(component.statsFilterParams.exe_start_date).toEqual(String(moment(new Date()).startOf('day').toDate().getTime()));
    expect(component.statsFilterParams.exe_end_date).toEqual(String(moment(new Date()).endOf('day').toDate().getTime()));
    expect(component.statsFilterParams._date_filter_type).toEqual('specific_date');
  }));

  it('changeDateRange(), change date range ', async(()=>{

    // mock data
    const evt  = {value:new Date()} as MatDatepickerInputEvent<Date>;
    component.changeDateRange('start', evt);
    expect(component.statsFilterParams.exe_start_date).toEqual(String(moment(new Date()).startOf('day').toDate().getTime()));

    component.changeDateRange('end', evt);
    expect(component.statsFilterParams.exe_end_date).toEqual(String(moment(new Date()).endOf('day').toDate().getTime()));

    expect(component.statsFilterParams._date_filter_type).toEqual('date_range');
  }));

  it('getDataScope(), get data scope ..', async(()=>{

    spyOn(schemavariantService,'getDataScope').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of([]));

    component.getDataScope();

    expect(schemavariantService.getDataScope).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  }));

  it('_momentDate(), get moment date ', async(()=>{
    const toDateRes =  component._momentDate('today');
    expect(toDateRes[0]).toEqual(moment().startOf('day').toDate().getTime());
    expect(toDateRes[1]).toEqual(moment().endOf('day').toDate().getTime());

    const week =  component._momentDate('this_week');
    expect(week[0]).toEqual(moment().startOf('week').toDate().getTime());
    expect(week[1]).toEqual(moment().endOf('day').toDate().getTime());

    const month =  component._momentDate('this_month');
    expect(month[0]).toEqual(moment().startOf('month').toDate().getTime());
    expect(month[1]).toEqual(moment().endOf('day').toDate().getTime());
  }));

  it('selectedDateFilter(), Selected date filter .. text over chips ..', async(()=>{
    component.ngOnInit();
    expect(component.selectedDateFilter).toEqual('This month');
  }));

  it('selectedUnit(), Get units terms to readable format ..', async(()=>{
    component.ngOnInit();
    expect(component.selectedUnit).toEqual('Daily');
  }));
});
