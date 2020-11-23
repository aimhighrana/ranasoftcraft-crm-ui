import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListComponent, ReportList } from './report-list.component';
import { BreadcrumbComponent } from '../../shared/_components/breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { ReportService } from '../_service/report.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { AddTileComponent } from '@modules/shared/_components/add-tile/add-tile.component';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;
  let reportService: ReportService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportListComponent, BreadcrumbComponent, AddTileComponent ],
      imports:[ HttpClientModule, AppMaterialModuleForSpec],
      providers: [ ReportService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
    reportService = fixture.debugElement.injector.get(ReportService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`reportsList(), get report service`,async(()=>{
    const returnData: ReportList[] = [];
    spyOn(reportService,'reportList').and.returnValue(of(returnData));
    component.reportsList();
    expect(reportService.reportList).toHaveBeenCalled();
  }));

  // it('delete(), should delete the report', async(() => {
  //   const reportId = '8756787'
  //   spyOn(reportService,'deleteReport').withArgs(reportId).and.returnValue(of(true));
  //   component.delete(reportId);
  //   expect(reportService.deleteReport).toHaveBeenCalledWith(reportId);
  // }));
});
