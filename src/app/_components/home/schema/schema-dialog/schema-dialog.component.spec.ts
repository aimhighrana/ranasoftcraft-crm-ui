import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDialogComponent } from './schema-dialog.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('SchemaDialogComponent', () => {
  let component: SchemaDialogComponent;
  let fixture: ComponentFixture<SchemaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        ReactiveFormsModule
      ],
      declarations: [ SchemaDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
