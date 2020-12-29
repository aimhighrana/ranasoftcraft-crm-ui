import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, ViewChild, OnDestroy } from '@angular/core';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList, SchemaListDetails } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { ReportService } from '@modules/report/_service/report.service';
import { ReportList } from '@modules/report/report-list/report-list.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Observable, of, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { UserService } from '@services/user/userservice.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { CreateUpdateSchema } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecondaynavType } from '@models/menu-navigation';

@Component({
  selector: 'pros-secondary-navbar',
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.scss']
})
export class SecondaryNavbarComponent implements OnInit, OnChanges, OnDestroy {

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
   * filtered modules for schema create menu
   */
  filteredModulesMenu: SchemaListModuleList[] = [];

  /**
   * report list observal ..
   */
  reportOb: Observable<ReportList[]> = of([]);

  @Input()
  activatedPrimaryNav: string;

  /**
   * icon arrow value
   */
  arrowIcon = 'chevron-left';

  /** To check page reloaded or not */
  isPageReload = true;

  /**
   * Emitter to emit sidebar toggleing
   */
  @Output() toggleEmitter: EventEmitter<{}> = new EventEmitter<{}>();

  @ViewChild('schemaSearchInput') schemaSearchInput : SearchInputComponent;

  /**
   * subscription array to hold all services subscriptions
   */
  subscriptions: Subscription[] = [];

  activeMenuItemId = '';

  constructor(
    private router: Router,
    private schemaListService: SchemalistService,
    private schemaService: SchemaService,
    private reportService: ReportService,
    private sharedService: SharedServiceService,
    private userService: UserService,
    private matSnackBar: MatSnackBar
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.activatedPrimaryNav && changes.activatedPrimaryNav.previousValue !== changes.activatedPrimaryNav.currentValue && changes.activatedPrimaryNav.previousValue !== undefined) {
      this.activatedPrimaryNav = changes.activatedPrimaryNav.currentValue;
      this.isPageReload = false;
      if (this.schemaSearchInput){
        this.schemaSearchInput.clearSearch();
      }
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

    this.sharedService.isSecondaryNavRefresh().subscribe(refreshDetails => {
      if (refreshDetails.activeMenu === SecondaynavType.schema) {
        this.activeMenuItemId = refreshDetails.activeMenuItemId || '';
        this.isPageReload = refreshDetails.isPageReload;
        this.getSchemaList();
      }
    })

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
    const subscription = this.schemaService.getSchemaWithVariants().subscribe(res => {
      this.dataIntillegences.length = 0;
      this.dataIntillegences.push(...res);
      this.searchSchemaResults = this.dataIntillegences;
    }, error => console.error(`Error : ${error.message}`));
    this.subscriptions.push(subscription);
  }

  /**
   * Get all schemas ..
   */
  public getSchemaList() {
    const subscription = this.schemaListService.getSchemaList().subscribe((moduleList) => {
      this.moduleList = moduleList;
      this.searchModuleResults = this.moduleList;
      this.filteredModulesMenu = this.moduleList;
      if (this.moduleList && this.activatedPrimaryNav === 'schema') {
        if ( !this.isPageReload ) {
          const firstModuleId = this.moduleList[0].moduleId;
          this.router.navigate(['/home/schema', firstModuleId]);
        }
        else {
          const activeModule = this.moduleList.find(module => this.router.url.includes(module.moduleId));
          if (activeModule) {
            this.activeMenuItemId = activeModule.moduleId;
            this.scrollPanelToTop(activeModule.moduleId);
          }
        }
      }

    }, error => {
      console.error(`Error : ${error.message}`);
    })
    this.subscriptions.push(subscription);
  }

  /**
   * Function to get report list
   */
  public getreportList() {
    const subscription = this.userService.getUserDetails().pipe(distinctUntilChanged()).subscribe(user=>{
      const subs = this.reportService.reportList(user.plantCode, user.currentRoleId).subscribe(reportList => {
        this.reportOb = of(reportList);
        this.reportList = reportList;
        if (this.reportList.length > 0 && !this.isPageReload) {
          const firstReportId = this.reportList[0].reportId;
          this.router.navigate(['home/report/dashboard', firstReportId]);
        } else {
          this.router.navigate(['home/report/dashboard/new']);
        }
      }, error => console.error(`Error : ${error}`));
      this.subscriptions.push(subs);
    });
    this.subscriptions.push(subscription);
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
    if (this.arrowIcon === 'chevron-left') {
      this.arrowIcon = 'chevron-right';
    } else if (this.arrowIcon === 'chevron-right') {
      this.arrowIcon = 'chevron-left'
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
      this.searchModuleResults = [];
      this.moduleList.forEach((module) => {
        module.moduleDesc = module.moduleDesc ? module.moduleDesc : 'untitled';
        if (module.moduleDesc.toLowerCase().includes(searchString.toLowerCase())) {
          this.searchModuleResults.push(module);
        } else {
          const schemaLists = this.searchForSchema(module, searchString);
          if (schemaLists.length) this.searchModuleResults.push({...module, schemaLists}) ;
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
  searchForSchema(module: SchemaListModuleList, searchString: string) : SchemaListDetails[] {
    const searchResult : SchemaListDetails[] = [];
    if (module.schemaLists) {
      module.schemaLists.forEach((schema) => {
        schema.schemaDescription = schema.schemaDescription ? schema.schemaDescription : 'untitled';
        if (schema.schemaDescription.toLowerCase().includes(searchString.toLowerCase())) {
          searchResult.push(schema);
        }
      })
    }
    return searchResult;
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

  /**
   * Function to search modules from global search
   * @param searchString: string to be searched for modules.
   */
  filterModulesMenu(searchString){
    if (!searchString){
      this.filteredModulesMenu = this.moduleList;
      return;
    }
    this.filteredModulesMenu = this.moduleList.filter(module => {
      module.moduleDesc = module.moduleDesc ? module.moduleDesc : 'untitled';
      return module.moduleDesc.toLowerCase().includes(searchString.toLowerCase());
    })
  }

  /**
   * Function to create new schema
   * @param moduleId: ID of module for which schema needs to be created.
   */
  createNewSchema(moduleId: string) {
    const schemaReq: CreateUpdateSchema = new CreateUpdateSchema();
    schemaReq.schemaId = '';
    schemaReq.moduleId = moduleId;
    schemaReq.schemaThreshold = '0';
    schemaReq.discription = this.checkNewSchemaCount(moduleId);

    const subscription = this.schemaService.createUpdateSchema(schemaReq).subscribe((response) => {
      const schemaId: string = response;
      this.matSnackBar.open('Schema created successfully.', 'Okay', {
        duration: 2000
      })

      this.sharedService.setRefreshSecondaryNav(SecondaynavType.schema, true, moduleId);

      // navigate to the schema-info page of new-schema;
      this.router.navigate([`home/schema/schema-info/${moduleId}/${schemaId}`]);
    }, (error) => {
      this.matSnackBar.open('Something went wrong.', 'Okay', {
        duration: 2000
      })
    })
    this.subscriptions.push(subscription);
  }

  /**
   * Function to check new schema count
   * @param moduleId module id
   */
  checkNewSchemaCount(moduleId: string) {
    const findModule:SchemaListModuleList = this.moduleList.filter((module) => module.moduleId === moduleId)[0];
    const newSchemaArr = findModule.schemaLists.filter((schema) => {
        schema.schemaDescription = schema.schemaDescription ? schema.schemaDescription : 'untitled';
        return schema.schemaDescription.toLocaleLowerCase().startsWith('new schema');
    });
    return newSchemaArr.length>0 ? `New schema ${newSchemaArr.length + 1}` : `New schema`;
  }

  scrollPanelToTop(panelId) {

    setTimeout(() => {
      const activeMenuItem = document.getElementById(panelId);
      activeMenuItem.scrollIntoView();
    }, 300)
  }

  isActiveLink(link) {
    return this.router.url.includes(link);
  }

  /**
   * ANGULAR LIFECYCLE HOOK
   * Called once, before the instance is destroyed.
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    })
  }
}