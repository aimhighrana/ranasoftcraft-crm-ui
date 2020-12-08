import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { BusinessrulelibrarySidesheetComponent } from './businessrulelibrary-sidesheet.component';

describe('BusinessrulelibrarySidesheetComponent', () => {
  let component: BusinessrulelibrarySidesheetComponent;
  let fixture: ComponentFixture<BusinessrulelibrarySidesheetComponent>;
  let schemaService: SchemaService;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessrulelibrarySidesheetComponent],
      imports: [
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [SchemaService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessrulelibrarySidesheetComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectBusinessRule(), should select/ deselect business rules', async () => {
    component.selectedBusinessRule = [];
    const rule = {
      brId: '13454556',
      brIdStr: '134545566',
      brInfo: 'regex rule'
    } as CoreSchemaBrInfo;
    let action = component.constants.ADD;

    component.selectBusinessRule(rule, action);
    expect(component.selectedBusinessRule.length).toEqual(1);

    component.selectedBusinessRuleCopy = [
      {
        brId: '13454556',
        brIdStr: '134545566',
        brInfo: 'regex rule'
      },
      {
        brId: '13454552',
        brIdStr: '134545563',
        brInfo: 'regex rule-1'
      }
    ] as CoreSchemaBrInfo[];
    action = component.constants.REMOVE;
    component.selectBusinessRule(rule, action);

    expect(component.selectedBusinessRuleCopy.length).toEqual(1);
  })

  it('search(), should search for business rules', async() => {
    let searchTerm = 'Business rule - 1';
    component.businessRulesList = [
      {
        brId: '13454556',
        brIdStr: '134545566',
        brInfo: 'regex rule'
      },
      {
        brId: '13454552',
        brIdStr: '134545563',
        brInfo: 'missing rule'
      }
  ] as CoreSchemaBrInfo[];

  component.search(searchTerm);
  expect(component.filteredBusinessRulesList.length).toEqual(0);

  searchTerm = '';
  component.search(searchTerm);
  expect(component.filteredBusinessRulesList.length).toEqual(2);

  searchTerm = 'Reg';
  component.search(searchTerm);
  expect(component.filteredBusinessRulesList.length).toEqual(1);
  })

  it('isSelected(), should check selection of business rule', async() => {
    let rule = {
      brId: '2566241'
    } as CoreSchemaBrInfo;

    component.selectedBusinessRuleCopy = [
      {
        brId: '2566241'
      },
      {
        brId: '2566242'
      }
    ] as CoreSchemaBrInfo[];

    let res =  component.isSelected(rule);
    expect(res).toEqual(true);

    rule = {
      brId: '123654'
    } as CoreSchemaBrInfo

    res = component.isSelected(rule);
    expect(res).toEqual(false);
  })
  it('getBusinessRulesList', async() => {
      // call without module Id
      spyOn(schemaService, 'getAllBusinessRules').and.callFake(() => of([]));
      component.getBusinessRulesList(null, null, null, null);
      expect(schemaService.getAllBusinessRules).toHaveBeenCalled();
      // call with module Id
      spyOn(schemaService, 'getBusinessRulesByModuleId').and.callFake(() => of([]));
      component.getBusinessRulesList('testId', null, null, null);
      expect(schemaService.getBusinessRulesByModuleId).toHaveBeenCalled();
  });
});
