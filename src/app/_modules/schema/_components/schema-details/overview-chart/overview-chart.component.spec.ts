import { OverviewChartComponent } from './overview-chart.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaStaticThresholdRes } from 'src/app/_models/schema/schemalist';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SimpleChanges } from '@angular/core';


describe('OverviewChartComponent', () => {
  let component: OverviewChartComponent;
  let fixture: ComponentFixture<OverviewChartComponent>;
  let schemaDetailsService: SchemaDetailsService

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[AppMaterialModuleForSpec, RouterTestingModule, HttpClientModule],
      declarations: [ OverviewChartComponent ],
      providers: [ SchemalistService, SchemaDetailsService ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewChartComponent);
    component = fixture.componentInstance;
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngoninit(), should call ngoninit', async(() => {
    expect(component.ngOnInit).toBeTruthy();
    component.schemaId = '3264622345732';
    spyOn(schemaDetailsService,'getOverviewChartDetails').withArgs(component.schemaId, component.variantId,undefined).and.returnValue(of({} as any));
    component.ngOnInit();
    expect(schemaDetailsService.getOverviewChartDetails).toHaveBeenCalledWith(component.schemaId, component.variantId,undefined);
  }));

  it('ngOnChanges(), detect value change while loaded data ', async(()=>{
    const changes: SimpleChanges = {thresholdRes:{
      currentValue: {errorCnt:9,totalCnt:10,successCnt:1} as SchemaStaticThresholdRes,
      firstChange: null,
      isFirstChange: null,
      previousValue:undefined
    }};

    component.ngOnChanges(changes);

    expect(component.thresholdRes.successCnt).toEqual(1);
    expect(component.thresholdRes.errorCnt).toEqual(9);
    expect(component.thresholdRes.totalCnt).toEqual(10);
  }));
});
