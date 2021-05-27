import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BreadcrumbComponent } from '@modules/shared/_components/breadcrumb/breadcrumb.component';
import { DashboardContainerComponent } from '../dashboard-container/dashboard-container.component';
import { ReportService } from '../../_service/report.service';
import { SharedModule } from '@modules/shared/shared.module';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { DuplicateReportComponent } from '../duplicate-report/duplicate-report.component';
import { Router } from '@angular/router';
import { ExportComponent } from '../export/export.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dialogSpy: jasmine.Spy;
  const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of({}), close: null });
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, BreadcrumbComponent, DashboardContainerComponent],
      imports: [AppMaterialModuleForSpec, FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, SharedModule, MatDialogModule],
      providers: [
        ReportService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(dialogRefSpyObj);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('should call getReportInfo()', () => {
  //   const plantCode = '0';
  //   const reportSpy = spyOn(component.reportService, 'getReportInfo').and.callFake(() => {
  //     return of([])
  //   })
  //   component.getReportInfo(123);
  //   expect(reportSpy).toHaveBeenCalledWith(123, plantCode);
  // });

  it('should call showClearBtnEmit()', () => {
    component.showClearBtnEmit(true);
    expect(component.showClearFilterBtn).toEqual(true);
  });

  it('clearFilters(), should clear filters', () => {
    component.emitClearBtnEvent = false;
    component.clearFilters();
    expect(component.emitClearBtnEvent).toEqual(true);
  });

  it('editReport(), navigate to ', () => {
    component.reportId = 111;
    spyOn(router, 'navigate');
    component.editReport();
    expect(router.navigate).toHaveBeenCalledWith(['/home', 'report', 'dashboard-builder', component.reportId.toString()]);
  });

  it('duplicateReport(), open dialog', () => {
    component.reportId = 222;
    component.reportName = 'Test';
    component.duplicateReport();
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(DuplicateReportComponent, { data: { reportName: 'Test', reportId: 222 }, disableClose: true, width: '600px', minHeight: '250px' });
  });

  it('showClearBtnEmit(), should enable Clear filter(s) button', () => {
    expect(component.showClearFilterBtn).toEqual(false);
    component.showClearBtnEmit(true);
    expect(component.showClearFilterBtn).toEqual(true);
    expect(component.emitClearBtnEvent).toEqual(false);
  });

  it('showClearBtnEmit(), should disenable Clear filter(s) button', () => {
    component.showClearFilterBtn = true;
    component.showClearBtnEmit(false);
    expect(component.showClearFilterBtn).toEqual(false);
    expect(component.emitClearBtnEvent).toEqual(true);
  });

  it('exportReport(), open dialog', () => {
    component.reportId = 222;
    component.reportName = 'Test';
    component.exportReport();
    expect(dialogSpy).toHaveBeenCalled();
    expect(dialogSpy).toHaveBeenCalledWith(ExportComponent, { data: { reportName: 'Test', reportId: 222 }, disableClose: true, width: '600px', minHeight: '150px' });
  });
});
