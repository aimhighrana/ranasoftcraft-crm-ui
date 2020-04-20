import { CreateSchemaComponent } from './create-schema.component';
import { of } from 'rxjs';

class ServiceStub {
  getAllBusinessRules() {
    return ({})
  }

  getAllCategoriesList() {
    return ({})
  }
}

class SchemaListSerStub {
  getSchemaDetailsBySchemaId() {
    return ({});
  }
}

describe('CreateSchemaComponent', () => {
  let component;
  let service;
  let schemaSer;

  beforeEach(() => {
    service = new ServiceStub();
    schemaSer = new SchemaListSerStub()
    component = new CreateSchemaComponent(service, null, null, schemaSer);
  });

  // it('testing  ngOnInit', () => {
  //   spyOn(component, 'getCategoriesData').and.callFake(() => {
  //     return '';
  //   })
  //   spyOn(component, 'getBusinessRulesData').and.callFake(() => {
  //     return '';
  //   })
  //   component.ngOnInit();
  // });

  it('testing showAddBusinessRulePage', () => {
    component.showAddBusinessRulePage();
  })

  // it('testing showParentPage - if', () => {
  //   component.schemaDetails = 'test'
  //   const res = [{ test: 'test' }]
  //   spyOn(component, 'getBusinessRulesData').and.callFake(() => {
  //     return of(res);
  //   })
  //   component.showParentPage()
  // })

  it('testing showParentPage - else', () => {
    spyOn(component, 'returnBrsList').and.callFake(() => {
      return '';
    })
    spyOn(component, 'handleNullCondition').and.callFake(() => {
      return '';
    })
    component.showParentPage()
  })

  it('testing addCategory', () => {
    component.addCategory();
  })

  it('testing getBusinessRulesData', () => {
    const res = {
      data: 'data'
    }
    component.schemaDetails = { schemaId: '11212' }
    spyOn(service, 'getAllBusinessRules').and.callFake(() => {
      return of(res);
    })
    spyOn(component, 'onloadShowCategories').and.callFake(() => {
      return '';
    })
    component.getBusinessRulesData()
  })

  it('testing getCategoriesData', () => {
    const res = {
      data: 'data'
    }
    spyOn(service, 'getAllCategoriesList').and.callFake(() => {
      return of(res);
    })
    component.getCategoriesData()
  })

  it('testing loopData', () => {

    const dd = {
      businessRules: [{
        categoryId: '123'
      }]
    }
    component.loopData(dd);
  })

  it('testing changeCategoryNameId', () => {

    const eve = {
      option: {
        value: 'test'
      }
    }

    component.categoriesNames = [{ categoryDesc: 'test' }]
    component.categoriesNamesList = [{
      categoryDesc: '',
      categoryId: ''
    }]

    spyOn(component, 'loopData').and.callFake(() => {
      return '';
    })

    component.changeCategoryNameId(eve, 0);
  })

  it('testing removeBrFromCategory', () => {

    component.categoriesNamesList = [{
      businessRules: [{
        test: 'qwe'
      },
      {
        test: '222'
      }]
    }]
    component.removeBrFromCategory(0, 1);
  })

  it('checking search()', () => {

    component.filterList = [{
      brInfo: 'test'
    }]
    component.search('test');
  })


  it('testing enableSaveButton', () => {
    component.schemaName = 'test';
    component.enableSaveButton();
  })

  it('testing getSchemaData', () => {

    component.params = {
      schemaId: '123'
    }
    component.schemaDetails = {
      schemaId: '12345',
      schemaDescription: 'test'
    }

    const res = {
      schemaId: '12345',
      schemaDescription: 'test'
    }

    spyOn(schemaSer, 'getSchemaDetailsBySchemaId').and.callFake(() => {
      return of(res);
    })

    spyOn(component, 'getBusinessRulesData').and.callFake(() => {
      return '';
    })
    spyOn(component, 'enableSaveButton').and.callFake(() => {
      return '';
    })
    component.getSchemaData();
  })

  it('checking editBusinessRuls', () => {

    component.editBusinessRuls('test');
  })

  it('checking deleteBusinessRule', () => {

    const ssData = [{ test: 'test' }, { test: 'test1' }]

    spyOn(component, 'returnBrsList').and.callFake(() => {
      return ssData;
    })
    spyOn(component, 'handleNullCondition').and.callFake(() => {
      return '';
    })
    component.deleteBusinessRule([], 1);
  })

  it('checking onloadShowCategories', () => {

    const obj = [{
      categoryId: '123'
    }]
    component.categoriesNames = [{
      categoryId: '123',
      businessRules: []
    }]
    component.onloadShowCategories(obj);
  })

  // it('checking updateBrCategoryId', () => {

  //   component.categoriesNamesList = [
  //     {
  //       businessRules: [{
  //         categoryId: '123'
  //       }]
  //     }]
  //   component.businessRuleNames = [{
  //     categoryId: '123'
  //   }]
  //   component.updateBrCategoryId();
  // })
});
