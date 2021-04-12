import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output, ViewChild, OnDestroy, ViewChildren, AfterViewInit, QueryList } from '@angular/core';
import { SchemalistService } from '@services/home/schema/schemalist.service';
import { SchemaListModuleList, SchemaListDetails } from '@models/schema/schemalist';
import { SchemaService } from '@services/home/schema.service';
import { ReportService } from '@modules/report/_service/report.service';
import { ReportList } from '@modules/report/report-list/report-list.component';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Observable, of, Subscription } from 'rxjs';
import { Router, Event, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { UserService } from '@services/user/userservice.service';
import { ListService } from '@services/list/list.service';
import { distinctUntilChanged } from 'rxjs/operators';
import { CreateUpdateSchema } from '@modules/admin/_components/module/business-rules/business-rules.modal';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SecondaynavType } from '@models/menu-navigation';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CoreService } from '@services/core/core.service';
import { ObjectType } from '@models/core/coreModel';
import { MatExpansionPanel } from '@angular/material/expansion';

@Component({
  selector: 'pros-secondary-navbar',
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.scss']
})
export class SecondaryNavbarComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * List of Mat expansion panels available in DOM
   */
  @ViewChildren(MatExpansionPanel) expansionPanel: QueryList<any>;

  /**
   * Handles Show / Hide of Tasks list in other pages except Home page
   */
  showTasksList = false;

  /**
   * Highlights selected task from Tasks list and search / filter under tasks list
   */
  selectedTask;

  public moduleList: SchemaListModuleList[] = [];
  objectTypeList: ObjectType[] = [];
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

  /**
   * data list observal ..
   */
   objectTypeObs: Observable<ObjectType[]> = of([]);

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

  /**
   * Tasks list for secondary menu
   */
  taskList = [];

  /**
   * Mockdata for tasks list in home page side menu
   */
  mockTaskList = [
    {
      label: 'Inbox',
      id: 'inbox',
      rec_cnt: 2,
      new_feed_cnt: 1,
      hasNewFeeds: true,
      childs: [
        {
          label: 'Test Search / Filter for Tasks',
          id: '1test1',
          rec_cnt: 2,
          new_feed_cnt: 1,
          hasNewFeeds: true
        },
        {
          label: 'Test2',
          id: '1test2',
          rec_cnt: 5,
          new_feed_cnt: 1,
          hasNewFeeds: true
        }
      ]
    },
    {
      label: 'In Workflow',
      id: 'in_workflow',
      rec_cnt: 5,
      new_feed_cnt: 2,
      hasNewFeeds: true,
      childs: []
    },
    {
      label: 'Rejected',
      id: 'rejected',
      rec_cnt: 10,
      new_feed_cnt: 1,
      hasNewFeeds: true,
      childs: [
        {
          label: 'Test1',
          id: '2test1',
          rec_cnt: 10,
          new_feed_cnt: 0,
          hasNewFeeds: false
        },
        {
          label: 'Test2',
          id: '2test2',
          rec_cnt: 15,
          new_feed_cnt: 1,
          hasNewFeeds: true
        }
      ]
    },
    {
      label: 'Completed',
      id: 'completed',
      rec_cnt: 15,
      new_feed_cnt: 0,
      hasNewFeeds: false,
      childs: []
    },
    {
      label: 'Draft',
      id: 'draft',
      rec_cnt: 5,
      new_feed_cnt: 0,
      hasNewFeeds: false,
      childs: []
    }
  ];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private schemaListService: SchemalistService,
    private schemaService: SchemaService,
    private reportService: ReportService,
    private sharedService: SharedServiceService,
    private userService: UserService,
    private listService: ListService,
    private matSnackBar: MatSnackBar,
    private coreService: CoreService
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

          case 'list':
          this.getAllObjectType();
          break;

        default:
          break;
      }
    }
  }

  ngOnInit(): void {
    this.sharedService.getReportListData().subscribe(res => {
      if (res) {
        this.isPageReload = false;
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
    this.taskList = this.mockTaskList;
    const orderList = localStorage.getItem('tasllist-feeds-order');
    if (this.taskList.length && orderList) {
      this.setTaskListOrder(orderList);
    }
    
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const url = this.router.url;
        if (url.includes('home/task')) {
          this.showTasksList = true;
        } else {
          this.showTasksList = false;
          this.selectedTask = "";
        }
      }
    });
  }

  ngAfterViewInit() {
    this.expandSearchFilterInCurrentUrl();
  }

  /**
   * Sets order of tasks and child search / filter feeds
   * @param list task order list
   */
  setTaskListOrder(list) {
    const decodedList = atob(list);
    const parsedList = decodedList ? JSON.parse(decodedList) : '';
    if (Object.keys(parsedList).length) {
      this.taskList = this.sortTaskById(this.taskList, parsedList);
      this.taskList.forEach((x, i) => {
        if (x.childs && x.childs.length) {
          this.taskList[i].childs = this.sortTaskById(x.childs, parsedList);
        }
      });
    }
  }

  /**
   * Expands search / filter from tasks
   */
  expandSearchFilterInCurrentUrl() {
    try {
      let taskID;
      let openPanel = false;
      this.activatedRoute.queryParams.subscribe((param) => {
        const url = this.router.url;
        if (param['s'] && url.includes('/home/task')) {
          this.showTasksList = true;
          this.selectedTask = param['s'];
          taskID = url.split('?')[0].split('/')[3] || '';
          const task = this.taskList.filter((x) => x.id === taskID);
          if (task.length && task[0]['childs'] && task[0]['childs'].length) {
            const childs = task[0]['childs'];
            const child = childs.filter((y) => y.id === param['s']);
            if (child.length) {
              openPanel = true;
            }
          }
        } else if (url.includes('/home/task')) {
          this.showTasksList = true;
          taskID = url.split('?')[0].split('/')[3] || '';
          this.selectedTask = taskID;
        }
      });

      if (taskID && openPanel) {
        setTimeout(() => {
          const domPanelList = document.querySelectorAll('mat-expansion-panel');
          domPanelList.forEach((panel, ind) => {
            if (panel['id'] && (panel['id'] === taskID)) {
              const panelID = `cdk-accordion-child-${ind}`;
              this.expansionPanel.forEach((el) => {
                if (el['id'] === panelID) {
                  setTimeout(() => {
                    el.open();
                  }, 0);
                }
              });
            }
          });
        }, 0);
      }
    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Sorts Tasks By ID
   * @param list task list
   * @param orderList task order list
   */
  sortTaskById(list, orderList) {
    try {
      list.sort((a, b) => {
        const val1 = a.id ? ((orderList[a.id] || orderList[a.id] === 0) ? orderList[a.id] : Infinity) : Infinity;
        const val2 = b.id ? ((orderList[b.id] || orderList[b.id] === 0) ? orderList[b.id] : Infinity) : Infinity;
        if (val1 < val2) {
          return -1;
        } else {
          return 1;
        }
      });
    } catch (e) {
      console.log(e);
    }

    return list;
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
        } else if(this.reportList.length === 0 && !this.isPageReload) {
          this.router.navigate(['home/report/dashboard/new']);
        }
      }, error => console.error(`Error : ${error}`));
      this.subscriptions.push(subs);
    });
    this.subscriptions.push(subscription);
  }

  /**
   * Function to get all list modules
   */
   public getAllObjectType(){
    this.coreService.getAllObjectType().subscribe(modules => {
      this.objectTypeList = modules;
      this.objectTypeObs = of(modules);
      if(modules && modules.length && !this.isPageReload) {
          const firstModuleId = this.objectTypeList[0].objectid;
          this.router.navigate(['/home/list/datatable', firstModuleId]);
      }
    }, error => {
      console.error(`Error:: ${error.message}`);
    })
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
      case 'list':
        res = 'Data';
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
    } else {
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
    if (this.activatedPrimaryNav === 'list') {
      if (searchString) {
        this.objectTypeObs = of(this.objectTypeList.filter(fil => fil.objectdesc.toLocaleLowerCase().indexOf(searchString.toLocaleLowerCase()) !== -1));
      } else {
        this.objectTypeObs = of(this.objectTypeList);
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
    else if (url.includes('/home/list')) {
      this.activatedPrimaryNav = 'list';
      this.getAllObjectType();
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

  /**
   * While drag and drop on list elements
   * @param event dragable element
   */
  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    }
  }

  /**
   * Drag and drop for task list
   * @param ev draggable element
   * @param ind parent index of dragged child
   */
  dropTask(ev: CdkDragDrop<string[]>, ind?) {
    if ((ev.previousContainer === ev.container) && (ev.previousIndex !== ev.currentIndex)) {
      if (ind) {
        moveItemInArray(this.taskList[ind].childs, ev.previousIndex, ev.currentIndex);
      } else {
        moveItemInArray(this.taskList, ev.previousIndex, ev.currentIndex);
      }
      this.updateTaskListInStorage(this.taskList);
    }
  }

  /**
   * Update task list order in local storage
   * @param list updated tasks list
   */
  updateTaskListInStorage(list) {
    try {
      const newOrderList  = {};
      list.forEach((x, i) => {
        if (x.id) {
          newOrderList[x.id] = i;
        }
        if (x.childs && x.childs.length) {
          x.childs.forEach((y, j) => {
            if (y.id) {
              newOrderList[y.id] = j;
            }
          });
        }
      });
      localStorage.setItem('tasllist-feeds-order', btoa(JSON.stringify(newOrderList)));
    } catch (e) {
      console.log(e);
    }
  }
}