import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DecisionsModalComponent } from './decisions-modal.component';
import { FormBuilder } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WorkflowBuilderService } from '@services/workflow-builder.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DecisionsModalComponent', () => {
  let component: DecisionsModalComponent;
  let fixture: ComponentFixture<DecisionsModalComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionsModalComponent ],
      imports : [MatDialogModule, HttpClientTestingModule],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {recipient : 'recipient', fields : [{ id : 1, label : 'Moving price R', key : 'movingPriceR', type : 'input', value: 'test'}]} },
        { provide: MatDialogRef, useValue: mockDialogRef },
        WorkflowBuilderService,
        { provide: ActivatedRoute, useValue: {
          queryParams: of({pathname: 'WF72', moduleId: '1005'})
        } }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize the fields form', () => {
    expect(component.decisionForm.value['1']).toEqual('test');
  });

  it('it should close the dialog', () => {
    component.onCancelClick();
   expect(mockDialogRef.close).toHaveBeenCalled();
  });

});
