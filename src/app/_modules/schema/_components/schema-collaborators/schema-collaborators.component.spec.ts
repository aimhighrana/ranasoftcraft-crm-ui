import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaCollaboratorsComponent } from './schema-collaborators.component';

describe('SchemaCollaboratorsComponent', () => {
  let component: SchemaCollaboratorsComponent;
  let fixture: ComponentFixture<SchemaCollaboratorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaCollaboratorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaCollaboratorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
