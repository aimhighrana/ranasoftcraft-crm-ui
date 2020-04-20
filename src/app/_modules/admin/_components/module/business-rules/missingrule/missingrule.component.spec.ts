import { MissingruleComponent } from './missingrule.component';
import { of } from 'rxjs';

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
    service = new SchemaSerStub();
    component = new MissingruleComponent(service, null, null, null);
  });

  it('testing callParentPage ', () => {
    component.callParentPage();
  });

  it('testing convertObjtoString ', () => {
    component.groupDetailss = [{ id: 1 }];
    component.convertObjtoString();
  });

  it('checking remove()', () => {
    component.groupDetailss = ['1234']
    component.remove('1234');
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
  })

  it('testing getDesciption - hierarchy', () => {

    component.hierarchyData = [{ heirarchyId: '1234' }]

    const data = {
      test: {
        test1: 'test'
      }
    }
    component.getDesciption(data, 'hierarchy');
  })

  it('testing onSelect', () => {
    const dd = { fieldId: '123' }
    component.groupDetailss = [{ id: '123' }];
    spyOn(component, 'enableFinishBtn').and.returnValue('')
    component.onSelect(dd)
  })

  it('testing fillDetailsData', () => {

    component.paramsData = {
      moduleId: '112'
    }
    const res = {
      headers: {
        TEST: { fieldId: 'qwrer', fieldDescri: 'Test Type', dataType: 'CHAR', maxChar: '10', mandatory: '0' }
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
  })

  it('testing saveBrInfo ', () => {

    const res = 1234567;
    spyOn(service, 'createBusinessRule').and.callFake(() => {
      return of(res);
    })
    spyOn(component, 'storeData').and.callFake(() => {
      return '';
    })
    spyOn(component, 'callParentPage').and.callFake(() => {
      return '';
    })
    component.saveBrInfo();
  });

  it('testing enableFinishBtn', () => {
    component.description = 'test';
    component.groupDetailss = [{ test: 'test' }]
    component.enableFinishBtn();
  })

  it('testing splitObjKeyValuePair - true', () => {

    const res = {
      headers: {
        TEST: { fieldId: 'qwrer', fieldDescri: 'Test Type', dataType: 'CHAR', maxChar: '10', mandatory: '0' }
      }
    }
    component.splitObjKeyValuePair(res, true);
  })

  it('testing splitObjKeyValuePair - false', () => {

    const res = {
      headers: {
        TEST: { fieldId: 'qwrer', fieldDescri: 'Test Type', dataType: 'CHAR', maxChar: '10', mandatory: '0' }
      }
    }
    component.splitObjKeyValuePair(res, false);
  })

  it('testing returnBrtype', () => {
    component.brType = 'missingRule';
    component.returnBrtype();
  })

  it('testing returnBrtype', () => {
    component.brType = 'metaDataRule';
    component.returnBrtype();
  })
});
