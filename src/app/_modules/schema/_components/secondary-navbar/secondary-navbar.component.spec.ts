import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryNavbarComponent } from './secondary-navbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SchemaListDetails, SchemaListModuleList } from '@models/schema/schemalist';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { ReportService } from '@modules/report/_service/report.service';
import { ReportList } from '@modules/report/report-list/report-list.component';

describe('SecondaryNavbarComponent', () => {
  let component: SecondaryNavbarComponent;
  let fixture: ComponentFixture<SecondaryNavbarComponent>;
  let schemaServiceSpy: SchemaService;
  let schemaListService: SchemalistService;
  let reportService: ReportService;
  let router: Router;
  const reportList: ReportList[] = [
    {
      reportId: '10023',
      reportName: 'TimeSeries Report'
    } as ReportList
  ]
  const moduleList = [
    {
      moduleId: '1005',
      moduleDesc: 'Material'
    } as SchemaListModuleList
  ]
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryNavbarComponent, SearchInputComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryNavbarComponent);
    component = fixture.componentInstance;
    schemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    reportService = fixture.debugElement.injector.get(ReportService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnchanges(), should call ngOnChanges', async() => {
    let changes = {
      activatedPrimaryNav: {
        currentValue: 'welcome',
        previousValue: 'schema',
        firstChange: true,
      } as SimpleChange
    } as SimpleChanges
    spyOn(schemaListService, 'getSchemaList').and.returnValue(of(moduleList));
    component.ngOnChanges(changes);
    expect(schemaListService.getSchemaList).toHaveBeenCalled();

    changes = {
      activatedPrimaryNav: {
        currentValue: 'schema',
        previousValue: 'welcome',
        firstChange: true,
      } as SimpleChange
    } as SimpleChanges
    component.ngOnChanges(changes);
    expect(schemaListService.getSchemaList).toHaveBeenCalled();

    changes = {
      activatedPrimaryNav: {
        currentValue: 'report',
        previousValue: 'schema',
        firstChange: true,
      } as SimpleChange
    } as SimpleChanges

    spyOn(reportService, 'reportList').and.returnValue(of(reportList));
    component.ngOnChanges(changes);
    expect(reportService.reportList).toHaveBeenCalled();

  })

  it('getDataIntilligence() should return schema with varients', async(() => {
    spyOn(schemaServiceSpy, 'getSchemaWithVariants').and.returnValue(of({} as SchemaListDetails[]));
    component.getDataIntilligence();

    expect(schemaServiceSpy.getSchemaWithVariants).toHaveBeenCalled();
  }))

  it('globalCreate(), should navigate according active primary nav to the report', async() => {
    component.activatedPrimaryNav = 'report';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.globalCreate();

    expect(router.navigate).toHaveBeenCalledWith(['home/report/dashboard-builder/new'])
  })

  it('globalCreate(), should navigate according to active primary nav to schema', async() => {
    component.activatedPrimaryNav = 'schema';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.globalCreate();

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: 'sb/schema/create-schema/new' } }])
  })

  it('toggleSideBar(), should toggle the icon of secondary nav', () => {
    const hidePrimary = false;
    component.arrowIcon = 'keyboard_arrow_left';
    component.toggleSideBar(hidePrimary);

    expect(component.arrowIcon).toEqual('keyboard_arrow_right');

    component.arrowIcon = 'keyboard_arrow_right';
    component.toggleSideBar(hidePrimary);

    expect(component.arrowIcon).toEqual('keyboard_arrow_left');
  })

  it('getRoutedDescription(), should get route desc', async() => {
    component.activatedPrimaryNav = 'welcome';
    expect(component.getRoutedDescription).toEqual('Home');

    component.activatedPrimaryNav = 'schema';
    expect(component.getRoutedDescription).toEqual('Schema');

    component.activatedPrimaryNav = 'report';
    expect(component.getRoutedDescription).toEqual('Report');
  });


  it('searchSchema(), global search  ', async(()=>{
    component.activatedPrimaryNav = 'report';
    component.reportList = [{
      permission:null,
      reportId:'25745218',
      reportName:'Test',
      widgets:null
    }];

    component.searchSchema('t');
    component.reportOb.subscribe(res=>{
      expect(res.length).toEqual(1);
    });
  }));

  it('checkDescOnReload(), should check Desc of secondary nav on page reload', async()=>{
    let url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/dash/welcome';
    component.checkDescOnReload(url);
    expect(component.activatedPrimaryNav).toEqual('welcome');

    url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/report/dashboard/914055233326997382';
    component.checkDescOnReload(url);
    expect(component.activatedPrimaryNav).toEqual('report');

    url = 'https://beta.mdoondemand.com/MDOSF/fuze/ngx-mdo/index.html#/home/schema/1005';
    component.checkDescOnReload(url);
    expect(component.activatedPrimaryNav).toEqual('schema');
  })

  it('getSchemaList(), should get all schema list', async() => {
    spyOn(schemaListService, 'getSchemaList').and.returnValue(of(moduleList));
    spyOn(router, 'navigate');
    component.activatedPrimaryNav = 'schema';
    component.isPageReload = false;
    component.getSchemaList();
    expect(schemaListService.getSchemaList).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema', '1005'])
  })

  it('getReportList(), should get all reports', async() => {
    spyOn(reportService, 'reportList').and.returnValue(of(reportList));
    spyOn(router, 'navigate');

    component.isPageReload = false;
    component.getreportList();
    expect(reportService.reportList).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['home/report/dashboard', '10023'])
  })

  it('searchForVarient(), should search for varient', async() => {
    const schema: SchemaListDetails =
      {
        schemaId: '1234545',
        schemaDescription: 'Material',
        variants: [
          {
            variantId: '123A',
            variantName: 'USA varient'
          },
          {
            variantId: 'UK',
            variantName: 'UK variant'
          }
        ]
      } as SchemaListDetails
    const searchString = 'USA';
    const result = component.searchForVarient(schema, searchString);
    expect(result).toEqual(true);
  })

  it('searchForSchema(), should search for schema', () => {
    const module = {
      moduleId: '123654',
      moduleDesc: 'Module1',
      schemaLists: [
        {
          schemaId: '1005',
          schemaDescription: 'CustomerDIw'
        }
      ]
    } as SchemaListModuleList

    let searchString = 'diw';
    let filteredSchemas = component.searchForSchema(module, searchString);

    expect(filteredSchemas.length).toEqual(1);

    searchString = 'Ashish';
    filteredSchemas = component.searchForSchema(module, searchString);

    expect(filteredSchemas.length).toEqual(0);
  })
});
