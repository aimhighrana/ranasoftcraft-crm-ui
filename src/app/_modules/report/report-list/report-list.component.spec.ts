import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListComponent, ReportList } from './report-list.component';
import { BreadcrumbComponent } from '../../shared/_components/breadcrumb/breadcrumb.component';
import { HttpClientModule } from '@angular/common/http';
import { ReportService } from '../_service/report.service';
import { of } from 'rxjs';

describe('ReportListComponent', () => {
  let component: ReportListComponent;
  let fixture: ComponentFixture<ReportListComponent>;
  let reportService: jasmine.SpyObj<ReportService>;
  beforeEach(async(() => {
    const spyObj = jasmine.createSpyObj('ReportService',['reportList']);
    TestBed.configureTestingModule({
      declarations: [ ReportListComponent, BreadcrumbComponent ],
      imports:[ HttpClientModule],
      providers: [
        {provide: ReportService, useValue: spyObj}
      ]
    })
    .compileComponents();
    reportService = TestBed.inject(ReportService) as jasmine.SpyObj<ReportService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`reportService(), get report service`,async(()=>{
    const returnData: ReportList[] = [];
    reportService.reportList.and.returnValue(of(returnData));
    component.ngOnInit();
    expect(reportService.reportList).toHaveBeenCalled();
  }));
});
