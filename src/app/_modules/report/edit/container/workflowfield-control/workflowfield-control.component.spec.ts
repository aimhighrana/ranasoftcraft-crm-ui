import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkflowfieldControlComponent } from './workflowfield-control.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

describe('WorkflowfieldControlComponent', () => {
  let component: WorkflowfieldControlComponent;
  let fixture: ComponentFixture<WorkflowfieldControlComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkflowfieldControlComponent ],
      imports:[HttpClientTestingModule, MatAutocompleteModule, ReactiveFormsModule, FormsModule, MatFormFieldModule],
      providers:[
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowfieldControlComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
