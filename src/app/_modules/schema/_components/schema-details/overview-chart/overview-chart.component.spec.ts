import { OverviewChartComponent } from './overview-chart.component';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaListDetails } from 'src/app/_models/schema/schemalist';


describe('OverviewChartComponent', () => {
  let component: OverviewChartComponent;
  let fixture: ComponentFixture<OverviewChartComponent>;
  let schemaListServiceSpy: SchemalistService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[AppMaterialModuleForSpec, RouterTestingModule, HttpClientModule],
      declarations: [ OverviewChartComponent ],
      providers: [ SchemalistService ]
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewChartComponent);
    component = fixture.componentInstance;
    schemaListServiceSpy = fixture.debugElement.injector.get(SchemalistService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngoninit(), should call ngoninit', async(() => {
    expect(component.ngOnInit).toBeTruthy();
    component.schemaId = '3264622345732';
    spyOn(schemaListServiceSpy,'getSchemaDetailsBySchemaId').withArgs(component.schemaId).and.returnValue(of(new SchemaListDetails()));
    component.ngOnInit();
    expect(schemaListServiceSpy.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);
  }));
});
