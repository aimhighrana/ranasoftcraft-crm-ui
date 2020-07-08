import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
export class ExecutionSummaryComponent implements OnInit, OnDestroy {

  @Input()
  schemaId: string;

  @Input()
  variantId: string;

  summary: SchemaExecutionSummary;

  thresholdRes: SchemaStaticThresholdRes = new SchemaStaticThresholdRes();

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


  ngOnDestroy(): void {
    this.subscriptions.forEach(sub=>{
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    const schemaDetailsSub = this.schemaListService.getSchemaDetailsBySchemaId(this.schemaId).subscribe(res=>{
        const summary: SchemaExecutionSummary  = new SchemaExecutionSummary();
        const totalErr = (res.totalCount > 0 ? res.errorCount / res.totalCount : 0);
        summary.totalErrorPer = Math.round((totalErr + Number.EPSILON) * 100 * 100) / 100;

        const totalSuccess = (res.totalCount > 0 ? res.successCount / res.totalCount : 0);
        summary.totalSuccessPer = Math.round((totalSuccess + Number.EPSILON) * 100 * 100) / 100;

        summary.total = res.totalCount;
        summary.runBy = res.createdBy;
        summary.startTime = res.executionStartTime;
        summary.isInRunning = res.pulse;
        summary.exeEndDate = res.executionEndTime;
        summary.completeProgress = res.pulse ? 0 : 100;
        this.summary = summary;
    },error=> console.error(`Error: ${error.message}`));
    this.subscriptions.push(schemaDetailsSub);

    this.getSchemaThresholdStatics();
  }

  /**
   * Get schema threshold statics
   * Based on schemaId & variantId
   */
  getSchemaThresholdStatics() {
    const staticSub = this.schemaService.getSchemaThresholdStatics(this.schemaId, this.variantId).subscribe(res=>{
      this.thresholdRes = res;
      this.thresholdRes.threshold = Math.round((res.threshold + Number.EPSILON) * 100) / 100;
    }, error=>{
      this.thresholdRes.threshold = 0;
      console.error(`Execption : ${error.message}`);
    });
    this.subscriptions.push(staticSub);
  }

}
