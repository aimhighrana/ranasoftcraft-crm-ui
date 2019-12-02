import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pros-schema-mapping-list',
  templateUrl: './schema-mapping-list.component.html',
  styleUrls: ['./schema-mapping-list.component.scss']
})
export class SchemaMappingListComponent implements OnInit {

  @Input()
  schemaId: number;
  @Input()
  schemaName: string;
  @Input()
  selectedObjectType: any;
  @Output()
  checkboxChangeState = new EventEmitter();

  selectedSchemas = [];
  schemaLists: any[] = [];
  constructor(
  ) { }

  ngOnInit() {
  }

  checkboxState(event, schemaId: number) {
    const sendBack = {isChecked: event.checked, schemaId};
    this.checkboxChangeState.emit(sendBack);
  }
}
