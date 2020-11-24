import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTableComponent } from './generic-table.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('GenericTableComponent', () => {
  let component: GenericTableComponent;
  let fixture: ComponentFixture<GenericTableComponent>;
  const sampleTableData = {
    DATA: [
      {
        MATERIALNO: {
          valueCode: null,
          textdisplay: 'ERSA2279',
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        objnr: {
          valueCode: null,
          textdisplay: '991426058912542910',
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        PARENTOBJNO: {
          valueCode: null,
          textdisplay: null,
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        LANGUAGE_G: {
          valueCode: 'CS',
          textdisplay: 'Czech',
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        OBJECTTYPE: {
          valueCode: null,
          textdisplay: '1005',
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        D12121: {
          valueCode: null,
          textdisplay: null,
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        MSGFN: {
          valueCode: null,
          textdisplay: '009',
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        AV1: {
          valueCode: null,
          textdisplay: null,
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        },
        MATERIALDESCRIPTION: {
          valueCode: null,
          textdisplay: 'ABRASIVE',
          multiSelect: false,
          imgPath: null,
          allMultiselectvalues: null
        }
      }
    ],
    HEADER: [
      {
        fieldId: 'LANGUAGE_G',
        fieldDescri: 'Language',
        dataType: 'CHAR',
        picklist: 1,
        strucId: '0001',
        mandatory: true,
        maxChar: 2,
        dependency: '0',
        parentField: 'LANGUAGEGRID',
        locType: '',
        refField: 'false',
        textAreaLength: 0,
        textAreaWidth: 0,
        columnWidth: 100,
        columnWidthType: 'px',
        gridDisplay: true,
        defaultDisplay: true,
        readonlyField: false,
        mobileDisplay: false,
        inlineEdit: false,
        checkList: false
      },
      {
        fieldId: 'MATERIALDESCRIPTION',
        fieldDescri: 'Material Description',
        dataType: 'CHAR',
        picklist: 22,
        strucId: '0001',
        mandatory: false,
        maxChar: 50,
        dependency: '0',
        parentField: 'LANGUAGEGRID',
        locType: '',
        refField: 'false',
        textAreaLength: 0,
        textAreaWidth: 0,
        columnWidth: 100,
        columnWidthType: 'px',
        gridDisplay: true,
        defaultDisplay: true,
        readonlyField: false,
        mobileDisplay: false,
        inlineEdit: false,
        checkList: false
      },
      {
        fieldId: 'D12121',
        fieldDescri: 'TESTdate',
        dataType: 'DATS',
        picklist: 0,
        strucId: '0001',
        mandatory: false,
        maxChar: 20,
        dependency: '0',
        parentField: 'LANGUAGEGRID',
        locType: null,
        refField: 'false',
        textAreaLength: 0,
        textAreaWidth: 0,
        columnWidth: 100,
        columnWidthType: 'px',
        gridDisplay: true,
        defaultDisplay: true,
        readonlyField: false,
        mobileDisplay: false,
        inlineEdit: false,
        checkList: false
      },
      {
        fieldId: 'AV1',
        fieldDescri: 'text',
        dataType: 'CHAR',
        picklist: 0,
        strucId: '0001',
        mandatory: false,
        maxChar: 100,
        dependency: '0',
        parentField: 'LANGUAGEGRID',
        locType: null,
        refField: 'false',
        textAreaLength: 0,
        textAreaWidth: 0,
        columnWidth: 100,
        columnWidthType: 'px',
        gridDisplay: true,
        defaultDisplay: true,
        readonlyField: false,
        mobileDisplay: false,
        inlineEdit: false,
        checkList: false
      }
    ]
  }
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericTableComponent],
      imports:[ AppMaterialModuleForSpec ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set table data', () => {
    component.gridData = sampleTableData;
    expect(component.displayedColumns.length).toBeGreaterThanOrEqual(0);
    expect(component.dataSource.length).toBeGreaterThanOrEqual(0);

    component.gridData = { DATA: [ ]};
    expect(component.displayedColumns.length).toBeGreaterThanOrEqual(0);

    component.gridData = null;
    expect(component.gridData).toBeUndefined();
  });

  it('should call getText()', () => {
    const sampleData = {
      MSGFN: {
        valueCode: null,
        textdisplay: '009',
        multiSelect: false,
        imgPath: null,
        allMultiselectvalues: null
      },
      AV1: {
        valueCode: null,
        textdisplay: null,
        multiSelect: false,
        imgPath: null,
        allMultiselectvalues: null
      },
    }

    expect(component.getText(sampleData, 'MSGFN')).toBe('009');
    expect(component.getText(sampleData, 'sample')).toBe('');
    expect(component.getText(sampleData, 'AV1')).toBe('-');
  });

  it('should call getColumnDescription()', () => {
    component.gridData = sampleTableData;
    expect(component.getColumnDescription('AV1')).toBe('text')
    expect(component.getColumnDescription('AV11111')).toBe('')
  })

});
