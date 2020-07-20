import { Component, OnInit, Input, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { SchemalistService } from 'src/app/_services/home/schema/schemalist.service';
import { SchemaExecutionSummary } from 'src/app/_models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { Subscription } from 'rxjs';
import { SchemaStaticThresholdRes } from '@models/schema/schemalist';

@Component({
  selector: 'pros-execution-summary',
  templateUrl: './execution-summary.component.html',
  styleUrls: ['./execution-summary.component.scss']
})
export class ExecutionSummaryComponent implements OnInit, OnDestroy, OnChanges {

  @Input()
  schemaId: string;

  @Input()
  variantId: string;

  summary: SchemaExecutionSummary;

  @Input()
  thresholdRes: SchemaStaticThresholdRes;

  /**
   * All subsriptions are here
   */
  subscriptions: Subscription[] = [];

  constructor(
    private schemaListService: SchemalistService,
    private schemaService: SchemaService
  ) {
    this.summary = new SchemaExecutionSummary();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.thresholdRes && changes.thresholdRes.currentValue !== changes.thresholdRes.previousValue) {
      this.thresholdRes = changes.thresholdRes.currentValue;
      this.thresholdRes.threshold = Math.round((this.thresholdRes.threshold + Number.EPSILON) * 100) / 100;

      const totalErr = (this.thresholdRes.totalCnt > 0 ? this.thresholdRes.errorCnt / this.thresholdRes.totalCnt : 0);
      this.summary.totalErrorPer = Math.round((totalErr + Number.EPSILON) * 100 * 100) / 100;

      const totalSuccess = (this.thresholdRes.totalCnt > 0 ? this.thresholdRes.successCnt / this.thresholdRes.totalCnt : 0);
      this.summary.totalSuccessPer = Math.round((totalSuccess + Number.EPSILON) * 100 * 100) / 100;

      this.summary.total = this.thresholdRes.totalCnt ? this.thresholdRes.totalCnt : this.summary.total;
    }
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    const schemaDetailsSub = this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res=>{
        this.summary.runBy = res.createdBy;
        this.summary.startTime = res.executionStartTime;
        this.summary.isInRunning = res.isInRunning;
        this.summary.exeEndDate = res.executionEndTime;
        this.summary.completeProgress = res.isInRunning ? 0 : 100;
    },error=> console.error(`Error: ${error.message}`));
    this.subscriptions.push(schemaDetailsSub);

  }

}
