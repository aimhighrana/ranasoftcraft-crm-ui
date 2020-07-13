import { Component, OnInit, OnChanges, SimpleChanges, Input, EventEmitter, Output } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SchemaService } from '@services/home/schema.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'pros-udr-condition-operators',
  templateUrl: './udr-condition-operators.component.html',
  styleUrls: ['./udr-condition-operators.component.scss']
})
export class UdrConditionOperatorsComponent implements OnInit, OnChanges {

  @Input()
  conditionalOperators: string[];

  @Output()
  afterSelect: EventEmitter<string> = new EventEmitter();

  conditionalOperatorsOb: Observable<string[]> = of([]);

  operator: FormControl = new FormControl('');

  constructor(
    private schemaService: SchemaService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes && changes.conditionalOperators && changes.conditionalOperators.previousValue !== changes.conditionalOperators.currentValue) {
      this.conditionalOperatorsOb = of(changes.conditionalOperators.currentValue);
    }
  }

  ngOnInit(): void {
    this.operator.valueChanges.subscribe(res=>{
      if(res && typeof res === 'string') {
        this.conditionalOperatorsOb = of(this.conditionalOperators.filter(con=> con.toLocaleLowerCase().indexOf(res.toLocaleLowerCase()) !==-1));
      } else {
        this.conditionalOperatorsOb = of(this.conditionalOperators);
      }
    });
  }


  /**
   *
   * @param option when option change then should emit value
   */
  operatorSelectionChng(option: MatAutocompleteSelectedEvent) {
    console.log(option);
    if(option && option.option.value) {
      this.afterSelect.emit(option.option.value);
    }
  }

}
