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
  control: FormControl;

  @Input() label: string;

  @Input() type: string;

  @Input() placeholder: string;
  /**
   * To emit the value for parent
   */
  @Output() value = new EventEmitter<string>();


  /**
   * ANGULAR HOOK
   */
  ngOnInit(): void {
    this.control = new FormControl();
  }

  /**
   * To clear search input
   */
  clearSearch(){
    this.control.reset();
  }


  /**
   * Emit the value of search input on hitting enter
   */
  hitEnterKey(event){
    if(event.keyCode === 13){
      this.value.emit(this.control.value);
      this.clearSearch();
    }
  }


  /**
   * ANGULAR HOOK
   * Detect changes from parent to child
   */
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
}
