import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DuplicateReport } from '@modules/report/_models/widget';
import { WidgetService } from '@services/widgets/widget.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { DuplicateReportComponent } from './duplicate-report.component';

describe('DuplicateReportComponent', () => {
  let component: DuplicateReportComponent;
  let fixture: ComponentFixture<DuplicateReportComponent>;
  let WidgetServiceSpy: WidgetService;
  let router: Router;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DuplicateReportComponent],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }, {
          provide: MAT_DIALOG_DATA, useValue: {}
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateReportComponent);
    component = fixture.componentInstance;
    WidgetServiceSpy = fixture.debugElement.injector.get(WidgetService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('onCancel(), should close the dialog', async(() => {
    component.onCancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  }));

  it('onConfirm(), should failed to duplicate a report', async(() => {
    component.reportName = 'Copy of Test';
    component.data = {
      reportId: '724752745672',
      reportName: component.reportName
    };
    const mockReportRes = {
      acknowledged: true,
      errorMsg: 'Network error',
      reportId: null,
      reportName: null
    } as DuplicateReport;
    spyOn(WidgetServiceSpy, 'copyReport').withArgs(component.data.reportId, component.reportName).and.returnValue(throwError({ error: { error: mockReportRes } }));
    component.onConfirm();
    expect(WidgetServiceSpy.copyReport).toHaveBeenCalledWith(component.data.reportId, component.reportName);
  }));

  it('onConfirm(), should duplicate a report', async(() => {
    component.reportName = 'Copy of Test';
    component.data = {
      reportId: '724752745672',
      reportName: component.reportName
    };
    const mockReportRes = {
      acknowledged: true,
      errorMsg: null,
      reportId: '285173683172897819',
      reportName: 'Copy of Test'
    } as DuplicateReport;
    spyOn(WidgetServiceSpy, 'copyReport').withArgs(component.data.reportId, component.reportName).and.returnValue(of(mockReportRes));
    spyOn(router, 'navigate');
    component.onConfirm();
    expect(WidgetServiceSpy.copyReport).toHaveBeenCalledWith(component.data.reportId, component.reportName);
    expect(router.navigate).toHaveBeenCalledWith(['/home', 'report', 'dashboard-builder', mockReportRes.reportId]);
  }));
});
