import { Component, OnInit, Input, AfterViewInit, ElementRef, HostListener, OnChanges, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { ReportService } from '../../_service/report.service';
import { WidgetMapInfo, Criteria, ReportDashboardPermission } from '../../_models/widget';
import { UserService } from '@services/user/userservice.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss']
})
export class DashboardContainerComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  @Input()
  reportId: number;

  @Input()
  emitClearBtnEvent: boolean;

  @Output()
  emitFilterApplied: EventEmitter<boolean> = new EventEmitter<boolean>();

  screenWidth = 0;
  noOfboxes = 200; // Initial 200
  boxSize: number;

  filterCriteria: Criteria[] = [];

  widgetList: WidgetMapInfo[];
  permissons: ReportDashboardPermission;

  subscriptions: Subscription[] = [];

  @ViewChild('rootContainer') rootContainer: ElementRef;
  constructor(
    private reportService: ReportService,
    private userService: UserService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnChanges(changes: import('@angular/core').SimpleChanges): void {

    if (changes && changes.emitClearBtnEvent && changes.emitClearBtnEvent.currentValue){
      this.filterCriteria = [];
      this.emitFilterApplied.emit(false);
    }

    if(changes && changes.reportId && changes.reportId.currentValue !== changes.reportId.previousValue) {
      this.reportId = changes.reportId.currentValue;
      if(this.reportId) {
        this.getReportInfo(this.reportId);
      }
    }
  }

  ngAfterViewInit(): void {
    if(this.rootContainer) {
      // this.screenWidth = (this.rootContainer.nativeElement as HTMLDivElement).offsetWidth;
      this.screenWidth = window.innerWidth;
      this.boxSize = this.screenWidth / this.noOfboxes;
    }
  }

  ngOnInit(): void {
    if(this.reportId) {
      this.getReportInfo(this.reportId);
    }
  }

  click(data: any) {
    console.log(data);
  }

  changeFilterCriteria(criteria: Criteria[], isFilter?:boolean) {
    if (criteria.length !== 0 && this.filterCriteria.length !== 0){
      this.filterCriteria = new Array();
      criteria.forEach(loop => this.filterCriteria.push(loop));
      this.emitFilterApplied.emit(this.filterCriteria.length ? true : false);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if(event) {
      this.screenWidth = event.target.innerWidth;
      this.boxSize = this.screenWidth / this.noOfboxes;
    }
  }

  getReportInfo(reportId: number) {
    this.userService.getUserDetails().pipe(distinctUntilChanged()).subscribe(user=>{
      this.reportService.getReportInfo(reportId, user.plantCode).subscribe(res=>{
        this.widgetList = res.widgets;
        this.permissons = res.permissons;
      },error=>{
        console.log(`Error ${error}`);
      });
    });
  }
}
