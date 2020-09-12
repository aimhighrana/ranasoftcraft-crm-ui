import { Component, OnInit, SimpleChanges, Output, Input, OnChanges, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'pros-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchInputComponent implements OnInit, OnChanges {

  constructor() { }

  control: FormControl = new FormControl('');

  @Input() label = 'Search';

  @Input() type: string;

  @Input() placeholder = 'Search';

  @Input()
  preValue ='';

  /**
   * To emit the value for parent
   */
  @Output() value = new EventEmitter<string>();


  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
  }

  /**
   * To clear search input
   */
  clearSearch(){
    this.control.reset();
    this.value.emit('');
  }


  /**
   * ANGULAR HOOK
   * Detect changes from parent to child
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.value && changes.value.previousValue !== changes.value.currentValue) {
      this.value = changes.value.currentValue;
    }

    if(changes && changes.preValue && changes.preValue.previousValue !== changes.preValue.currentValue ) {
      this.preValue = changes.preValue.currentValue;
      this.control = new FormControl(this.preValue);
      this.control.valueChanges.subscribe(value=>{
        this.value.emit(value);
      });
    }
  }
}