import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SchemaExecutionDialogComponent } from './schema-execution-dialog.component';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ThousandconvertorPipe } from 'src/app/_modules/shared/_pipes/thousandconvertor.pipe';

describe('SchemaExecutionDialogComponent', () => {
  let component: SchemaExecutionDialogComponent;
  let fixture: ComponentFixture<SchemaExecutionDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaExecutionDialogComponent, ThousandconvertorPipe],
      imports: [ MatDialogModule, AppMaterialModuleForSpec, HttpClientModule],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }, { provide: MAT_DIALOG_DATA, useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaExecutionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close should close the dialog', () => {
  });
});
