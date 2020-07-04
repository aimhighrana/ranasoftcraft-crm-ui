import { TestBed } from '@angular/core/testing';

import { Any2tsService } from './any2ts.service';

describe('Any2tsService', () => {
  let service: Any2tsService;

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = new Any2tsService();
  });

  it('should be created', () => {
    service = TestBed.inject(Any2tsService);
    expect(service).toBeTruthy();
  });

  it('anyToSchemaListOnLoadResponse() should return', () => {
    const testData = {
      connection: 'test',
      isDataInsight: 'test',
      moduleList: 'test',
      moduleOrdr: 'test',
      plantCode: 'test',
      roleId: 'test',
      userId: 'test'
    }
    expect(service.anyToSchemaListOnLoadResponse(testData)).not.toBe(null)
  });

  it('any2CategoriesList() should return value', () => {
    const testData = [{
      categoryId: 'test',
      categoryDesc: 'test',
      plantCode: 'test',
    }]
    expect(service.any2CategoriesList(testData)).not.toBe(null)
  })

  it('any2SchemaDataTableResponse() should return value', () => {
    const testData = {
      fieldList: [{
        dataType: 'test',
        editable: 'test',
        hidden: 'test',
        index: 'test',
        label: 'test',
        name: 'test',
        picklist: 'test',
        width: 'test',
      }]
    }
    expect(service.any2SchemaDataTableResponse(testData)).not.toBe(null)
  })

  it('any2VariantFieldList() should return value', () => {
    const testData = [{
      fieldId: 'test',
      dataType: 'test',
      shortText: 'test',
    }]
    expect(service.any2VariantFieldList(testData)).not.toBe(null)
  })

  it('any2SchemaBrInfoList() should return value', () => {
    const testData = {
      selectedBrData: [],
      unselectedBrData: []
    }
    expect(service.any2SchemaBrInfoList(testData)).not.toBe(null)
  });

  it('any2UserDetails() should return value', () => {
    const testData = {
      userName: 'avm',
      firstName: 'apoorv',
      lastName: 'mittal',
      email: 'apoorv.mittal@prospecta.com',
      plantCode: '001',
      currentRoleId: '01',
      dateformat: '19 may 2020',
      fullName: 'apoorv',
      assignedRoles: []
    }
    expect(service.any2UserDetails(testData)).not.toBe(null)
  });


  it('any2SchemaGroupCountResposne() should return value', () => {
    const testData = {
      total: '15',
      error: '2',
      duplicate: '4',
      success: '6',
      skipped: '1',
      outdated: '5',
    }
    expect(service.any2SchemaGroupCountResposne(testData)).not.toBe(null)
  });

  it('any2ObjectType() should return value', () => {
    const testData = [{
      objectDecsription: '',
      objectId: '',
    }]
    expect(service.any2ObjectType(testData)).not.toBe(null)
  });

  it('any2GetAllSchemabymoduleidsResponse() should return value', () => {
    const testData = [{
      discription: '',
      moduleId: '',
      schemaId: '',
    }]
    expect(service.any2GetAllSchemabymoduleidsResponse(testData)).not.toBe(null)
  });


  it('any2SchemaGroupWithAssignSchemasResponse() should return value', () => {
    const testData = {
      groupId: '',
      groupName: '',
      objectIds: '',
      schemaGroupMappings: [],
    }
    expect(service.any2SchemaGroupWithAssignSchemasResponse(testData)).not.toBe(null)
  });

  it('any2SchemaListView() should return value', () => {
    const testData = [{
      groupId: '',
      groupName: '',
      objectIds: '',
      schemaGroupMappings: [],
    }]
    expect(service.any2SchemaListView(testData)).not.toBe(null)
  });

  it('any2SchemaDetailsWithCount() should return value', () => {
    const testData = [{
      createdBy: '',
      errorValue: '',
      errorPercentage: '',
      schemaDescription: '',
      schemaId: '',
      successValue: '',
      successPercentage: '',
      totalValue: '',
      skippedValue: '',
      correctionValue: '',
      duplicateValue: '',
      variantCount: '',
      executionStartTime: '',
      executionEndTime: '',
      variantId: '',
      runId: '',
      isInRunning: '',
      brInformation: []
    }]
    expect(service.any2SchemaDetailsWithCount(testData)).not.toBe(null)
  });

  it('any2DataTable() should return value', () => {
    const testData = [{
      key: '',
      docCount: '',
      hits: [{
        hdvs: '',
        gvs: '',
        hyvs: '',
      }],
    }]
    const requestForSchemaDetailsWithBr = {
      schemaId: '',
      runId: '',
      brId: '',
      plantCode: '',
      variantId: '',
      requestStatus: '',
      executionStartDate: '',
      selectedFields: [],
      fetchSize: 1,
      fetchCount: 2,
      gridId: [],
      hierarchy: [],
    }
    expect(service.any2DataTable(testData, requestForSchemaDetailsWithBr)).not.toBe(null)
  })

  it('any2SchemaTableData() should return value', () => {
    const testData = [{
      id: '',
      hdvs: [],
      gvs: [],
      hyvs: [],
      stat: [],
      _score:''
    }]
    const request = {
      schemaId: '',
      runId: '',
      brId: '',
      plantCode: '',
      variantId: '',
      requestStatus: '',
      executionStartDate: '',
      selectedFields: [],
      gridId: [],
      hierarchy: [],
      fetchSize: 1,
      fetchCount: 1,
    }
    expect(service.any2SchemaTableData(testData, request)).not.toBe(null)
  });

  it('any2CategoryInfo() should return value', () => {
    const samepleData = [{
      categoryDesc: 'test',
      categoryId: '1'
    }]
    expect(service.any2CategoryInfo(samepleData)).not.toBe(null);
  })

  it('any2SchemaStatus() should return value ', () => {
    expect(service.any2SchemaStatus(['test1', 'test2'])).not.toBe(null);
  });

  it('any2VaraintListView() should return value', () => {
    const sampleData = [{
      title: 'test',
      variantId: 'test',
      totalValue: 'test',
      errorValue: 'test',
      successValue: 'test',
      skippedValue: 'test',
      correctionValue: 'test',
      duplicateValue: 'test',
      successTrendValue: 'test',
      errorTrendValue: 'test',
      totalUniqueValue: 'test',
      successUniqueValue: 'test',
      errorUniqueValue: 'test',
      skippedUniqueValue: 'test',
      timestamp: 'test',
      isVariant: 'test',
      isInRunning: 'test'
    }];;
    expect(service.any2VaraintListView(sampleData)).not.toBe(null)
  });

  it('any2SchemaBrInfo() should return value', () => {
    const sampleData = [{
      brDescription: '',
      brId: '',
      brType: '',
      dynamicMessage: '',
      fields: '',
      refId: '',
      schemaId: '',
      schemaOrder: '',
    }];
    expect(service.any2SchemaBrInfo(sampleData)).not.toBe(null);
  });

  it('should call any2CategoriesResponse()', () => {
    const sampleData = {
      CATEGORIES: [{
        categoryDesc: '',
        categoryId: '',
        plantCode: '',
      }]
    }
    expect(service.any2CategoriesResponse(sampleData)).not.toBe(null);
  })
});
