import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryNavbarComponent } from './secondary-navbar.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { SchemaListDetails } from '@models/schema/schemalist';

describe('SecondaryNavbarComponent', () => {
  let component: SecondaryNavbarComponent;
  let fixture: ComponentFixture<SecondaryNavbarComponent>;
  let schemaServiceSpy: SchemaService;
  let router: Router;

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

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

});
