import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTree, MatTreeNestedDataSource } from '@angular/material/tree';
import { WidgetService } from '@services/widgets/widget.service';
import { UserService } from '@services/user/userservice.service';
import { distinctUntilChanged } from 'rxjs/operators';

export class TreeModel {
  nodeId: string;
  nodeDesc: string;
  child: Array<TreeModel>;
  checked: boolean;
  expanded: boolean;
}

@Component({
  selector: 'pros-hierarchy-filter',
  templateUrl: './hierarchy-filter.component.html',
  styleUrls: ['./hierarchy-filter.component.scss']
})

export class HierarchyFilterComponent implements OnInit, OnChanges {


  @ViewChild('tree') tree: MatTree<any>;

  count = 0;
  /**
   * count of total childs for parent Node
   */
  totalChild = 0;
  nestedTreeControl: NestedTreeControl<TreeModel>;
  nestedDataSource: MatTreeNestedDataSource<TreeModel>;

  @Input() fieldId = '';
  @Input() topLocation = '';
  @Input() searchString = '';
  @Input() searchFunc = '';
  @Input() clearFilterClicked: boolean;

  /**
   * To emit selected nodes to parent
   */
  @Output() selectionChange = new EventEmitter<string[]>();

  /**
   * To store selected node
   */
  selectedNode: string[] = [];

  /**
   * Constructor of the class
   * @param widgetService Injecting widgetService class
   */
  constructor(
    private widgetService: WidgetService,
    private userService: UserService
    ) {
    /** Data Source and Tree Control used by Tree View */
    this.nestedTreeControl = new NestedTreeControl<TreeModel>(this._getChildren);
    this.nestedDataSource = new MatTreeNestedDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.clearFilterClicked && changes.clearFilterClicked.previousValue !== changes.clearFilterClicked.currentValue && changes.clearFilterClicked.previousValue !== undefined){
      this.getLocationData(this.topLocation, this.fieldId, this.searchString, this.searchFunc);
      this.selectedNode = [];
      this.selectionChange.emit(this.selectedNode);
    }
  }

  /***
   * ANGULAR HOOK
   */
  ngOnInit() {
    this.getLocationData(this.topLocation, this.fieldId, this.searchString, this.searchFunc)
  }

  /**
   * function to get data of location
   * @param topLocation parentNodeId of node
   * @param fieldId fieldId
   * @param searchString string to be searched inside searchbar
   * @param searchFunc .
   */
  public getLocationData(topLocation, fieldId, searchString, searchFunc){
    this.userService.getUserDetails().pipe(distinctUntilChanged()).subscribe(user=>{
      this.widgetService.getLocationHirerachy(topLocation, fieldId, searchString, searchFunc, user.plantCode).subscribe(data =>{
        data.map(d => {
          d.checked = false;
          d.expanded = false;
          return d;
        });
        this.nestedDataSource.data = data;
      });
    });
  }

  /** Checks if datasource for material tree has any child groups */
  hasNestedChild = (_: number, nodeData: TreeModel) =>
  {
    if(nodeData.child){
    return nodeData.child.length > 0;
    }else{
      return false;
    }
  }

  /** Returns child groups */
  private _getChildren = (node: TreeModel) => node.child;

  /**
   * function to maintain checked/unchecked state..
   * @param element data on which we clicked..
   */
  clickedActive(element) {
    element.checked = !element.checked;
    if(element.checked){
         this.selectedNode.push(element.nodeId);
    }else{
      const index = this.selectedNode.findIndex(item => item === element.nodeId);
      if(index > -1){
        this.selectedNode.splice(index, 1);
      }
    }
    if (element.child) {
      this.checkForChild(element.checked, element.child);
    }
    this.selectionChange.emit(this.selectedNode);
  }

  /***
   * function to check for children
   * @param parentState checked state of parent .. true/false
   * @param childArray array contains the child nodes of parent
   */
   checkForChild(parentState: boolean, childArray: any) {
      childArray.forEach(child => {
        if (parentState === false) {
          child.checked = false;
          const index = this.selectedNode.findIndex(item => item === child.nodeId);
          if(index > -1){
            this.selectedNode.splice(index, 1);
          }
        } else {
          child.checked = true;
          if(!this.selectedNode.includes(child.nodeId)){
            this.selectedNode.push(child.nodeId);
          }
        }
        if (child.child) {
          this.checkForChild(child.checked, child.child);
        }
      })
    }

  /**
   * Loops recursively through data finding the amount of checked children
   */
  getCheckedAmount(data) {
    this.count = 0; // resetting count
    this.totalChild = 0;
    this.loopData(data.child);
     /** compare the count of selected child node and total child node of particulart parent node */
    if (this.count > 0 && this.count !== this.totalChild) {
        if (data.checked) {
          data.checked = false;
        }
          const index = this.selectedNode.findIndex(item => item === data.nodeId);
          if (index > -1) {
            this.selectedNode.splice(index, 1);
            this.selectionChange.emit(this.selectedNode);
          }
        return true;
      } else if (this.count > 0) {
        /** executes when parent node is not selected but it all child node is selected */
        if (!data.checked) {
          data.checked = true;
          if (!this.selectedNode.includes(data.nodeId)) {
            this.selectedNode.push(data.nodeId);
            this.selectionChange.emit(this.selectedNode);
          }
        }
        return false;
     } else {
        const index = this.selectedNode.findIndex(item => item === data.nodeId);
        if (index > -1) {
          this.selectedNode.splice(index, 1);
          data.checked = false;
          this.selectionChange.emit(this.selectedNode);
        }
      }
  }

  /**
   * Used by getCheckedAmount()
   */
  loopData(data) {
    data.forEach(d => {
      this.totalChild += 1;
      if (d.checked) {
        this.count += 1;
        // console.log(d);
      }
      if (d.child && d.child.length > 0) {
        this.loopData(d.child);
      }
    });
  }

  changeState(data) {
    data.expanded = !data.expanded;
  }

}
