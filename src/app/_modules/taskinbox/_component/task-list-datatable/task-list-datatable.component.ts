import { takeUntil } from 'rxjs/operators';
import { SharedServiceService } from './../../../shared/_services/shared-service.service';
import { ViewsPage } from '@models/list-page/listpage';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';

export interface PeriodicElement {
  Records: string;
  setting: number;
  description: number;
  labels: string;
  sent: string;
  dueby: string;
  requestby: string;
  sentby: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {
    setting: 1,
    Records: 'Hydrogen',
    description: 1.0079,
    labels: 'H',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 2,
    Records: 'Helium',
    description: 4.0026,
    labels: 'He',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 3,
    Records: 'Lithium',
    description: 6.941,
    labels: 'Li',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 4,
    Records: 'Beryllium',
    description: 9.0122,
    labels: 'Be',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 5,
    Records: 'Boron',
    description: 10.811,
    labels: 'B',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 6,
    Records: 'Carbon',
    description: 12.0107,
    labels: 'C',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 7,
    Records: 'Nitrogen',
    description: 14.0067,
    labels: 'N',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 8,
    Records: 'Oxygen',
    description: 15.9994,
    labels: 'O',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 9,
    Records: 'Fluorine',
    description: 18.9984,
    labels: 'F',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
  {
    setting: 10,
    Records: 'Neon',
    description: 20.1797,
    labels: 'Ne',
    sent: 'L',
    dueby: 'L',
    requestby: 'L',
    sentby: 'L',
  },
];

export const NODEFIELDS: { [node: string]: { fldId: string; fldDesc: string }[] } = {
  inbox: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
  in_workflow: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
  rejected: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
  draft: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'sent',
      fldDesc: 'Sent',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
  ],
  completed: [
    {
      fldId: 'description',
      fldDesc: 'Description',
    },
    {
      fldId: 'labels',
      fldDesc: 'Labels',
    },
    {
      fldId: 'dueby',
      fldDesc: 'Due by',
    },
    {
      fldId: 'requestby',
      fldDesc: 'Request by',
    },
    {
      fldId: 'sentby',
      fldDesc: 'Sent by',
    },
  ],
};

export const nodeChips: {
  [node: string]: { chip: string; value: any; icon?: string; type?: string; hasMenu: boolean; menuItems?: string[] }[];
} = {
  inbox: [
    {
      chip: 'Bookmarked',
      value: 2,
      icon: 'star',
      hasMenu: false,
    },
    {
      chip: 'Important',
      value: 4,
      icon: 'long-arrow-up',
      hasMenu: false,
    },
    {
      chip: 'Due',
      value: 4,
      hasMenu: false,
    },
    {
      chip: 'Unread',
      value: 3,
      hasMenu: false,
    },
    {
      chip: 'Label',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'H', 'He'],
    },
    {
      chip: 'Sent',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'Long', 'Short'],
    },
    {
      chip: 'Requestedby',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'Fred', 'Shred'],
    },
  ],
  in_workflow: [
    {
      chip: 'Bookmarked',
      value: 2,
      icon: 'star',
      hasMenu: false,
    },
    {
      chip: 'Important',
      value: 4,
      icon: 'long-arrow-up',
      hasMenu: false,
    },
    {
      chip: 'Unread',
      value: 3,
      hasMenu: false,
    },
    {
      chip: 'Label',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'H', 'He'],
    },
    {
      chip: 'Sent',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'Long', 'Short'],
    },
    {
      chip: 'Requestedby',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'Fred', 'Shred'],
    },
  ],
  rejected: [
    {
      chip: 'Bookmarked',
      value: 2,
      icon: 'star',
      hasMenu: false,
    },
    {
      chip: 'Important',
      value: 4,
      icon: 'long-arrow-up',
      hasMenu: false,
    },
    {
      chip: 'Due',
      value: 4,
      hasMenu: false,
    },
    {
      chip: 'Unread',
      value: 3,
      hasMenu: false,
    },
    {
      chip: 'Sent',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'Long', 'Short'],
    },
    {
      chip: 'Requestedby',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'Fred', 'Shred'],
    },
  ],
  draft: [
    {
      chip: 'Bookmarked',
      value: 2,
      icon: 'star',
      hasMenu: false,
    },
    {
      chip: 'Important',
      value: 4,
      icon: 'long-arrow-up',
      hasMenu: false,
    },
    {
      chip: 'Due',
      value: 4,
      hasMenu: false,
    },
    {
      chip: 'Unread',
      value: 3,
      hasMenu: false,
    },
    {
      chip: 'Label',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'H', 'He'],
    },
    {
      chip: 'Sent',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['All', 'Long', 'Short'],
    },
  ],
  completed: [
    {
      chip: 'Bookmarked',
      value: 2,
      icon: 'star',
      hasMenu: false,
    },
    {
      chip: 'Important',
      value: 4,
      icon: 'long-arrow-up',
      hasMenu: false,
    },
    {
      chip: 'Due',
      value: 4,
      hasMenu: false,
    },
    {
      chip: 'Label',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['H', 'He'],
    },
    {
      chip: 'Sent',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['Long', 'Short'],
    },
    {
      chip: 'Requestedby',
      value: '',
      hasMenu: true,
      type: 'info',
      menuItems: ['Fred', 'Shred'],
    },
  ],
};

export const nodeChipsMenuItems = {
  Label: ['H', 'He'],
  Sent: ['Long', 'Short'],
  Requestedby: ['Fred', 'Shred'],
};

@Component({
  selector: 'pros-task-list-datatable',
  templateUrl: './task-list-datatable.component.html',
  styleUrls: ['./task-list-datatable.component.scss'],
})
export class TaskListDatatableComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = [
    // 'select',
    // 'setting',
    // 'Records',
    // 'description',
    // 'labels',
    // 'sent',
    // 'dueby',
    // 'requestby',
    // 'sentby',
  ];
  staticColumns: string[] = ['select', 'setting', 'Records'];
  dataSource: MatTableDataSource<PeriodicElement>;
  selection: SelectionModel<PeriodicElement>;
  node: string = null;
  nodeColumns: { fldId: string; fldDesc: string }[] = [];
  currentNodeFilterChips: { chip: string; value: any; icon?: string; type?: string; hasMenu: boolean; menuItems?: string[] }[] = [];
  filteredNodeChipsMenuItems = Object.assign({}, nodeChipsMenuItems);
  savedSearchParameters: string = null;
  inlineFilters: string = null;
  pageEvent: { pageIndex: number; pageSize: number; length: number } = {
    pageIndex: 0,
    pageSize: 10,
    length: 0, // totalCount
  };
  isLoadingResults = false;

  viewsList: ViewsPage = new ViewsPage();
  unsubscribeAll$: Subject<boolean> = new Subject<boolean>();

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute, private router: Router, private sharedServices: SharedServiceService) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.node = param.node || null;
      this.nodeColumns = NODEFIELDS[this.node];
      this.updateTableColumns();
      this.updateNodeChips();
    });
    this.route.queryParams.subscribe((queryParam) => {
      this.savedSearchParameters = queryParam.s || null;
      this.inlineFilters = queryParam.f || null;
    });
    this.sharedServices
      .gettaskinboxViewDetailsData()
      .pipe(takeUntil(this.unsubscribeAll$))
      .subscribe((resp) => {
        if (resp && resp.node === this.node) {
          this.nodeColumns = resp.viewDetails;
          this.updateTableColumns();
        } else {
          this.updateTableColumns();
        }
      });
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      // this.paginator.pageIndex = 0;
      this.pageEvent.pageIndex = 0;
    });
  }

  updateTableColumns() {
    this.displayedColumns = this.nodeColumns.map((d) => d.fldId);
    this.displayedColumns.unshift('select', 'setting', 'Records');
    this.getTableData();
  }
  updateNodeChips() {
    this.currentNodeFilterChips = nodeChips[this.node];
  }
  setChipValue(chip: { chip: string; value: any; icon?: string; type?: string; hasMenu: boolean; menuItems?: string[] }, item: any) {
    this.currentNodeFilterChips = this.currentNodeFilterChips.map((d) => {
      if (d.chip === chip.chip) {
        const currentValues: string[] = d.value.split(',').filter((v) => v);
        const index = currentValues.indexOf(item);
        if (index >= 0) {
          currentValues.splice(index, 1);
        } else {
          currentValues.push(item);
        }
        d.value = currentValues.join(',');
      } else {
        d.value = '';
      }
      return d;
    });
  }
  filterModulesMenu(event, chip) {
    const items: string[] = nodeChipsMenuItems[chip] || [];
    const filtered = items.filter((d) => d.toLowerCase().includes(event.toLowerCase()));
    this.filteredNodeChipsMenuItems[chip] = filtered;
  }
  getTableData() {
    this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
    this.selection = new SelectionModel<PeriodicElement>(true, []);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    // const numSelected = this.selection.selected.length;
    // const numRows = this.dataSource.docLength();
    // return numSelected === numRows;
    return false;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    // this.isAllSelected() ? this.selection.clear() : this.dataSource.docValue().forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
  }

  onPageChange(event: PageEvent) {
    this.pageEvent.pageIndex = event.pageIndex;
    // this.getTableData();
  }
  isStaticCol(dynCol) {
    return this.staticColumns.includes(dynCol);
  }
  getFieldDesc(dynCol) {
    const field = this.nodeColumns.find((f) => f.fldId === dynCol);
    return field ? field.fldDesc || 'Unkown' : dynCol || 'Unkown';
  }

  openTableViewSettings() {
    this.router.navigate([{ outlets: { sb: `sb/task/view/${this.node}` } }], { queryParamsHandling: 'preserve' });
  }
  ngOnDestroy() {
    this.unsubscribeAll$.next(true);
    this.unsubscribeAll$.unsubscribe();
  }
}
