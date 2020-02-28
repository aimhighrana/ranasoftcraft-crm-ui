import { OverviewChartComponent } from './overview-chart.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemaDetailsService } from 'src/app/_services/home/schema/schema-details.service';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { OverViewChartDataSet } from 'src/app/_models/schema/schemadetailstable';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';


describe('OverviewChartComponent', () => {
  let component: OverviewChartComponent;
  let fixture: ComponentFixture<OverviewChartComponent>;
  let schemaDetailsServiceSpy: jasmine.SpyObj<SchemaDetailsService>;
  let schemaListServiceSpy: jasmine.SpyObj<SchemalistService>;

  beforeEach(async(() => {
    const schemaDetailsSerSpy = jasmine.createSpyObj('SchemaDetailsService',['getOverviewChartDetails']);
    const schemaListSerSpy = jasmine.createSpyObj('SchemalistService',['getSchemaDetailsBySchemaId']);
    TestBed.configureTestingModule({
      imports:[AppMaterialModuleForSpec, RouterTestingModule, HttpClientModule],
      declarations: [ OverviewChartComponent ],
      providers: [
        {provide: SchemaDetailsService, useValue: schemaDetailsSerSpy},
        {provide: SchemalistService, useValue: schemaListSerSpy}
      ]
    }).compileComponents();
    schemaDetailsServiceSpy = TestBed.inject(SchemaDetailsService) as jasmine.SpyObj<SchemaDetailsService>;
    schemaListServiceSpy = TestBed.inject(SchemalistService) as jasmine.SpyObj<SchemalistService>;

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewChartComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getOverViewChartdata(), should call for getting overview data',async(() =>{
     // mock data
    const schemaid = '3264622345732';
    const variantid = '0';
    const runId = '23423';
    schemaDetailsServiceSpy.getOverviewChartDetails.withArgs(schemaid, variantid, runId).and.returnValue(of(new OverViewChartDataSet()));
  }));

  it('getSchemaDetails(), should call for getting schema details',async(() =>{
    // mock data
    const schemaid = '3264622345732';
    schemaListServiceSpy.getSchemaDetailsBySchemaId.withArgs(schemaid).and.returnValue(of(new SchemaListDetails()));
  }));

});
