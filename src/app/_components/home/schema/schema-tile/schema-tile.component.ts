import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'pros-schema-tile',
  templateUrl: './schema-tile.component.html',
  styleUrls: ['./schema-tile.component.scss']
})
export class SchemaTileComponent implements OnInit {

  @Input()
  icon: string;
  @Input()
  title: string;
  @Input()
  color: string;
  @Input()
  help: string;
  @Input()
  info: string;
  @Input()
  link: string;
  @Input()
  iconColor: string;
  @Input()
  totalValue: string;
  @Input()
  enableProgressBar: boolean;
  @Input()
  successValue: number;
  @Input()
  errorValue: number;
  @Input()
  thisWeekProgress: string;
  @Input()
  isSchemaList: string;
  @Input()
  moduleId: string;
  @Input()
  schemaId: string;
  @Input()
  variantCount: string;
  @Input()
  showAddNew: boolean;
  @Input()
  enableEditButton: boolean;
  @Input()
  groupId: string;
  @Input()
  groupName: string;
  @Input()
  isSchemaVarinat: boolean;
  @Input()
  lastSchemaExecutionDate: string;
  @Input()
  enableDeleteButton: boolean;
  @Input()
  schemaStructure: string;
  @Input()
  schemaCreatedBy: any;
  @Input()
  createdDate: number;
  @Input()
  modifiedBy: any;
  @Input()
  lastModifiedDate: number;
  @Input()
  lastRunTime: number;
  @Input()
  lastRunDuration: number;
  @Input()
  colaborators: string;
  @Output()
  deleteSchemaGroup = new EventEmitter();
  @Output()
  editTrigger = new EventEmitter();
  @Output()
  showVariantClick = new EventEmitter();
  disabledProgress: string;
  linker() {
    return this.link;
  }
  constructor() { }
  ngOnInit() {
    if (Number(this.totalValue) <= 0) {
      this.disabledProgress = 'true';
    }
  }
  public onEditTrigger(groupId: string, groupName: string, schemaId: string) {
    const sendBack: any = { groupId, schemaId, groupName, objectId: this.moduleId };
    return this.editTrigger.emit(sendBack);
  }
  public deleteSchemaGroupAndMapping(groupId: string) {
    return this.deleteSchemaGroup.emit(groupId);
  }
  public showSchemaVariants(moduleId: string, groupId: string, schemaId: string) {
    const sendBack: any = { moduleId, groupId, schemaId};
    return this.showVariantClick.emit(sendBack);
  }
}
