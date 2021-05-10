import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDatatableColumnSettingsComponent } from './report-datatable-column-settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from '../../../../../../app-material-for-spec.module';
import { Router } from '@angular/router';
import { MetadataModel, MetadataModeleResponse } from '../../../../../../_models/schema/schemadetailstable';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { SharedModule } from '@modules/shared/shared.module';
import { ReportService } from '@modules/report/_service/report.service';
import { of } from 'rxjs';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { DisplayCriteria } from '@modules/report/_models/widget';


describe('ReportDatatableColumnSettingsComponent', () => {
  let component: ReportDatatableColumnSettingsComponent;
  let fixture: ComponentFixture<ReportDatatableColumnSettingsComponent>;
  let router: Router;
  let reportServiceSpy: ReportService;
  let sharedserviceSpy: SharedServiceService;
  let schemaDetailsService: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportDatatableColumnSettingsComponent, SearchInputComponent],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule, SharedModule]
    })
      .compileComponents();
      router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDatatableColumnSettingsComponent);
    component = fixture.componentInstance;
    reportServiceSpy = fixture.debugElement.injector.get(ReportService);
    sharedserviceSpy = fixture.debugElement.injector.get(SharedServiceService);
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close(), should close the side sheet', async() => {
    // fixture.detectChanges();
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith(['', { outlets: { sb: null } }])
  })

  it('selectAllCheckboxes(), should select/unselect all check boxes', async () => {
    component.allCheckboxSelected = true;
    component.headers = [
      {
        fieldId: 'NDCTYPE'
      } as MetadataModel
    ]
    component.data = {
      objectType: 1005,
      selectedColumns: [],
      isWorkflowdataSet: false,
      widgetId: 123456
    }
    component.selectAllCheckboxes();
    expect(component.allIndeterminate).toEqual(false);

    component.allCheckboxSelected = false;
    component.selectAllCheckboxes();
    expect(component.allIndeterminate).toEqual(false);
    // expect(component.data.selectedColumns.length).toEqual(1);
  })

  it('manageStateOfCheckbox(), should manage the state of checkboxes', async() => {
    component.headers = [
      {
        fieldId : 'NDCTYPE',
        fieldDescri: 'NDC TYPE MATERIAL'
      } as MetadataModel
    ]

    component.data = {
      objectType: 1005,
      selectedColumns: [
        {
          fieldId: 'NDCTYPE',
          fieldDescri: 'NDC TYPE MATERIAL'
        },
        {
          fieldId: 'MATL_TYPE',
          fieldDescri: 'MATERIAL TYPE'
        }
      ],
      isWorkflowdataSet: false,
      widgetId: 123456
    }

    component.manageStateOfCheckbox();
    expect(component.allIndeterminate).toEqual(true);

    component.headers = [
      {
        fieldId : 'NDCTYPE',
        fieldDescri: 'NDC TYPE MATERIAL'
      } as MetadataModel
    ]

    component.data = {
      objectType: 1005,
      selectedColumns: [
        {
          fieldId: 'NDCTYPE',
          fieldDescri: 'NDC TYPE MATERIAL'
        }
      ],
      isWorkflowdataSet: false,
      widgetId: 123456
    }

    component.manageStateOfCheckbox();
    expect(component.allIndeterminate).toEqual(false);
    expect(component.allCheckboxSelected).toEqual(true);
  });

  it('getCustomFields(), get Custom Fields of widget', async(() => {
    const obj = 'numberoflogin';
    component.data= {};
    const res = [{fieldId: 'USERID', fieldDescri: 'User Id'}, {fieldId: 'TIMEZONE', fieldDescri: 'Time Zone'}];
    spyOn(reportServiceSpy,'getCustomDatasetFields').withArgs(obj).and.returnValue(of(res));
    component.getCustomFields(obj);
    expect(reportServiceSpy.getCustomDatasetFields).toHaveBeenCalledWith(obj);
    expect(component.headers.length).toEqual(2);

    component.data= {
      selectedColumns: ['fname']
    };
    component.getCustomFields(obj);
    expect(component.headers.length).toEqual(3);
  }));

  it('ngOnInit(), preloadaed function', async(() => {
    const response = { objectType: 'numberoflogin', selectedColumns: ['fname'], isWorkflowdataSet: false, isCustomdataSet: true, widgetId: '9876534433', isRefresh:false};
    spyOn(sharedserviceSpy,'getReportDataTableSetting').and.returnValue(of(response));
    component.ngOnInit();
    expect(sharedserviceSpy.getReportDataTableSetting).toHaveBeenCalled();
    expect(component.data.objectType).toEqual('numberoflogin');
  }));

  it('getWorkFlowFields(), get Workflow Fields of widget', async(() => {
    const obj = Array('1005');
    component.data= {};
    const res = {static:[{fieldId: 'status', fieldDescri: 'Staus'}, {fieldId: 'CRID', fieldDescri: 'Criteria Id'}], dynamic:[{fieldId: 'PO_UNIT', fieldDescri: 'Order Unit'}]};
    spyOn(schemaDetailsService,'getWorkflowFields').withArgs(obj).and.returnValue(of(res));
    component.getWorkFlowFields(obj);
    expect(schemaDetailsService.getWorkflowFields).toHaveBeenCalledWith(obj);
    expect(component.headers.length).toEqual(3);

    component.data= {
      selectedColumns: ['WFID']
    };
    component.getWorkFlowFields(obj);
    expect(component.headers.length).toEqual(4);
  }));

  it('ngOnInit(), preloadaed function', async(() => {
    const response = { objectType: '1005', selectedColumns: ['fname'], isWorkflowdataSet: true, isCustomdataSet: false, widgetId: '9876534433', isRefresh:false};
    spyOn(sharedserviceSpy,'getReportDataTableSetting').and.returnValue(of(response));
    component.ngOnInit();
    expect(sharedserviceSpy.getReportDataTableSetting).toHaveBeenCalled();
    expect(component.data.objectType).toEqual('1005');
  }));

  it('getAllMetaDataFields(), get metadata Fields of widget', async(() => {
    const obj = '1005';
    component.data= {};
    const res = {
      headers:{
        MARA_NRFHG:{
          fieldId:'MARA_NRFHG',
          fieldDescri:'Qual.f.FreeGoodsDis'
        },
        GS_TO_DATE:{
          fieldId:'GS_TO_DATE',
          fieldDescri:'To Date'
        }
      }
    } as MetadataModeleResponse;
    spyOn(schemaDetailsService,'getMetadataFields').withArgs(obj).and.returnValue(of(res));
    component.getAllMetaDataFields(obj);
    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalledWith(obj);
    expect(component.headers.length).toEqual(3);

    component.data= {
      selectedColumns: ['NDC_TYPE']
    };
    component.getAllMetaDataFields(obj);
    expect(component.headers.length).toEqual(4);
  }));

  it('ngOnInit(), preloadaed function', async(() => {
    const response = { objectType: '1005', selectedColumns: ['fname'], isWorkflowdataSet: false, isCustomdataSet: false, widgetId: '9876534433', isRefresh:false};
    spyOn(sharedserviceSpy,'getReportDataTableSetting').and.returnValue(of(response));
    component.ngOnInit();
    expect(sharedserviceSpy.getReportDataTableSetting).toHaveBeenCalled();
    expect(component.data.objectType).toEqual('1005');
  }));

  it('manageAllDisplayCriteria(), allDisplayCriteria should equal TEXT', async(() => {
    component.data = {
      objectType: 1005,
      selectedColumns: [
        {
          fieldId: 'NDCTYPE',
          fieldDescri: 'NDC TYPE MATERIAL',
          displayCriteria: DisplayCriteria.TEXT
        },
        {
          fieldId: 'MATL_TYPE',
          fieldDescri: 'MATERIAL TYPE',
          displayCriteria: DisplayCriteria.TEXT
        }
      ],
      isWorkflowdataSet: false,
      widgetId: 123456
    };
    component.manageAllDisplayCriteria();
    expect(component.allDisplayCriteria).toEqual(DisplayCriteria.TEXT);
  }));

  it('manageAllDisplayCriteria(), allDisplayCriteria should equal CODE', async(() => {
    component.data = {
      objectType: 1005,
      selectedColumns: [
        {
          fieldId: 'NDCTYPE',
          fieldDescri: 'NDC TYPE MATERIAL',
          displayCriteria: DisplayCriteria.CODE
        },
        {
          fieldId: 'MATL_TYPE',
          fieldDescri: 'MATERIAL TYPE',
          displayCriteria: DisplayCriteria.CODE
        }
      ],
      isWorkflowdataSet: false,
      widgetId: 123456
    };
    component.manageAllDisplayCriteria();
    expect(component.allDisplayCriteria).toEqual(DisplayCriteria.CODE);
  }));

  it('manageAllDisplayCriteria(), allDisplayCriteria should equal CODE_TEXT', async(() => {
    component.data = {
      objectType: 1005,
      selectedColumns: [
        {
          fieldId: 'NDCTYPE',
          fieldDescri: 'NDC TYPE MATERIAL',
          displayCriteria: DisplayCriteria.CODE_TEXT
        },
        {
          fieldId: 'MATL_TYPE',
          fieldDescri: 'MATERIAL TYPE',
          displayCriteria: DisplayCriteria.CODE_TEXT
        }
      ],
      isWorkflowdataSet: false,
      widgetId: 123456
    };
    component.manageAllDisplayCriteria();
    expect(component.allDisplayCriteria).toEqual(DisplayCriteria.CODE_TEXT);
  }));

  it('manageAllDisplayCriteria(), allDisplayCriteria should equal null', async(() => {
    component.data = {
      objectType: 1005,
      selectedColumns: [
        {
          fieldId: 'NDCTYPE',
          fieldDescri: 'NDC TYPE MATERIAL',
          displayCriteria: DisplayCriteria.TEXT
        },
        {
          fieldId: 'MATL_TYPE',
          fieldDescri: 'MATERIAL TYPE',
          displayCriteria: DisplayCriteria.CODE_TEXT
        }
      ],
      isWorkflowdataSet: false,
      widgetId: 123456
    };
    component.manageAllDisplayCriteria();
    expect(component.allDisplayCriteria).toEqual(null);
  }));

  it('changeAllDisplayCriteria(), should change all selectedColumns.displayCriteria to CODE_TEXT', async(() => {
    component.data = {
      objectType: 1005,
      selectedColumns: [
        {
          fieldId: 'NDCTYPE',
          fieldDescri: 'NDC TYPE MATERIAL',
          displayCriteria: DisplayCriteria.TEXT,
          picklist: '1'
        },
        {
          fieldId: 'MATL_TYPE',
          fieldDescri: 'MATERIAL TYPE',
          displayCriteria: DisplayCriteria.CODE,
          picklist: '30'
        },
        {
          fieldId: 'DATE',
          fieldDescri: 'DATE',
          displayCriteria: DisplayCriteria.CODE,
          picklist: '37'
        }
      ],
      isWorkflowdataSet: false,
      widgetId: 123456
    };
    component.allDisplayCriteria = DisplayCriteria.CODE_TEXT;
    component.changeAllDisplayCriteria();
    expect(component.data.selectedColumns[0].displayCriteria).toEqual(DisplayCriteria.CODE_TEXT);
    expect(component.data.selectedColumns[1].displayCriteria).toEqual(DisplayCriteria.CODE_TEXT);
    expect(component.data.selectedColumns[2].displayCriteria).toEqual(DisplayCriteria.CODE_TEXT);
  }));
});
