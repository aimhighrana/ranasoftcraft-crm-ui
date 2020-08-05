import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SchemaStatusinfoDialogComponent } from './schema-statusinfo-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

describe('SchemaStatusinfoDialogComponent', () => {
  let component: SchemaStatusinfoDialogComponent;
  let fixture: ComponentFixture<SchemaStatusinfoDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaStatusinfoDialogComponent ],
      imports: [ AppMaterialModuleForSpec, MatDialogModule ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaStatusinfoDialogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it should close the dialog', () => {
    component.closeDialog();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});
