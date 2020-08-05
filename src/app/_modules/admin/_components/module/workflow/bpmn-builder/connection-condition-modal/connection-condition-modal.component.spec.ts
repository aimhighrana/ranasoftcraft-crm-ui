import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionConditionModalComponent } from './connection-condition-modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { WorkflowBuilderService } from '@services/workflow-builder.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('ConnectionConditionModalComponent', () => {
  let component: ConnectionConditionModalComponent;
  let fixture: ComponentFixture<ConnectionConditionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionConditionModalComponent ],
      imports : [AppMaterialModuleForSpec, HttpClientTestingModule],
      providers: [
        FormBuilder,
        WorkflowBuilderService,
        { provide: MAT_DIALOG_DATA, useValue: {conditions : []} },
        { provide: MatDialogRef, useValue: {} },
        { provide: ActivatedRoute, useValue: {
          queryParams: of({pathname: 'WF72', moduleId: '1005'})
        } }
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionConditionModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a condition', () => {
    const currentLength = component.rows.length ;
    component.addCondition() ;
    expect(component.rows.length).toEqual(currentLength + 1 ) ;
  });

  it('should update the mat table', () => {
    spyOn(component.dataSource,'next');
    component.addCondition() ;
    expect(component.dataSource.next).toHaveBeenCalled();
  });

  it('should get the wf fields', () => {

    component.getWfFields();
    expect(component.workflowFields.length).toEqual(0);
  });

});
