import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormInputComponent } from '../form-input/form-input.component';

import { SubscriberInviteComponent } from './subscriber-invite.component';

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

describe('SubscriberInviteComponent', () => {
  let component: SubscriberInviteComponent;
  let fixture: ComponentFixture<SubscriberInviteComponent>;
  const formBuilder: FormBuilder = new FormBuilder();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SubscriberInviteComponent,
        FormInputComponent
      ],
      imports: [
        HttpClientTestingModule,
        HttpClientModule,
        MatSnackBarModule,
        AppMaterialModuleForSpec,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: FormBuilder, useValue: formBuilder },

        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberInviteComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('initInviteForm(), should create invitation form', async () => {
    component.invitationForm = null;
    component.initInviteForm();
    expect(component.invitationForm.value.invites.length).toEqual(1);
  });

  it('addFormRow(), should add a new row to invites control', async () => {
    component.invitationForm = null;
    component.initInviteForm();
    expect(component.invitationForm.value.invites.length).toEqual(1);
  });

  it('invites().removeAt(inviteIndex), should remove a row based on the index', async () => {
    component.invitationForm = null;
    component.initInviteForm();
    expect(component.invitationForm.value.invites.length).toEqual(1);
    component.invites().removeAt(0);
    expect(component.invitationForm.value.invites.length).toEqual(0);
  });

  it('invites(), should return form array', async () => {
    component.invitationForm = null;
    component.initInviteForm();
    expect(component.invites().controls.length).toEqual(1);
  });

});
