import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { CatalogCheckService } from '@services/home/schema/catalog-check.service';
import { GroupDetails, RequestForGroupList, SearchAfter, TableDataSource } from '@models/schema/duplicacy';
import { BehaviorSubject } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { Userdetails } from '@models/userdetails';
import { UserService } from '@services/user/userservice.service';


@Component({
  selector: 'pros-group-data-table',
  templateUrl: './group-data-table.component.html',
  styleUrls: ['./group-data-table.component.scss']
})
export class GroupDataTableComponent implements OnInit, OnChanges, AfterViewInit {

  @Input()
  moduleId: string;

  @Input()
  schemaId: string;

  @Input()
  variantId: string;

  @Input()
  runId: string;

  @Input()
  activeTab: string;

  @Output()
  groupChange: EventEmitter<any> = new EventEmitter();

  @ViewChild(MatSort) matSort: MatSort;

  sortOrder: any = {};


  dataSource = new TableDataSource<GroupDetails>();
  totalCount: number;
  startColumns = ['check', 'settings', 'avatar', 'groupName'];
  displayedFields = new BehaviorSubject<string[]>(this.startColumns);
  fieldsMetadataList: any;

  BLANK_GROUP = {groupId: '', groupKey: ''} ;

  /**
   * Make table header row visiable
   */
  tableHeaderActBtn : string[] = [];

  selection = new SelectionModel<any>(true, []);

  lastScrollTop: number;

  activeGroupId: string;

  /**
   * data fetch page index
   */
  pageIndex = 0;
  searchAfter : SearchAfter  = new SearchAfter();
  userDetails: Userdetails = new Userdetails();

  constructor(private catalogService: CatalogCheckService,
    private userService: UserService) { }

  ngOnChanges(changes: SimpleChanges): void {

    let refresh = false;
    if (changes && changes.schemaId && changes.schemaId.previousValue !== changes.schemaId.currentValue) {
      refresh = true;
    }

    /* if (changes && changes.variantId && changes.variantId.previousValue !== changes.variantId.currentValue) {
      refresh = true;
    } */

    if (changes && changes.activeTab && changes.activeTab.previousValue !== changes.activeTab.currentValue) {
      refresh = true;
    }

    if (refresh) {
      this.getDuplicacyGroupsList();
    }


  }

  ngOnInit(): void {

    /**
     * While row selection change then control the header actions..
     */
    this.selection.changed.subscribe(res=>{
      if(res.source.selected.length >0) {
        this.tableHeaderActBtn = ['common_actions_header'];
      } else {
        this.tableHeaderActBtn = [];
      }
    });


    this.userService.getUserDetails().subscribe(res => {
      this.userDetails = res;
    }, error => console.error(`Error : ${error.message}`));

  }

  ngAfterViewInit(){

    this.matSort.sortChange.subscribe(s => {

      this.sortOrder = {};
      if (s.direction) {
        this.sortOrder[s.active] = s.direction;
      }

      this.getDuplicacyGroupsList();
    });

  }


  getDuplicacyGroupsList(isLoadingMore?){

    if (isLoadingMore) {
      this.pageIndex++;
    } else {
      this.pageIndex = 0;
    }

    const request = new RequestForGroupList();
    request.schemaId = this.schemaId;
    request.plantCode = '0';
    request.runId = this.runId || '';
    request.page = this.pageIndex;
    request.size = 20;
    request.responseStatus = this.activeTab;
    request.searchAfter =this.searchAfter;
    this.catalogService.getAllGroupIds(request)
      .subscribe(groups => {
        if (isLoadingMore) {
          this.dataSource.data = this.dataSource.data.concat(groups.groups);
          this.searchAfter = groups.searchAfter;
          console.log(this.searchAfter);
        }
        else {
          this.dataSource.data = groups.groups;
          this.dataSource.totalCount = groups.groups.length;
          this.searchAfter = groups.searchAfter;
          const firstRow = this.dataSource.data[0] ? this.dataSource.data[0] : this.BLANK_GROUP ;
          this.rowGroupClicked(firstRow);
        }
        console.log('Duplicacy groups list ',groups.groups);
      }, error => {

        if (!isLoadingMore) {
        this.dataSource.data = [];
        this.dataSource.totalCount = 0;
        this.rowGroupClicked(this.BLANK_GROUP);
        }
        console.error(`Error ${error.message}`);

      });
  }


  rowGroupClicked(row) {
    console.log(row);
    this.activeGroupId = row.groupId;
    this.groupChange.emit(row);

  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  onScroll(event){
    console.log('colled');
    if (event.target.clientHeight + event.target.scrollTop >= event.target.scrollHeight) {
      if( event.target.scrollTop > this.lastScrollTop){
        console.log('End ', event.target.scrollTop);
        this.getDuplicacyGroupsList(true);
      }

    }
    this.lastScrollTop = event.target.scrollTop;
  }

}
