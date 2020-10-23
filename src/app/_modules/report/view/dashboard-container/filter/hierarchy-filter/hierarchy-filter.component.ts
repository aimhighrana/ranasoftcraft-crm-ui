import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTree, MatTreeNestedDataSource } from '@angular/material/tree';
import { WidgetService } from '@services/widgets/widget.service';

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
  constructor(private widgetService: WidgetService) {
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
    this.widgetService.getLocationHirerachy(topLocation, fieldId, searchString, searchFunc).subscribe(data =>{
      data.map(d => {
        d.checked = false;
        d.expanded = false;
        return d;
      });
      this.nestedDataSource.data = data;
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
      this.selectedNode.splice(this.selectedNode.indexOf(element.nodeId), 1);
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
      } else {
        child.checked = true;
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
    this.loopData(data.child);
    return this.count;
  }

  /**
   * Used by getCheckedAmount()
   */
  loopData(data) {
    data.forEach(d => {
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
