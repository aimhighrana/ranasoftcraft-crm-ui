import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList, SchemaListDetails } from '@models/schema/schemalist';
import { Location } from '@angular/common';
import { SchemaService } from '@services/home/schema.service';
import { ReportService } from '@modules/report/_service/report.service';
import { ReportList } from '@modules/report/report-list/report-list.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';

@Component({
  selector: 'pros-secondary-navbar',
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.scss']
})
export class SecondaryNavbarComponent implements OnInit, OnChanges {

  public moduleList: SchemaListModuleList[] = [];
  reportList: ReportList[] = [];

  dataIntillegences: SchemaListDetails[] = [];

  @Input()
  activatedPrimaryNav: string;

  /**
   * icon arrow value
   */
  arrowIcon = 'keyboard_arrow_left';

  /**
   * Emitter to emit sidebar toggleing
   */
  @Output() toggleEmitter: EventEmitter<{}> = new EventEmitter<{}>();

  constructor(
    private router: Router,
    private schemaListService: SchemalistService,
    private location: Location,
    private schemaService: SchemaService,
    private reportService: ReportService,
    private sharedService: SharedServiceService
    ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.activatedPrimaryNav && changes.activatedPrimaryNav.previousValue !== changes.activatedPrimaryNav.currentValue) {

      switch (changes.activatedPrimaryNav.currentValue) {
        case 'welcome':
          this.getDataIntilligence();
          break;

        case 'schema':
          this.getSchemaList();
          break;

        case 'report':
          this.getreportList();
          break;

        default:
          break;
      }
    }
  }

  ngOnInit(): void {

    this.location.subscribe(res => {
      console.log(res);
    })

    this.sharedService.getReportListData().subscribe(res=>{
      if(res){
        this.getreportList();
      }
    });

    this.sharedService.getTogglePrimaryEmit().subscribe(res=>{
      if(res){
        this.toggleSideBar(true);
      }
    });
  }

  /**
   * Get all schema along with variants ..
   */
  getDataIntilligence() {
    this.schemaService.getSchemaWithVariants().subscribe(res => {
      this.dataIntillegences = res;
    }, error => console.error(`Error : ${error.message}`));
  }

  /**
   * Get all schemas ..
   */
  public getSchemaList() {
    this.schemaListService.getSchemaList().subscribe((moduleList) => {
      this.moduleList = moduleList;
      if (this.moduleList) {
        const firstModuleId = this.moduleList[0].moduleId;
        this.router.navigate(['/home/schema', firstModuleId]);
      }


    }, error => {
      console.error(`Error : ${error.message}`);
    })
  }

  /**
   * Open schema details ..
   */
  openSchemaDetails(module: SchemaListModuleList) {
    const frstSchemaId = module.schemaLists ? module.schemaLists[0].schemaId : '';
    this.router.navigate(['/home/schema/schema-details', module.moduleId, frstSchemaId, 0]);
  }

  public getreportList() {
    this.reportService.reportList().subscribe(reportList=>{
      console.log(reportList);
      this.reportList = reportList;
      if(this.reportList){
        const firstReportId = this.reportList[0].reportId;
        this.router.navigate(['home/report/dashboard',firstReportId]);
      }
    },error=>console.error(`Error : ${error}`));
  }

  /**
   * Get routed descriptions ..
   */
  get getRoutedDescription(): string {
    let res = 'Unknown';
    switch (this.activatedPrimaryNav) {
      case 'welcome':
        res = 'Home';
        break;
      case 'schema':
        res = 'Schema';
        break;
      case 'report':
        res = 'Report';
        break;
      default:
        break;
    }
    return res;
  }

  /**
   * Navigate to particular page ..
   */
  globalCreate() {
    switch (this.activatedPrimaryNav) {
      case 'welcome':
        break;
      case 'schema':
        this.router.navigate(['', { outlets: { sb: 'sb/schema/create-schema' } }]);
        break;
      case 'report':
        this.toggleSideBar(true);
        this.router.navigate(['home/report/dashboard-builder/new']);
        break;
      default:
        break;
    }
  }

  /**
   * function to toggle the icon
   * and emit the toggle event
   */
  toggleSideBar(hidePrimary = false) {
    if (this.arrowIcon === 'keyboard_arrow_left') {
      this.arrowIcon = 'keyboard_arrow_right';
    } else if (this.arrowIcon === 'keyboard_arrow_right') {
      this.arrowIcon = 'keyboard_arrow_left'
    }
    this.toggleEmitter.emit(hidePrimary)
  }
}
