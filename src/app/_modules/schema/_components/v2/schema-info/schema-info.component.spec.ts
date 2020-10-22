import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaInfoComponent } from './schema-info.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { Router } from '@angular/router';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaStaticThresholdRes } from '@models/schema/schemalist';

describe('SchemaInfoComponent', () => {
  let component: SchemaInfoComponent;
  let fixture: ComponentFixture<SchemaInfoComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaInfoComponent, FilterValuesComponent, AddFilterMenuComponent ],
      imports:[
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule
      ]
    })
    .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shortName(), should return initals', ()=> {
    let fName = 'Ashish';
    let lName = 'Goyal';
    let initials = component.shortName(fName, lName);
    expect(initials).toEqual('AG');

    fName = 'Ashish';
    lName = '';
    initials = component.shortName(fName, lName);
    expect(initials).toEqual('');
  })

  it('addSubscriber(), should open the subscriber side sheet', async() => {
    component.moduleId = '1005';
    component.schemaId = '5642587452';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.addSubscriber();

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/subscriber/${component.moduleId}/${component.schemaId}/new` } }])
  })

  it('addBusinessRule(), should open the subscriber side sheet', async() => {
    component.moduleId = '1005';
    component.schemaId = '5642587452';
    fixture.detectChanges();
    spyOn(router, 'navigate');
    component.addBusinessRule();

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/business-rule/${component.moduleId}/${component.schemaId}/new` } }])
  })

  it('updateFragment(), should update tab selection', async() => {
    component.moduleId = '1005';
    component.schemaId = '5642785215';
    let tabLabel = 'business-rules';
    fixture.detectChanges();

    spyOn(router, 'navigate');
    component.updateFragment(tabLabel);
    expect(router.navigate).toHaveBeenCalledWith(['/home/schema/schema-info', component.moduleId, component.schemaId], { queryParams: { fragment: tabLabel } })
    expect(component.selectedIndex).toEqual(1);

    tabLabel = 'subscribers';
    component.updateFragment(tabLabel);
    expect(component.selectedIndex).toEqual(2);

    tabLabel = 'execution-logs';
    component.updateFragment(tabLabel);
    expect(component.selectedIndex).toEqual(3)
  })

  it('editBr(), should open side sheet of business rules', async() => {
    component.moduleId = '1005';
    component.schemaId = '2563145';

    const br = {
      brIdStr: '2356'
    } as CoreSchemaBrInfo
    spyOn(router, 'navigate');
    component.editBr(br);

    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: `sb/schema/business-rule/${component.moduleId}/${component.schemaId}/${br.brIdStr}` } }])
  })

  it('getPercentageStatics(), should return statics', async() => {
    const statics = {
      threshold: 0,
      errorCnt: 0,
      totalCnt: 0,
      successCnt: 0
    } as SchemaStaticThresholdRes
    component.getPercentageStatics(statics);
    expect(component.thresholdValue).toEqual(0);
  })
});
