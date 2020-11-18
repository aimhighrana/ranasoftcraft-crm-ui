import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList, SchemaListDetails } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { ReportService } from '@modules/report/_service/report.service';
import { ReportList } from '@modules/report/report-list/report-list.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'pros-secondary-navbar',
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.scss']
})
export class SecondaryNavbarComponent implements OnInit, OnChanges {

  public moduleList: SchemaListModuleList[] = [];
  reportList: ReportList[] = [];

  dataIntillegences: SchemaListDetails[] = [];

  /**
   * schema search result array from home navigation
   */
  searchSchemaResults: SchemaListDetails[] = [];

  /**
   * module search result array from schema navigation
   */
  searchModuleResults: SchemaListModuleList[] = [];

  /**
   * report list observal ..
   */
  reportOb: Observable<ReportList[]> = of([]);

  @Input()
  activatedPrimaryNav: string;

  /**
   * icon arrow value
   */
  arrowIcon = 'keyboard_arrow_left';

  /** To check page reloaded or not */
  isPageReload = true;

  /**
   * Emitter to emit sidebar toggleing
   */
  @Output() toggleEmitter: EventEmitter<{}> = new EventEmitter<{}>();

  constructor(
    private router: Router,
    private schemaListService: SchemalistService,
    private schemaService: SchemaService,
    private reportService: ReportService,
    private sharedService: SharedServiceService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes && changes.activatedPrimaryNav && changes.activatedPrimaryNav.previousValue !== changes.activatedPrimaryNav.currentValue && changes.activatedPrimaryNav.previousValue !== undefined) {
      this.activatedPrimaryNav = changes.activatedPrimaryNav.currentValue;
      this.isPageReload = false;
      switch (changes.activatedPrimaryNav.currentValue) {
        case 'welcome':
          this.getSchemaList();
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
    this.sharedService.getReportListData().subscribe(res => {
      if (res) {
        this.getreportList();
      }
    });

    this.sharedService.getTogglePrimaryEmit().subscribe(res => {
      if (res) {
        this.toggleSideBar(true);
      }
    });

    const currentUrl = this.router.url;
    this.checkDescOnReload(currentUrl)
  }

  /**
   * Get all schema along with variants ..
   */
  getDataIntilligence() {
    this.schemaService.getSchemaWithVariants().subscribe(res => {
      this.dataIntillegences.length = 0;
      this.dataIntillegences.push(...res);
      this.searchSchemaResults = this.dataIntillegences;
    }, error => console.error(`Error : ${error.message}`));
  }

  /**
   * Get all schemas ..
   */
  public getSchemaList() {
    this.schemaListService.getSchemaList().subscribe((moduleList) => {
      this.moduleList = moduleList;
      this.searchModuleResults = this.moduleList;
      if (this.moduleList && !this.isPageReload && this.activatedPrimaryNav === 'schema') {
        const firstModuleId = this.moduleList[0].moduleId;
        this.router.navigate(['/home/schema', firstModuleId]);
      }
    }, error => {
      console.error(`Error : ${error.message}`);
    })
  }

  /**
   * Function to get report list
   */
  public getreportList() {
    this.reportService.reportList().subscribe(reportList => {
      this.reportOb = of(reportList);
      this.reportList = reportList;
      if (this.reportList && !this.isPageReload) {
        const firstReportId = this.reportList[0].reportId;
        this.router.navigate(['home/report/dashboard', firstReportId]);
      }
    }, error => console.error(`Error : ${error}`));
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
        this.router.navigate(['', { outlets: { sb: 'sb/schema/create-schema/new' } }]);
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

  /**
   * Function to search schema from home primary nav
   * @param searchString schema string to be searched
   */
  searchSchema(searchString: string) {

    if (this.activatedPrimaryNav === 'schema' || this.activatedPrimaryNav === 'welcome') {
      if (searchString === null) {
        return this.searchModuleResults = this.moduleList;
      }
      this.searchModuleResults = this.moduleList.filter((module) => {
        module.moduleDesc = module.moduleDesc ? module.moduleDesc : 'untitled';
        if (module.moduleDesc.toLowerCase().includes(searchString.toLowerCase()) || this.searchForSchema(module, searchString)) {
          return module;
        }
      })
    }
    if (this.activatedPrimaryNav === 'report') {
      if (searchString) {
        this.reportOb = of(this.reportList.filter(fil => fil.reportName.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1));
      } else {
        this.reportOb = of(this.reportList);
      }
    }
  }

  /**
   * function to search for varient inside schema
   * @param schema schema obj
   * @param searchString string to be searched
   */
  searchForVarient(schema: SchemaListDetails, searchString: string) {
    let flag = false;
    schema.variants.forEach((variant) => {
      if (variant.variantName.toLowerCase().includes(searchString.toLowerCase())) {
        return flag = true;
      }
    })
    return flag;
  }

  /**
   * function to search for schema inside module
   * @param module module obj
   * @param searchString string to be searched
   */
  searchForSchema(module: SchemaListModuleList, searchString: string) {
    let flag = false;
    if (module.schemaLists) {
      module.schemaLists.forEach((schema) => {
        schema.schemaDescription = schema.schemaDescription ? schema.schemaDescription : 'untitled';
        if (schema.schemaDescription.toLowerCase().includes(searchString.toLowerCase())) {
          return flag = true;
        }
      })
    }
    return flag;
  }

  /**
   * function to check for the secondary navigation description and listing
   * @param url current url
   */
  checkDescOnReload(url: string){
    if (url.includes('/home/dash/welcome') || url.includes('/home/schema/schema-details')) {
      this.activatedPrimaryNav = 'welcome';
      this.getSchemaList();
    }
    else if (url.includes('/home/report')) {
      this.activatedPrimaryNav = 'report';
      this.getreportList();
    }
    else if (url.includes('/home/schema')) {
      this.activatedPrimaryNav = 'schema';
      this.getSchemaList();
    }
  }
}
