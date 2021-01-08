import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { SchemaExecutionProgressResponse } from '@models/schema/schema-execution';
import { SchemaService } from '@services/home/schema.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'pros-schema-progress',
  templateUrl: './schema-progress.component.html',
  styleUrls: ['./schema-progress.component.scss']
})
export class SchemaProgressComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * To hold schema ID
   */
  @Input() schemaId: string;

  /**
   * To hold execution current status
   */
  schemaProgress: SchemaExecutionProgressResponse;

  /**
   * To hold all subscriptions of services
   */
  subscription: Subscription[] = [];

  /**
   * Constructor of class
   * @param schemaService: Instace of schema service
   */
  constructor(private schemaService: SchemaService) { }

  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
      this.schemaExecutionProgressInfo(this.schemaId);
      setInterval(() => this.schemaExecutionProgressInfo(this.schemaId), 15000);
  }

  /**
   * ANGULAR HOOK
   * Called before any other lifecycle hook.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.schemaId && changes.schemaId.previousValue !== changes.schemaId.currentValue) {
      this.schemaId = changes.schemaId.currentValue;
    }
  }

  /**
   * Function to get schema execution progress information
   * @param schemaId: schema id
   */
  schemaExecutionProgressInfo(schemaId: string) {
    const execSubscription = this.schemaService.getSchemaExecutionProgressDetails(schemaId).subscribe(response => {
      this.schemaProgress = response;
    }, (error) => {
      console.log(`Something went wrong while getting schema execution progress, ${error.message}`);
    });
    this.subscription.push(execSubscription);
  }


  /**
   * ANGULAR HOOK
   * Called once, before the instance is destroyed.
   */
  ngOnDestroy(): void {
    this.subscription.forEach((sub) => {
      sub.unsubscribe();
    })
  }

}
