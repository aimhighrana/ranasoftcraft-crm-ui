import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailEscalationPropertiesComponent } from './email-escalation-properties.component';
import { FormBuilder } from '@angular/forms';
import { WorkflowBuilderService } from '@services/workflow-builder.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';


describe('EmailEscalationPropertiesComponent', () => {
  let component: EmailEscalationPropertiesComponent;
  let fixture: ComponentFixture<EmailEscalationPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailEscalationPropertiesComponent ],
      imports: [HttpClientTestingModule, MatAutocompleteModule],
      providers : [FormBuilder, WorkflowBuilderService],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailEscalationPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should initialize the activity form', () => {
    component.initForm({name : 'first step'}) ;
    expect(component.emailForm).toBeDefined() ;
    expect(component.emailForm.value.name).toEqual('first step') ;
  });



  it('should emit updateProperties', () => {

      spyOn(component.updateProperties, 'emit');

      component.initForm() ;
      component.emailForm.controls.name.setValue('task');

      expect(component.updateProperties.emit).toHaveBeenCalled();
  });

  it('should check recipient pagination previous is enabled', () => {

    let enableResult = component.enablePreBtn ;
    expect(enableResult).toBeTrue();

    component.currentPageIdx = 1;

    enableResult = component.enablePreBtn ;
    expect(enableResult).toBeFalse();

  });

  it('should check recipient pagination next is enabled', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;

    component.currentPageIdx = 0;

    const selectedResult = component.enableNextBtn ;
    expect(selectedResult).toBeTrue();

  });

  it('should remove a recipient', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;

    component.possibleRecipients = component.selectedRecipients.slice(0,2) ;

    spyOn(component, 'paginateChip') ;
    component.removeRecipient(0) ;

    expect(component.selectedRecipients.length).toEqual(2);
    expect(component.paginateChip).toHaveBeenCalled();

  });


  it('should init the recipients list', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;

    component.initForm();
    component.oldFormValue = {recipientType : 'User'} ;

    component.emailForm.patchValue({recipientType : 'Role'});

    expect(component.selectedRecipients.length).toEqual(0);


  });

  it('should add a selected recipient', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;

    const optionData = {
      option : {
        value : 'r4'
      }
    }

    component.recipientSelected(optionData) ;

    expect(component.selectedRecipients.length).toEqual(4) ;

  });

  it('should not add an already selected recipient', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;

    const optionData = {
      option : {
        value : 'r1'
      }
    }

    component.recipientSelected(optionData) ;

    expect(component.selectedRecipients.length).toEqual(3) ;

  });

  it('should paginate recipients to prev', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;
    component.currentPageIdx = 1 ;
    component.paginateChip('prev');
    expect(component.currentPageIdx).toEqual(0) ;

  });

  it('should paginate recipients to next', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;
    component.currentPageIdx = 0 ;
    component.paginateChip('next');
    expect(component.currentPageIdx).toEqual(1) ;

  });

  it('should update the current displayed recipients', () => {

    component.selectedRecipients = ['r1', 'r2', 'r3' ] ;
    component.paginateChip();
    expect(component.possibleRecipients.length).toEqual(2) ;

  });



});
