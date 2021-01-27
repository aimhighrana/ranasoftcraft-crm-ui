import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemaExecutionLog } from '@models/schema/schemadetailstable';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaExecutionTrendComponent } from './schema-execution-trend.component';

describe('SchemaExecutionTrendComponent', () => {
  let component: SchemaExecutionTrendComponent;
  let fixture: ComponentFixture<SchemaExecutionTrendComponent>;
  let data: SchemaExecutionLog[];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaExecutionTrendComponent ],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaExecutionTrendComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();

    data = [
      { id: '01/12', exeStrtDate: 1606810085000, total: 5, totalSuccess: 3, totalError: 2 },
      { id: '06/12', exeStrtDate: 1607242085000, total: 10, totalSuccess: 7, totalError: 3 },
      { id: '08/12', exeStrtDate: 1607414885000, total: 15, totalSuccess: 10, totalError: 5 },
      { id: '14/12', exeStrtDate: 1607933285000, total: 20, totalSuccess: 10, totalError: 10 },
      { id: '17/12', exeStrtDate: 1608192485000, total: 25, totalSuccess: 15, totalError: 10 },
      { id: '01/01', exeStrtDate: 1609488485000, total: 30, totalSuccess: 15, totalError: 15 }
    ] as SchemaExecutionLog[];

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should group executions by month weeks', () => {

    const result = component.groupByMonthWeeks(11, data);
    expect(result.length).toEqual(3);
    expect(result[0].weekOfMonth).toEqual(1);
    expect(result[0].weekStartDate).toEqual('Nov 30, 2020');
    expect(result[0].weekEndDate).toEqual('Dec 6, 2020');
    expect(result[0].executions.length).toEqual(2);

  });

  it('should prepare chart dataset', () => {

    const weeksData = component.groupByMonthWeeks(11, data);
    spyOn(component, 'groupByMonthWeeks').and.returnValue(weeksData);

    component.prepareDataSet(data);
    expect(component.dataSet[0].data.length).toEqual(3);

    // first week error records
    expect(component.dataSet[0].data[0]).toEqual(2.5);

    // first week success records
    expect(component.dataSet[1].data[0]).toEqual(5);


  });

});
