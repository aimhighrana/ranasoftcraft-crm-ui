import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DecisionsModalComponent } from './decisions-modal.component';
import { FormBuilder } from '@angular/forms';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('DecisionsModalComponent', () => {
  let component: DecisionsModalComponent;
  let fixture: ComponentFixture<DecisionsModalComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecisionsModalComponent ],
      imports : [AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule],
      providers: [
        FormBuilder,
        { provide: MAT_DIALOG_DATA, useValue: {recipient : 'recipient', fields : [{ id : 1, label : 'Moving price R', key : 'movingPriceR', type : 'input', value: 'test'}]} },
        { provide: MatDialogRef, useValue: mockDialogRef }
      ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionsModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create and initialize the fields form', () => {
    component.ngOnInit();
    expect(component.decisionForm.value['1']).toEqual('test');
  });

  it('it should close the dialog', () => {
   component.onCancelClick();
   expect(mockDialogRef.close).toHaveBeenCalled();
  });

});
