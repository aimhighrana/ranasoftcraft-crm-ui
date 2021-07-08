import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { GlobalCounts } from '@models/schema/schemadetailstable';
import { SchemaService } from '@services/home/schema.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-global-count',
  templateUrl: './global-count.component.html',
  styleUrls: ['./global-count.component.scss'],
})
export class GlobalCountComponent implements OnDestroy, OnChanges {
  globalCount: GlobalCounts = {
    successCount: 0,
    errorCount: 0,
    skippedCount: 0,
  };

  // selected schemaId
  @Input() schemaId: string;

  subscription: Subscription = new Subscription();

  constructor(private schemaService: SchemaService) {}

  ngOnChanges(simpleChanges: SimpleChanges): void {
    // get latest count on schema changes
    if (simpleChanges && simpleChanges.schemaId.currentValue) {
      this.getGlobalCounts();
    }
  }

  getGlobalCounts() {
    this.subscription.add(
      this.schemaService.getSchemaGlobalCounts(this.schemaId).subscribe(
        (res: GlobalCounts) => {
          this.globalCount = res;
        },
        (error) => {
          console.error(`Error : ${error.message}`);
        }
      )
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}