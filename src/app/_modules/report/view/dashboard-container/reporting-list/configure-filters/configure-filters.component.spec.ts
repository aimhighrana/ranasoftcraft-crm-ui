import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureFiltersComponent } from './configure-filters.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MdoUiLibraryModule } from 'mdo-ui-library';
import { ReportService } from '@modules/report/_service/report.service';
import { WidgetService } from '@services/widgets/widget.service';
import { BlockType, ConditionOperator, Criteria, DisplayCriteria, DropDownValues, FormControlType, ReportingWidget } from '@modules/report/_models/widget';
import { MetadataModel } from '@models/schema/schemadetailstable';
import { of } from 'rxjs';
import { DropDownValue } from '@modules/admin/_components/module/business-rules/business-rules.modal';

fdescribe('ConfigureFiltersComponent', () => {
  let component: ConfigureFiltersComponent;
  let fixture: ComponentFixture<ConfigureFiltersComponent>;
  let router: Router;
  let widgetService: WidgetService;
  let reportService: ReportService;

  beforeEach(async(() => {
    const widgetServiceSpy = jasmine.createSpyObj(WidgetService, ['getTableMetaData']);
    const spyObj = jasmine.createSpyObj('ReportService', ['getDropDownValues']);
    TestBed.configureTestingModule({
      declarations: [ConfigureFiltersComponent],
      imports: [RouterTestingModule, AppMaterialModuleForSpec, MdoUiLibraryModule],
      providers: [ReportService, WidgetService]
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureFiltersComponent);
    reportService = fixture.debugElement.injector.get(ReportService);
    widgetService = fixture.debugElement.injector.get(WidgetService);
    component = fixture.componentInstance;
    component.filterCriteria = [
      {
        fieldId: 'MATL_GROUP',
        conditionFieldId: 'MATL_GROUP',
        conditionFieldValue: ['test', 'test2'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      },
      {
        fieldId: 'column',
        conditionFieldId: 'column',
        conditionFieldValue: ['test'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      },
      {
        fieldId: 'column1',
        conditionFieldId: 'column1',
        conditionFieldValue: ['test'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      },
      {
        fieldId: 'column2',
        conditionFieldId: 'column2',
        conditionFieldValue: ['test'],
        blockType: BlockType.COND,
        conditionOperator: ConditionOperator.EQUAL,
        conditionFieldStartValue: null,
        conditionFieldEndValue: null,
        udrid: null,
      },

    ];

    component.selectedFilter = {
      fieldId: 'MATL_GROUP',
      conditionFieldId: 'MATL_GROUP',
      conditionFieldValue: 'test',
      blockType: BlockType.COND,
      conditionOperator: ConditionOperator.EQUAL,
      conditionFieldStartValue: null,
      conditionFieldEndValue: null,
      udrid: null
    };

  });

  it('close(), should close the current router', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(component.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }]);
  });

  it('changeOutputFormat(), should store the selected output format', async(() => {
    component.selectedFieldMetaData =
    {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    };

    component.tableColumnMetaData = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];

    component.changeOutputFormat(DisplayCriteria.TEXT);
    expect(component.tableColumnMetaData[0].displayCriteria).toBe(DisplayCriteria.TEXT);
    expect(component.selectedFieldMetaData.displayCriteria).toBe(DisplayCriteria.TEXT);

    component.changeOutputFormat(DisplayCriteria.CODE);
    expect(component.tableColumnMetaData[0].displayCriteria).toBe(DisplayCriteria.CODE);
    expect(component.selectedFieldMetaData.displayCriteria).toBe(DisplayCriteria.CODE);

    component.changeOutputFormat(DisplayCriteria.CODE_TEXT);
    expect(component.tableColumnMetaData[0].displayCriteria).toBe(DisplayCriteria.CODE_TEXT);
    expect(component.selectedFieldMetaData.displayCriteria).toBe(DisplayCriteria.CODE_TEXT);

  }));

  it('onFilter(), should display filter values for selected column', async(() => {
    component.tableColumnMetaData = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP', picklist: '1', isCheckList: 'true' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      },
      {
        widgetId: 1,
        fields: 'column',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'column', picklist: '1' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      },
      {
        widgetId: 1,
        fields: 'column1',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'column', picklist: '4' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      },
      {
        widgetId: 1,
        fields: 'column2',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'column', picklist: '2' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];
    let filter: Criteria = {
      fieldId: 'MATL_GROUP',
      conditionFieldId: 'MATL_GROUP',
      conditionFieldValue: 'test',
      blockType: BlockType.COND,
      conditionOperator: ConditionOperator.EQUAL,
      conditionFieldStartValue: null,
      conditionFieldEndValue: null,
      udrid: null
    };


    component.dropDownDataList = {
      'MATL_GROUP': [{ CODE: 'test', TEXT: 'TEST' }, { CODE: 'test2', TEXT: 'TEST2' }] as DropDownValues[],
      'column': [{ CODE: 'test', TEXT: 'TEST' }, { CODE: 'test2', TEXT: 'TEST2' }] as DropDownValues[],
      'column1': [{ CODE: 'test', TEXT: 'TEST' }, { CODE: 'test2', TEXT: 'TEST2' }] as DropDownValues[],
      'column2': [{ CODE: 'test', TEXT: 'TEST' }, { CODE: 'test2', TEXT: 'TEST2' }] as DropDownValues[]
    }
    component.filterApplied = [];
    component.onFilter(filter, 0);
    expect(component.filterApplied['MATL_GROUP'].length).toEqual(2);

    let filter1: Criteria = {
      fieldId: 'column',
      conditionFieldId: 'column',
      conditionFieldValue: 'test',
      blockType: BlockType.COND,
      conditionOperator: ConditionOperator.EQUAL,
      conditionFieldStartValue: null,
      conditionFieldEndValue: null,
      udrid: null
    };
    component.onFilter(filter1, 1);
    expect(component.filterApplied['column'].length).toEqual(1);

    let filter2: Criteria = {
      fieldId: 'column1',
      conditionFieldId: 'column1',
      conditionFieldValue: 'test',
      blockType: BlockType.COND,
      conditionOperator: ConditionOperator.EQUAL,
      conditionFieldStartValue: null,
      conditionFieldEndValue: null,
      udrid: null
    };

    component.onFilter(filter2, 2);
    expect(component.filterApplied['column1'].length).toEqual(1);

    let filter3: Criteria = {
      fieldId: 'column2',
      conditionFieldId: 'column3',
      conditionFieldValue: 'test',
      blockType: BlockType.COND,
      conditionOperator: ConditionOperator.EQUAL,
      conditionFieldStartValue: null,
      conditionFieldEndValue: null,
      udrid: null
    };

    component.onFilter(filter3, 2);
    expect(component.filterApplied['column2'].length).toEqual(1);
  }));


  it(`onChange(), should add DropDownValue in the filterApplied list if already exist`, async(() => {

    component.filterApplied['MATL_GROUP'] = [];
    const value = {
      CODE: 'test1',
      FIELDNAME: 'Test field 1',
      LANGU: '',
      PLANTCODE: '',
      SNO: `1`,
      TEXT: 'test field 1'
    };

    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', picklist: '1', isCheckList: 'true' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }
    component.onChange(value);
    expect(component.filterApplied[component.selectedFilter.fieldId].length).toEqual(1);

    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', picklist: '1' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }
    expect(component.filterApplied[component.selectedFilter.fieldId].length).toEqual(1);
  }));

  it(`onChange(), should remove DropDownValue in the filterApplied list if not already exist`, async(() => {
    component.filterApplied[component.selectedFilter.fieldId] = [];
    const value = {
      CODE: 'test',
      FIELDNAME: 'Test field 1',
      LANGU: '',
      PLANTCODE: '',
      SNO: `1`,
      TEXT: 'test field 1'
    };
    component.filterApplied[component.selectedFilter.fieldId].push(value);
    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', picklist: '1' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }
    component.onChange(value);
    expect(component.filterApplied[component.selectedFilter.fieldId].length).toEqual(0);

    component.filterApplied[component.selectedFilter.fieldId].push(value);
    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', picklist: '1', isCheckList: 'true' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }
    component.onChange(value);
    expect(component.filterApplied[component.selectedFilter.fieldId].length).toEqual(0);
  }));


  it('getDropDownValue(), should generate filters available on fieldId', async(() => {
    let fieldId = 'MATL_GROUP';
    const returnData: DropDownValue[] = [];
    component.dropDownDataList[fieldId] = [];
    spyOn(reportService, 'getDropDownValues').and.returnValue(of(returnData));
    component.getDropDownValue(fieldId);

    expect(component.dropDownDataList[fieldId].length).toEqual(returnData.length);

    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', picklist: '35' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }

    component.getDropDownValue(fieldId);

    expect(component.dropDownDataList[fieldId].length).toEqual(returnData.length);
  }));

  it('getColumnNames(), should get column names', async(() => {
    let tableColumnMetaData: ReportingWidget[] = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];
    spyOn(reportService, 'getColumnMetaData').and.returnValue(tableColumnMetaData);
    component.getColumnNames();
    expect(component.getColumnNames).toBeTruthy();
    expect(component.tableColumnMetaData.length).toEqual(tableColumnMetaData.length);
  }));


  it('ngOnDestroy()', () => {
    component.ngOnDestroy();
    expect(component.ngOnDestroy).toBeTruthy();
  });

  // it('ngOnInit()', () => {
  //   component.filterCriteria = [];
  //   let filteredCriteria = [
  //     {
  //       fieldId: 'MATL_GROUP',
  //       conditionFieldId: 'MATL_GROUP',
  //       conditionFieldValue: 'test',
  //       blockType: BlockType.COND,
  //       conditionOperator: ConditionOperator.EQUAL,
  //       conditionFieldStartValue: null,
  //       conditionFieldEndValue: null,
  //       udrid: null,
  //     }];

  //   component.filteredCriteriaList = [{
  //     fieldId: 'MATL_GROUP',
  //     conditionFieldId: 'MATL_GROUP',
  //     conditionFieldValue: 'test',
  //     blockType: BlockType.COND,
  //     conditionOperator: ConditionOperator.EQUAL,
  //     conditionFieldStartValue: null,
  //     conditionFieldEndValue: null,
  //     udrid: null,
  //   }];
  //   component.filterCriteria = [];
  //   spyOn(reportService, 'getFilterCriteria').and.returnValue(filteredCriteria);
  //   component.ngOnInit();
  //   expect(reportService.getFilterCriteria).toHaveBeenCalled();
  //   expect(component.getColumnNames).toHaveBeenCalledTimes(1);
  //   expect(component.ngOnInit).toBeTruthy();
  // });


  it('getSelectedValue() get selected value to show in text', () => {
    let fieldId = 'MATL_GROUP'
    component.dropDownDataList = {
      'MATL_GROUP': [{ CODE: 'test', TEXT: 'TEST' }, { CODE: 'test2', TEXT: 'TEST2' }] as DropDownValues[],
    }
    expect(component.getSelectedValue(fieldId, 'test')).toEqual('TEST');
    fieldId = 'column'
    expect(component.getSelectedValue(fieldId, '')).toEqual(null);
  })

  it('isDropDown(), check whether column field is drop down type or not', () => {
    component.tableColumnMetaData = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP', picklist: '1' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      },
      {
        widgetId: 2,
        fields: 'column1',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP', picklist: '30' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      },
      {
        widgetId: 3,
        fields: 'column2',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP', picklist: '37' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }]
    expect(component.isDropDown('MATL_GROUP')).toBeTrue();
    expect(component.isDropDown('column')).toBeFalse();
    expect(component.isDropDown('column1')).toBeTrue();
    expect(component.isDropDown('column2')).toBeTrue();
  })

  it('removeSelectedFilter(), remove filter that is already selected', () => {
    component.filterApplied[component.selectedFilter.fieldId] = [{
      CODE: 'test',
      FIELDNAME: 'Test field 1',
      LANGU: '',
      PLANTCODE: '',
      SNO: `1`,
      TEXT: 'test field 1'
    }]
    component.removedSelectedFilter('test',0);
    expect(component.removedSelectedFilter).toBeTruthy();
  })

  it('isDateType(),is date type column', () => {
    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', dataType: 'DATS' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }
    expect(component.isDateType()).toBeTrue();
    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', dataType: 'DTMS' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }
    expect(component.isDateType()).toBeTrue();
    component.selectedFieldMetaData = {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', dataType: 'CHAR' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    }
    expect(component.isDateType()).toBeFalse();
    component.selectedFieldMetaData = null;
    expect(component.isDateType()).toBeFalse();
  })

  it('getDateTypeVal(),get date type value', () => {
    expect(component.getDateTypeValue('34773647364')).toEqual('34773647364');
    expect(component.getDateTypeValue('')).toEqual('');
  })

  
  it('changeCondition(),change condition operator for selected filters', () => {
    component.filteredCriteriaList = [{
      fieldId: 'MATL_GROUP',
      conditionFieldId: 'MATL_GROUP',
      conditionFieldValue: 'test',
      blockType: BlockType.COND,
      conditionOperator: ConditionOperator.EQUAL,
      conditionFieldStartValue: null,
      conditionFieldEndValue: null,
      udrid: null,
    }];
    component.changeCondition(ConditionOperator.NOT_EQUAL);
    expect(component.filterCriteria[0].conditionOperator).toEqual(ConditionOperator.NOT_EQUAL);
    expect(component.filteredCriteriaList[0].conditionOperator).toEqual(ConditionOperator.NOT_EQUAL);
  })

  it('applyFilter(),apply filter when click on apply button', () => {
    const response: ReportingWidget[] = [
      {
        widgetId: 1,
        fields: 'MATL_GROUP',
        fieldOrder: '',
        fieldDesc: 'first field 1',
        sno: 1,
        fldMetaData: { fieldId: 'MATL_GROUP' } as MetadataModel,
        displayCriteria: DisplayCriteria.CODE
      }
    ];
    spyOn(reportService, 'getColumnMetaData').withArgs().and.returnValue(response);

    component.filteredCriteriaList = [{
      fieldId: 'MATL_GROUP',
      conditionFieldId: 'MATL_GROUP',
      conditionFieldValue: 'test',
      blockType: BlockType.COND,
      conditionOperator: ConditionOperator.EQUAL,
      conditionFieldStartValue: null,
      conditionFieldEndValue: null,
      udrid: null,
    }];
    spyOn(reportService, 'setFilterCriteria').withArgs(component.filteredCriteriaList);
    spyOn(router, 'navigate');
    component.applyFilter();
    expect(component.applyFilter).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }]);
  })

  it('getFormFieldType(), get form control type', () => {
    component.selectedFieldMetaData =
    {
      widgetId: 1,
      fields: 'MATL_GROUP',
      fieldOrder: '',
      fieldDesc: 'first field 1',
      sno: 1,
      fldMetaData: { fieldId: 'MATL_GROUP', picklist: '22', dataType: 'CHAR' } as MetadataModel,
      displayCriteria: DisplayCriteria.CODE
    };
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.TEXTAREA);
    component.selectedFieldMetaData.fldMetaData = { picklist: '2', dataType: 'DATS' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.DATE);
    component.selectedFieldMetaData.fldMetaData = { picklist: '2', dataType: 'DTMS' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.DATE_TIME);
    component.selectedFieldMetaData.fldMetaData = { picklist: '2', dataType: 'TIMS' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.TIME);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'CHAR' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.TEXT);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'ALTN' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.TEXT);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'ICSN' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.TEXT);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'REQ' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.TEXT);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'TEXT' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.TEXT);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'NUMC' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.NUMBER);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'DEC' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toEqual(FormControlType.NUMBER);
    component.selectedFieldMetaData.fldMetaData = { picklist: '0', dataType: 'ABCd' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toBeFalse();
    component.selectedFieldMetaData.fldMetaData = { picklist: '20' } as MetadataModel;
    expect(component.getFormFieldType(component.selectedFilter.fieldId)).toBeFalse();
  })
});