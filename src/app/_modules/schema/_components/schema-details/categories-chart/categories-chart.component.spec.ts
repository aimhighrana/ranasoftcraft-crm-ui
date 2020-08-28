import { CategoriesChartComponent } from './categories-chart.component';
import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientModule } from '@angular/common/http';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { SimpleChanges } from '@angular/core';
import { SchemaStaticThresholdRes } from '@models/schema/schemalist';
import { CategoryInfo } from '@models/schema/schemadetailstable';


describe('CategoriesChartComponent', () => {
  let component: CategoriesChartComponent;
  let fixture: ComponentFixture<CategoriesChartComponent>;
  let schemaDetailsServiceSpy: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppMaterialModuleForSpec],
      declarations: [ CategoriesChartComponent ],
      providers: [ SchemaDetailsService, SchemalistService ]
    })
    .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesChartComponent);
    component = fixture.componentInstance;
    schemaDetailsServiceSpy = fixture.debugElement.injector.get(SchemaDetailsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('ngOnInit() required pre load', async(() => {
    const res = [{categoryId:'8765', categoryDesc:'TEST'} as CategoryInfo];
    const data = ['test'];
    spyOn(schemaDetailsServiceSpy,'getAllCategoryInfo').and.returnValue(of(res));
    spyOn(schemaDetailsServiceSpy,'getSchemaStatus').and.returnValue(of(data));
    component.ngOnInit();
    expect(schemaDetailsServiceSpy.getAllCategoryInfo).toHaveBeenCalled();
    expect(schemaDetailsServiceSpy.getSchemaStatus).toHaveBeenCalled();
  }));
});
