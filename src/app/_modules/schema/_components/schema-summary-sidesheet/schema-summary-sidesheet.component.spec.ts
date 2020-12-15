import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PermissionOn, SchemaDashboardPermission } from '@models/collaborator';
import { AddFilterOutput } from '@models/schema/schema';
import { FilterCriteria } from '@models/schema/schemadetailstable';
import { SchemaListDetails, VariantDetails } from '@models/schema/schemalist';
import { CoreSchemaBrInfo, DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { SchemaVariantService } from '@services/home/schema/schema-variant.service';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SchemaSummarySidesheetComponent } from './schema-summary-sidesheet.component';

describe('SchemaSummarySidesheetComponent', () => {
  let component: SchemaSummarySidesheetComponent;
  let fixture: ComponentFixture<SchemaSummarySidesheetComponent>;
  let schemaVariantService: SchemaVariantService;
  let schemaService: SchemaService;
  let schemaDetailsService: SchemaDetailsService;
  let schemaListService: SchemalistService;
  let router: Router;

  // component.moduleId = '1005';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaSummarySidesheetComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaSummarySidesheetComponent);
    component = fixture.componentInstance;
    schemaVariantService = fixture.debugElement.injector.get(SchemaVariantService);
    schemaService = fixture.debugElement.injector.get(SchemaService);
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    schemaListService = fixture.debugElement.injector.get(SchemalistService);
    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getSchemaVariants(), should return all variants of a schema', async () => {
    component.schemaId = '1005'
    spyOn(schemaVariantService, 'getAllDataScopeList').withArgs(component.schemaId, 'RUNFOR').and.returnValue(of({} as VariantDetails[]))
    component.getSchemaVariants(component.schemaId, 'RUNFOR');
    expect(schemaVariantService.getAllDataScopeList).toHaveBeenCalledWith(component.schemaId, 'RUNFOR');
  })

  it('getBusinessRuleList(), should get business rule list of schema', async () => {
    spyOn(schemaService, 'getBusinessRulesBySchemaId').withArgs(component.schemaId).and.returnValue(of({} as CoreSchemaBrInfo[]));
    component.getBusinessRuleList(component.schemaId);
    expect(schemaService.getBusinessRulesBySchemaId).toHaveBeenCalledWith(component.schemaId);
  })

  it('shortName(), should return initials of subscriber', () => {
    let fName = 'Ashish';
    let lName = 'Goyal';
    let result = component.shortName(fName, lName);
    expect(result).toEqual('AG');

    fName = 'Ashish';
    lName = '';
    result = component.shortName(fName, lName);
    expect(result).toEqual('')
  })

  it('prepateTextToShow(), should prepare text to show over mat-chips', async () => {
    const ctrl: FilterCriteria = {
      fieldId: 'MaterialType',
      values: ['123', '456'],
      type: 'DROPDOWN',
      filterCtrl: {
        selectedValues: [
          {
            CODE: 'ABC',
            FIELDNAME: 'MaterialType'
          } as DropDownValue
        ]
      } as AddFilterOutput
    }
    const result = component.prepareTextToShow(ctrl);
    expect(result).toEqual(2);
  })

  it('loadDropValues(), should load dropdown values of selected filters', async() => {
    const fldc: FilterCriteria = {
      fieldId: 'MaterialType',
      values: ['123', '456'],
      type: 'DROPDOWN',
      filterCtrl: {
        selectedValues: [
          {
            CODE: 'ABC',
            FIELDNAME: 'MaterialType'
          } as DropDownValue
        ]
      } as AddFilterOutput
    }
    component.loadDropValues(fldc);
    expect(component.loadDopValuesFor.checkedValue.length).toEqual(2);
  })

  it('close(), should close the summary side sheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{outlets: {sb: null}}]);
  });

  it('openBusinessRuleSideSheet(), should open business rule side sheet', () => {
    component.moduleId = '1004';
    component.schemaId = '15125412';
    component.outlet = 'outer';

    spyOn(router, 'navigate');
    component.openBusinessRuleSideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', {outlets : {outer: `outer/schema/businessrule-library/${component.moduleId}/${component.schemaId}/${component.outlet}`}}])
  });

  it('openSubscriberSideSheet(), should open subscriber side sheet', () => {
    component.schemaId = '15125412';
    component.outlet = 'outer';
    component.moduleId = '1005';
    spyOn(router, 'navigate');
    component.openSubscriberSideSheet();
    expect(router.navigate).toHaveBeenCalledWith(['', {outlets: {outer: `outer/schema/subscriber/${component.moduleId}/${component.schemaId}/new/${component.outlet}`}}])
  })

  it('getAllBusinessRulesList(), should get all business rules', async() => {
    spyOn(schemaService, 'getBusinessRulesByModuleId').and.returnValue(of({} as CoreSchemaBrInfo[]));
    component.moduleId = '1005';
    component.getAllBusinessRulesList(component.moduleId, '', '', '0');
    expect(schemaService.getBusinessRulesByModuleId).toHaveBeenCalled();
  })

  it('getCollaborators(), should get all subscribers', async() => {
    spyOn(schemaDetailsService, 'getAllUserDetails').and.returnValue(of({} as PermissionOn));
    component.getCollaborators('', 0);
    expect(schemaDetailsService.getAllUserDetails).toHaveBeenCalled();
  })

  it('addBusinessRule(), should add business rule', () => {
    component.businessRuleData = [];
    const brInfo = {
      brType: 'Meta data',
      brIdStr: '12254'
    } as CoreSchemaBrInfo;
    component.addBusinessRule(brInfo);
    expect(component.businessRuleData.length).toEqual(1);
  })

  it('addSubscriber(), should add subscriber', async() => {
    component.subscriberData = [];
    const subscriber = {
      userMdoModel: {
        fullName: 'Ashish Goyal',
        email: 'ashish.goyal@prospecta.com'
      }
    } as SchemaDashboardPermission;
    component.addSubscriber(subscriber);
    expect(component.subscriberData.length).toEqual(1);
  });

  it('availableWeightage(), should return max avail weightage', async() => {
    const weightage = '46';
    component.businessRuleData = [
      {
        brWeightage: '46'
      },
      {
        brWeightage: '33'
      }
    ] as CoreSchemaBrInfo[];
    const result = component.availableWeightage(weightage);
    expect(result).toEqual(67);
  })

  it('getSchemaDetails(), should get schema details', async() => {
    component.schemaId = '12545';
    spyOn(schemaListService, 'getSchemaDetailsBySchemaId').withArgs(component.schemaId).and.returnValue(of({} as SchemaListDetails))
    component.getSchemaDetails(component.schemaId);
    expect(schemaListService.getSchemaDetailsBySchemaId).toHaveBeenCalledWith(component.schemaId);
  })
});
