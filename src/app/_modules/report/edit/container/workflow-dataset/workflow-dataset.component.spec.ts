import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDatasetComponent } from './workflow-dataset.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WorkflowResponse } from '@models/schema/schema';
import { SharedModule } from '@modules/shared/shared.module';

describe('WorkflowDatasetComponent', () => {
  let component: WorkflowDatasetComponent;
  let fixture: ComponentFixture<WorkflowDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDatasetComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowDatasetComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('selectAll(), should select and deselect all checkboxes', async() => {
    component.allChecked = true;
    component.selectAll();
    expect(component.allIndeterminate).toEqual(false);

    component.allChecked = false;
    component.selectAll();
    expect(component.allIndeterminate).toEqual(false);
  })

  it('isSelected(), should tell select/unselect state', () => {
    let item = {
      objectid : '1005',
      objectdesc: 'Material',
      isSelected: true
    }as WorkflowResponse
    let res = component.isSelected(item);
    expect(res).toEqual(true);

    item = {
      isSelected : false
    } as WorkflowResponse
    res = component.isSelected(item);
    expect(res).toEqual(false);
  })

  it('isChecked(), should tell checked/unchecked state', () => {
    let item = {
      objectid : '1005',
      objectdesc: 'Material',
      isSelected: true
    }as WorkflowResponse
    let res = component.isSelected(item);
    expect(res).toEqual(true);

    item = {
      isSelected : false
    } as WorkflowResponse
    res = component.isSelected(item);
    expect(res).toEqual(false);
  })

  it('manageStateOfCheckBox(), should manage all select functionality of checkboxes', () => {
    component.dataSetsWorkFlow = [
      {
        objectid : '1005',
        objectdesc: 'Material',
        isSelected: true
      },
      {
        objectid : '10051',
        objectdesc: 'Swap Equipment',
        isSelected: true
      },
      {
        objectid : '10052',
        objectdesc: 'Material 2',
        isSelected: false
      },
      {
        objectid : '10053',
        objectdesc: 'Swap Equipment 34',
        isSelected: true
      },
    ]
    component.manageStateOfCheckBox(false);
    expect(component.allChecked).toEqual(false);

    component.dataSetsWorkFlow = [
      {
        objectid : '1005',
        objectdesc: 'Material',
        isSelected: true
      },
      {
        objectid : '10051',
        objectdesc: 'Swap Equipment',
        isSelected: true
      },
      {
        objectid : '10052',
        objectdesc: 'Material 2',
        isSelected: true
      },
      {
        objectid : '10053',
        objectdesc: 'Swap Equipment 34',
        isSelected: true
      },
    ]

    component.manageStateOfCheckBox(false);
    expect(component.allChecked).toEqual(true);

    component.dataSetsWorkFlow = [
      {
        objectid : '1005',
        objectdesc: 'Material',
        isSelected: false
      }
    ]
    component.manageStateOfCheckBox(false);
    expect(component.allChecked).toEqual(false);
    expect(component.allIndeterminate).toEqual(false);
  })
});
