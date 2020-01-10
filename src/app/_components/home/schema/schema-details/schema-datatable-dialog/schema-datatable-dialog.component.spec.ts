import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDatatableDialogComponent } from './schema-datatable-dialog.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

describe('SchemaDatatableDialogComponent', () => {
  let component: SchemaDatatableDialogComponent;
  let fixture: ComponentFixture<SchemaDatatableDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec
      ],
      declarations: [ SchemaDatatableDialogComponent],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaDatatableDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
