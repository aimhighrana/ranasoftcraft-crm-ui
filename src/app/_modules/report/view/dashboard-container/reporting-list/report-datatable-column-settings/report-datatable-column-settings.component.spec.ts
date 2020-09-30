import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDatatableColumnSettingsComponent } from './report-datatable-column-settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from '../../../../../../app-material-for-spec.module';
import { Router } from '@angular/router';
import { MetadataModel } from '../../../../../../_models/schema/schemadetailstable';


describe('ReportDatatableColumnSettingsComponent', () => {
  let component: ReportDatatableColumnSettingsComponent;
  let fixture: ComponentFixture<ReportDatatableColumnSettingsComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReportDatatableColumnSettingsComponent],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule]
    })
      .compileComponents();
      router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDatatableColumnSettingsComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
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
  })
});
