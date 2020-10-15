import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowDatasetComponent } from './workflow-dataset.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('WorkflowDatasetComponent', () => {
  let component: WorkflowDatasetComponent;
  let fixture: ComponentFixture<WorkflowDatasetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowDatasetComponent ],
      imports:[
        AppMaterialModuleForSpec,
        HttpClientTestingModule
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
});
