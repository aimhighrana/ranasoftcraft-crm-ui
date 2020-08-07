import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BreadcrumbComponent } from '@modules/shared/_components/breadcrumb/breadcrumb.component';
import { DashboardContainerComponent } from '../dashboard-container/dashboard-container.component';
import { of } from 'rxjs';
import { ReportService } from '../../_service/report.service';


describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent, BreadcrumbComponent, DashboardContainerComponent],
      imports: [AppMaterialModuleForSpec, FormsModule, ReactiveFormsModule, RouterTestingModule, HttpClientTestingModule],
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
  it('should call getReportInfo()', () => {
    const reportSpy = spyOn(component.reportService, 'getReportInfo').and.callFake(() => {
      return of([])
    })
    component.getReportInfo(123);
    expect(reportSpy).toHaveBeenCalledWith(123)
  });

  it('should call showClearBtnEmit()', () => {
    component.showClearBtnEmit(true);
    expect(component.showClearFilterBtn).toEqual(true);
  });
});
