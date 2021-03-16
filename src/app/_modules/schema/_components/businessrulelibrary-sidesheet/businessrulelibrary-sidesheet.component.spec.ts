import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CoreSchemaBrInfo } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { SharedModule } from '@modules/shared/shared.module';
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
        RouterTestingModule,
        SharedModule
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

    component.selectedBusinessRule = [
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

    expect(component.selectedBusinessRule.length).toEqual(1);
  })

  it('isSelected(), should check selection of business rule', async() => {
    let rule = {
      brId: '2566241'
    } as CoreSchemaBrInfo;

    component.selectedBusinessRule = [
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

  it('getBusinessRulesList(), Should get business rules list according to module Id', async() => {
      // call with module Id
      spyOn(schemaService, 'getBusinessRulesByModuleId').and.callFake(() => of([]));
      component.getBusinessRulesList('testId', null, null, null);
      expect(schemaService.getBusinessRulesByModuleId).toHaveBeenCalled();
  });

  it('getBusinessRulesBySchemaId(), get rules by schema id', async(()=>{
    // mock object
    spyOn(schemaService,'getBusinessRulesBySchemaId').withArgs(component.schemaId).and.returnValue(of([{brIdStr:'732523'} as CoreSchemaBrInfo]));

    component.getBusinessRulesBySchemaId(component.schemaId);
    expect(schemaService.getBusinessRulesBySchemaId).toHaveBeenCalledWith(component.schemaId);
    expect(component.schemaBusinessRulesList .length).toEqual(1);
  }));

  it('ngOnInit(), check prerequired stuff ', async(()=>{

    spyOn(schemaService,'getBusinessRulesBySchemaId').withArgs(component.schemaId).and.returnValue(of([{brIdStr:'732523'} as CoreSchemaBrInfo]));

    spyOn(schemaService, 'getBusinessRulesByModuleId').and.callFake(() => of([]));

    component.ngOnInit();

    expect(schemaService.getBusinessRulesBySchemaId).toHaveBeenCalledWith(component.schemaId);
    expect(schemaService.getBusinessRulesByModuleId).toHaveBeenCalled();
  }));
});
