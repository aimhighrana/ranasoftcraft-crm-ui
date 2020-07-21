import { CategoriesChartComponent } from './categories-chart.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientModule } from '@angular/common/http';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { SimpleChanges } from '@angular/core';
import { SchemaStaticThresholdRes } from '@models/schema/schemalist';


describe('CategoriesChartComponent', () => {
  let component: CategoriesChartComponent;
  let fixture: ComponentFixture<CategoriesChartComponent>;
  let schemaDetailsServiceSpy: jasmine.SpyObj<SchemaDetailsService>;


  beforeEach(async(() => {
    const schemaDetailsSerSpy = jasmine.createSpyObj('SchemaDetailsService',['getCategoryChartDetails', 'getAllCategoryInfo', 'getSchemaStatus']);
    const schemaListSerSpy = jasmine.createSpyObj('SchemalistService',['getSchemaDetailsBySchemaId']);
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppMaterialModuleForSpec],
      declarations: [ CategoriesChartComponent ],
      providers: [
        {provide: SchemaDetailsService, useValue: schemaDetailsSerSpy},
        {provide: SchemalistService, useValue: schemaListSerSpy}
      ]
    })
    .compileComponents();
    schemaDetailsServiceSpy = TestBed.inject(SchemaDetailsService) as jasmine.SpyObj<SchemaDetailsService>;

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesChartComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('categoryInfoList(), should call and return category list information', async(()=>{
    expect(schemaDetailsServiceSpy.getAllCategoryInfo.and.returnValue(of([]))).toHaveBeenCalledTimes(0);
  }));

  it('getSchemaStatus(), will return all schema status', async(()=>{
    expect(schemaDetailsServiceSpy.getSchemaStatus.and.returnValue(of([]))).toHaveBeenCalledTimes(0);
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
