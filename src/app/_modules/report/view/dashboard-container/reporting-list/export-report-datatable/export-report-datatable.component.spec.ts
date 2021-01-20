import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportReportDatatableComponent } from './export-report-datatable.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@modules/shared/shared.module';

describe('ExportReportDatatableComponent', () => {
  let component: ExportReportDatatableComponent;
  let fixture: ComponentFixture<ExportReportDatatableComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportReportDatatableComponent ],
      imports:[
        AppMaterialModuleForSpec,
        ReactiveFormsModule,
        FormsModule,
        SharedModule
      ],
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
    fixture = TestBed.createComponent(ExportReportDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), load prerequired', async(()=>{
    component.data = {recCount:12000};
    component.ngOnInit();

    expect(component.pages.length).toEqual(3);
  }));

  it('close(), should close dialog', async(()=>{
    component.close();
    expect(component.dialogRef.close).toHaveBeenCalled();
  }));

  it('download(), should close dialog with page from', async(()=>{
    component.pageCtrl.setValue(2);
    component.download();
    expect(component.dialogRef.close).toHaveBeenCalledWith(2);
  }));

});
