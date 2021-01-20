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


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, BreadcrumbComponent, DashboardContainerComponent],
      imports: [AppMaterialModuleForSpec, FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule, SharedModule],
      providers: [
        ReportService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
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
    component.emitClearBtnEvent = true;
    component.clearFilters();
    expect(component.emitClearBtnEvent).toEqual(false);

    component.emitClearBtnEvent = false;
    component.clearFilters();
    expect(component.emitClearBtnEvent).toEqual(true);
  })
});
