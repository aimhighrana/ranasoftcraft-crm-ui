import { Component, OnInit, Input, OnDestroy, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { WorkflowResponse } from '@models/schema/schema';
import { SchemaService } from '@services/home/schema.service';
import { Observable, of, Subscription } from 'rxjs';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'pros-workflow-dataset',
  templateUrl: './workflow-dataset.component.html',
  styleUrls: ['./workflow-dataset.component.scss']
})
export class WorkflowDatasetComponent implements OnInit, OnDestroy, OnChanges {


  /**
   * prop for selected work flow modules ..
   */
  @Input()
  selected: WorkflowResponse[] = [];

  @Input()
  preSelectedObj = '';

  @Output()
  selectedWfs: EventEmitter<WorkflowResponse[]> = new EventEmitter<WorkflowResponse[]>();

  dataSetsWorkFlow: WorkflowResponse[];
  dataSetWorkflow: Observable<WorkflowResponse[]> = of([]);

  /**
   * hold all subscriptions ...
   */
  subscriptions: Subscription[] = [];

  /**
   * is all selected ..
   */
  isAllSelected = false;

  constructor(
    private schemaService: SchemaService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.preSelectedObj && changes.preSelectedObj.previousValue !== changes.preSelectedObj.currentValue) {
      this.preSelectedObj = changes.preSelectedObj.currentValue;
      const preSelVal = this.preSelectedObj.split(',');
      this.dataSetsWorkFlow.forEach(r=>{
         if(preSelVal.indexOf(r.objectid) !==-1) {
           r.isSelected = true;
         }
      });
      this.dataSetWorkflow = of(this.dataSetsWorkFlow);
      const len = this.dataSetsWorkFlow.filter(fil=> fil.isSelected === true).length;
      this.isAllSelected = this.dataSetsWorkFlow.length === len ? true: false;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
       sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    const workflowSub = this.schemaService.getWorkflowData().subscribe(res => {

      console.log(this.preSelectedObj);
      const preSelVal = this.preSelectedObj.split(',');
      res.forEach(r=>{
         if(preSelVal.indexOf(r.objectid) !==-1) {
           r.isSelected = true;
         }
      });
      this.dataSetsWorkFlow = res;
      this.dataSetWorkflow = of(res);
      const len = this.dataSetsWorkFlow.filter(fil=> fil.isSelected === true).length;
      this.isAllSelected = this.dataSetsWorkFlow.length === len ? true: false;
    }, error => console.error(`Error: ${error}`));
    this.subscriptions.push(workflowSub);
  }



  /**
   * Log while selection change ..
   * @param item chnageable selection data ...
   */
  selectionChange(event: MatSelectionListChange) {
    console.log(event);
    // if(item.isSelected) {
    //   const indx = this.selected.filter(fil=> fil.objectid === item.objectid)[0];
    //   this.selected.splice(this.selected.indexOf(indx), 1);
    //   const oldOne =  this.dataSetsWorkFlow.filter(fil=> fil.objectid === item.objectid)[0];
    //   oldOne.isSelected = false;
    //   this.dataSetWorkflow = of(this.dataSetsWorkFlow);
    // } else {
    //   this.selected.push(item);
    //   const oldOne =  this.dataSetsWorkFlow.filter(fil=> fil.objectid === item.objectid)[0];
    //   oldOne.isSelected = true;
    //   this.dataSetWorkflow = of(this.dataSetsWorkFlow);
    // }
     if(event && event.source) {
       const value = event.source._value;
       this.isAllSelected = value.length === this.dataSetsWorkFlow.length ? true : false;
       this.selectedWfs.emit(event.source._value as any);
     }
  }

  isSelected(item: WorkflowResponse): boolean {
    return item.isSelected ? item.isSelected : false;
  }

  /**
   * check for Interminate state ...
   */
  isInInterminate(): boolean {
    return this.selected.length > 0 && !this.isAllSelected;
  }

  /**
   * Help to toggle all selected or unselecte all
   */
  toggleAll(changedVal: boolean) {
    console.log(changedVal);
      if(this.isAllSelected) {
        this.selected = [];
        this.dataSetsWorkFlow.forEach(each=>{
          each.isSelected = false;
       });
       this.isAllSelected = false;
       this.dataSetWorkflow = of(this.dataSetsWorkFlow);
       this.selectedWfs.emit([]);
      } else {
        this.dataSetsWorkFlow.forEach(each=>{
           each.isSelected = true;
        });
        this.isAllSelected = true;
        this.dataSetWorkflow = of(this.dataSetsWorkFlow);
        this.selectedWfs.emit(this.dataSetsWorkFlow);
      }
  }
}
