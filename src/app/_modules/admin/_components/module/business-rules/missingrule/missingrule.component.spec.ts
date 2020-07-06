import { MissingruleComponent } from './missingrule.component';
import { of } from 'rxjs';
import { CoreSchemaBrInfo, BusinessRuleType } from '../business-rules.modal';
import { TestBed } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SchemaService } from '@services/home/schema.service';

class SchemaSerStub {
  createBusinessRule() {
    return ({});
  }

  getFillDataDropdownData() {
    return ({})
  }
}

describe('MissingruleComponent', () => {
  let component;
  let service;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule,
        ReactiveFormsModule , HttpClientTestingModule, FormsModule
      ],
      declarations: [MissingruleComponent],
      providers: [
        SchemaService
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    service = new SchemaSerStub();
    component = new MissingruleComponent(service, null, null, null);
  });

  it('testing convertObjtoString ', () => {
    component.groupDetailss = [{ id: 1 },{ id: 2}];
    const actualRes = component.convertObjtoString();
    expect(actualRes).toEqual('1,2');
  });

  it('checking remove()', () => {
    component.groupDetailss = ['1234']
    component.remove('1234');
    expect(component.groupDetailss.length).toEqual(0);
  })

  it('testing getDesciption - grid', () => {

    component.gridsData = {
      test: {
        test1: 'test'
      }
    }

    const data = {
      test: {
        test1: 'test'
      }
    }
    component.getDesciption(data, 'grid');
    expect(component.finalList.length).toEqual(1);
  })

  it('testing onSelect', () => {
    const dd = { fieldId: '123' }
    component.groupDetailss = [{ id: '123' }];
    component.onSelect(dd)
    expect(component.groupDetailss.length).toEqual(1);
  })

  it('testing fillDetailsData', () => {

    component.paramsData = {
      moduleId: '112'
    }
    const res = {
      headers: {
        TEST: { fieldId: 'qwrer', fieldDescri: 'Test Type', dataType: 'CHAR', maxChar: '10', mandatory: '0' }
      },
      gridsData:{
        LANGUAGE_GRID:{
          LANG:{
            fieldId: 'LANG', fieldDescri: 'language ', dataType: 'CHAR', maxChar: '10', mandatory: '0'
          }
        }
      }
    }
    spyOn(service, 'getFillDataDropdownData').and.callFake(() => {
      return of(res);
    })

    spyOn(component, 'splitObjKeyValuePair').and.callFake(() => {
      return '';
    })

    spyOn(component, 'getDesciption').and.callFake(() => {
      return '';
    })

    component.fillDetailsData();
    expect(component.gridsData).toEqual(undefined);
  })

  it('testing saveBrInfo ', () => {

    component.brInfo = new CoreSchemaBrInfo();
    spyOn(service, 'createBusinessRule').and.callFake(() => {
      return of(component.brInfo);
    })
    // spyOn(component, 'storeData').and.callFake(() => {
    //   return '';
    // })
    component.saveBrInfo();
    expect(service.createBusinessRule).toHaveBeenCalled();
  });



  it('testing returnBrtype', () => {
    component.brType = 'missingRule';
    const res = component.returnBrtype();
    expect(BusinessRuleType.BR_MANDATORY_FIELDS).toEqual(res);
  })

  it('testing returnBrtype', () => {
    component.brType = 'metaDataRule';
    const res = component.returnBrtype();
    expect(BusinessRuleType.BR_METADATA_RULE).toEqual(res);
  })
});
