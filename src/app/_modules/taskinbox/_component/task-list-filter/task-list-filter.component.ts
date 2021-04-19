import { MatTreeFlattener, MatTreeFlatDataSource } from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { delay, take, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { of } from 'rxjs';
import { IFilterSettings } from './../task-list-datatable/task-list-datatable.component';
import { GlobaldialogService } from '@services/globaldialog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchComponent } from 'mdo-ui-library';

@Component({
  selector: 'pros-task-list-filter',
  templateUrl: './task-list-filter.component.html',
  styleUrls: ['./task-list-filter.component.scss'],
})
export class TaskListFilterComponent implements OnInit {
  node: string = null;
  activeFilter: IFilterSettings = null;
  currentFilterSettings: IFilterSettings[] = [];
  searchKey = '';
  optionsList = [
    { label: 'Filters', value: 'filters' },
    { label: 'Classifications', value: 'value2' },
  ];
  pageEvent = {
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  };
  infinteScrollLoading = false;

  @ViewChild('searchInput', { static: true }) searchInput: SearchComponent;

  treeFlattener;
  treeControl;

  dataSource;

  constructor(private router: Router, private route: ActivatedRoute, private glocalDialogService: GlobaldialogService) {
    this.treeFlattener = new MatTreeFlattener(
      this._transformer,
      (node) => node.level,
      (node) => node.expandable,
      (node) => node.fields
    );
    this.treeControl = new FlatTreeControl<ExampleFlatNode>(
      (node) => node.level,
      (node) => node.expandable
    );
    this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  }
  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.fields && node.fields.length > 0,
      name: node.fieldId,
      desc: node.fieldDesc,
      level,
    };
  };
  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;
  ngOnInit(): void {
    // let r = this.filterFields(
    //   [
    //     {
    //       fieldId: 'Customer',
    //       fieldDesc: 'Customer Order',
    //       picklist: '0',
    //       dataType: 'CHAR',
    //       fields: [{ fieldId: 'CustomerAddress', fieldDesc: 'Customer Address', picklist: '0', dataType: 'CHAR', fields: [] }],
    //     },
    //   ],
    //   'cust'
    // );
    // console.log('r', r);

    this.route.params.subscribe((param) => {
      this.node = param.node || null;
      this.loadData([]);
    });

    this.route.queryParams.pipe(take(1)).subscribe((queryParam) => {
      if (this.currentFilterSettings.length <= 0) {
        const decoded = atob(queryParam.f);
        if (decoded) {
          this.currentFilterSettings = JSON.parse(decoded) || [];
        }
      }
    });

    this.searchInput.valueChange
      .pipe(
        map((event: any) => {
          return event;
        }),
        debounceTime(1000),
        distinctUntilChanged()
      )
      .subscribe((text: string) => {
        if (text && text.length > 2) {
          this.resetPageEvent();
          const { pageIndex, pageSize, totalCount } = this.pageEvent;
          if (pageIndex * pageSize > totalCount) {
            this.infinteScrollLoading = false;
            return;
          }
          this.searchKey = text.toLowerCase();
          this.dataSource.data = [];
          this.loadData([]);
        } else if (!text) {
          this.resetPageEvent();
          const { pageIndex, pageSize, totalCount } = this.pageEvent;
          if (pageIndex * pageSize > totalCount) {
            this.infinteScrollLoading = false;
            return;
          }
          this.searchKey = text.toLowerCase();
          this.dataSource.data = [];
          this.loadData([]);
        }
      });
    this.scroll = this.scroll.bind(this);
    document.getElementById('mat-tree').addEventListener('scroll', this.scroll);
  }
  resetPageEvent() {
    this.pageEvent.pageIndex = 0;
    this.pageEvent.pageSize = 10;
    this.pageEvent.totalCount = 0;
  }
  scroll(event) {
    const scrollableHeight = event.target.scrollHeight;
    const scrolledHeight = event.target.offsetHeight + event.target.scrollTop;
    const ratio = scrolledHeight > 0 && (scrolledHeight * 100) / scrollableHeight;
    if (ratio >= 95 && ratio < 98 && !this.infinteScrollLoading) {
      this.pageEvent.pageIndex++;
      const { pageIndex, pageSize, totalCount } = this.pageEvent;
      if (pageIndex * pageSize > totalCount) {
        this.infinteScrollLoading = false;
        return;
      }
      this.infinteScrollLoading = true;
      this.loadData(this.dataSource.data);
    }
  }
  loadData(existingData: TreeNode[]) {
    const { pageIndex, pageSize, totalCount } = this.pageEvent;
    if (pageIndex * pageSize > totalCount) {
      this.infinteScrollLoading = false;
      return;
    }
    this.getLazyData(pageIndex, pageSize, this.searchKey).subscribe((resp) => {
      this.infinteScrollLoading = false;
      this.pageEvent.totalCount = resp.totalCount;
      existingData.push(...resp.data);
      this.dataSource.data = existingData;
    });
    // let data = treeData.slice(this.pageEvent.pageIndex * this.pageEvent.pageSize, (this.pageEvent.pageIndex + 1) * this.pageEvent.pageSize);
  }
  getLazyData(pageIndex, pageSize, value?: string) {
    if (value) {
      value = value.toLowerCase();
      const filteredData = treeData
        .map((d) => {
          const parentNode = {
            fieldId: d.moduleId,
            fieldDesc: d.moduleDesc,
            picklist: '',
            dataType: '',
            fields: this.filterFields(
              [...(d.fields.hdvs ? d.fields.hdvs : []), ...(d.fields.gvs ? d.fields.gvs : []), ...(d.fields.hyvs ? d.fields.hyvs : [])],
              value
            ),
          };
          return parentNode;
        })
        .slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
      return of({ data: filteredData, totalCount: treeData.length }).pipe(delay(1500));
    }
    const data = treeData.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
    const formattedDat = this.formatForTreeData(data || []);
    return of({ data: formattedDat, totalCount: treeData.length }).pipe(delay(1500));
  }
  close() {
    this.router.navigate([{ outlets: { sb: null } }], { queryParamsHandling: 'preserve' });
  }
  clearAllFilters() {
    this.glocalDialogService.confirm({ label: 'Are you sure to reset all filters ?' }, (resp) => {
      if (resp && resp === 'yes') {
        this.currentFilterSettings = [];
        this.activeFilter = null;
      }
    });
  }

  filterFields(treeNodes: TreeNode[], value: string) {
    return treeNodes
      .map((d) => {
        if (d && d.fields && d.fields.length > 0) {
          d.fields = this.filterFields(
            d.fields.filter((f) => f),
            value
          );
          return d;
        }
        return this.filterNode(d, value);
      })
      .filter((d) => d);
  }
  filterNode(treeNode: TreeNode, value: string) {
    if (treeNode && treeNode.fieldDesc.toLowerCase().indexOf(value) >= 0) {
      return treeNode;
    }
    return null;
  }

  private formatForTreeData(treeDatas: any[]) {
    const data = treeDatas.map((d) => {
      const parentNode = {
        fieldId: d.moduleId,
        fieldDesc: d.moduleDesc,
        picklist: '',
        dataType: '',
        fields: this.formatChildNodes(d.fields),
      };
      return parentNode;
    });
    return data;
  }
  private formatChildNodes(fields: FieldsObj) {
    let childNodes: TreeNode[] = [];
    childNodes = [...(fields.hdvs ? fields.hdvs : []), ...(fields.gvs ? fields.gvs : []), ...(fields.hyvs ? fields.hyvs : [])];
    return childNodes;
  }
}

export interface TreeNode {
  fieldId: string;
  fieldDesc: string;
  picklist: string;
  dataType: string;
  fields?: TreeNode[];
}
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  desc: string;
  level: number;
}
interface FieldsObj {
  hdvs?: TreeNode[];
  gvs?: TreeNode[];
  hyvs?: TreeNode[];
}
export const treeData = [
  {
    moduleId: '1034334',
    moduleDesc: 'Customer',
    fields: {
      hdvs: [
        {
          fieldId: 'cusId',
          fieldDesc: 'Customer id',
          picklist: '0',
          dataType: 'CHAR',
        },
        {
          fieldId: 'name',
          fieldDesc: 'Customer name',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
      gvs: [
        {
          fieldId: 'order',
          fieldDesc: 'Order grid',
          picklist: '0',
          dataType: 'CHAR',
          fields: [
            {
              fieldId: 'orderId',
              fieldDesc: 'Order id',
              picklist: '0',
              dataType: 'CHAR',
            },
            {
              fieldId: 'details',
              fieldDesc: 'Order details',
              picklist: '0',
              dataType: 'CHAR',
              fields: [
                {
                  fieldId: 'custAddress',
                  fieldDesc: 'Customer Address',
                  picklist: '0',
                  dataType: 'CHAR',
                },
              ],
            },
          ],
        },
      ],
      hyvs: [
        {
          fieldId: 'addrees',
          fieldDesc: 'Address',
          picklist: '0',
          dataType: 'CHAR',
          fields: [
            {
              fieldId: 'id',
              fieldDesc: 'Address id',
              picklist: '0',
              dataType: 'CHAR',
            },
            {
              fieldId: 'add_details',
              fieldDesc: 'Address details',
              picklist: '0',
              dataType: 'CHAR',
            },
          ],
        },
      ],
    },
  },
  {
    moduleId: '1034335',
    moduleDesc: 'Order',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem',
          fieldDesc: 'Order Item',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
      gvs: [
        {
          fieldId: 'Item',
          fieldDesc: 'Item',
          picklist: '0',
          dataType: 'CHAR',
          fields: [
            {
              fieldId: 'itemId',
              fieldDesc: 'Item id ',
              picklist: '0',
              dataType: 'CHAR',
            },
            {
              fieldId: 'itemDetail',
              fieldDesc: 'Ite, details',
              picklist: '0',
              dataType: 'CHAR',
            },
          ],
        },
      ],
      hyvs: [
        {
          fieldId: 'orderAddrees',
          fieldDesc: 'Order Address',
          picklist: '0',
          dataType: 'CHAR',
          fields: [
            {
              fieldId: 'orderAddressId',
              fieldDesc: 'Order Address id',
              picklist: '0',
              dataType: 'CHAR',
            },
            {
              fieldId: 'orderAddressPostCode',
              fieldDesc: 'Order Address Post Code',
              picklist: '0',
              dataType: 'CHAR',
            },
          ],
        },
      ],
    },
  },
  {
    moduleId: '1034336',
    moduleDesc: 'Order 2',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem2',
          fieldDesc: 'Order Item 2',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
      gvs: [
        {
          fieldId: 'Item2',
          fieldDesc: 'Item 2',
          picklist: '0',
          dataType: 'CHAR',
          fields: [
            {
              fieldId: 'itemId2',
              fieldDesc: 'Item id 2',
              picklist: '0',
              dataType: 'CHAR',
            },
            {
              fieldId: 'itemDetail2',
              fieldDesc: 'Item details 2',
              picklist: '0',
              dataType: 'CHAR',
            },
          ],
        },
      ],
      hyvs: [
        {
          fieldId: 'orderAddrees2',
          fieldDesc: 'Order Address 2',
          picklist: '0',
          dataType: 'CHAR',
          fields: [
            {
              fieldId: 'orderAddressId',
              fieldDesc: 'Order Address id 2',
              picklist: '0',
              dataType: 'CHAR',
            },
            {
              fieldId: 'orderAddressPostCode',
              fieldDesc: 'Order Address Post Code 2',
              picklist: '0',
              dataType: 'CHAR',
            },
          ],
        },
      ],
    },
  },
  {
    moduleId: '1034337',
    moduleDesc: 'Order 3',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem3',
          fieldDesc: 'Order Item 3',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034338',
    moduleDesc: 'Order 4',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem4',
          fieldDesc: 'Order Item 4',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034339',
    moduleDesc: 'Order 5',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem5',
          fieldDesc: 'Order Item 5',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034340',
    moduleDesc: 'Order 6',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem6',
          fieldDesc: 'Order Item 6',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034341',
    moduleDesc: 'Order 7',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem7',
          fieldDesc: 'Order Item 7',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034342',
    moduleDesc: 'Order 8',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem8',
          fieldDesc: 'Order Item 8',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034343',
    moduleDesc: 'Order 9',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem9',
          fieldDesc: 'Order Item 9',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034344',
    moduleDesc: 'Order 10',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem10',
          fieldDesc: 'Order Item 10',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034345',
    moduleDesc: 'Order 11',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem11',
          fieldDesc: 'Order Item 11',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034346',
    moduleDesc: 'Order 12',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem12',
          fieldDesc: 'Order Item 12',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
  {
    moduleId: '1034347',
    moduleDesc: 'Order 13',
    fields: {
      hdvs: [
        {
          fieldId: 'orderItem13',
          fieldDesc: 'Order Item 13',
          picklist: '0',
          dataType: 'CHAR',
        },
      ],
    },
  },
];
