import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AttributeDefaultValue } from '@models/schema/classification';
import { GlobaldialogService } from '@services/globaldialog.service';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { TransientService } from 'mdo-ui-library';

@Component({
  selector: 'pros-attribute-default-value',
  templateUrl: './attribute-default-value.component.html',
  styleUrls: ['./attribute-default-value.component.scss']
})
export class AttributeDefaultValueComponent implements OnInit {

  valueList: Array<AttributeDefaultValue> = [];
  searchStr = '';

  constructor(private router: Router,
    private globalDialogService: GlobaldialogService,
    private nounModifierService: NounModifierService,
    private transientService: TransientService) { }

  ngOnInit(): void {
    if (!this.nounModifierService.attributeValuesModels) {
      this.nounModifierService.attributeValuesModels = [];
    }
    this.valueList = this.nounModifierService.attributeValuesModels;
  }

  isValidRow(row: AttributeDefaultValue) {
    return row && row.code && row.shortValue
  }

  close() {
    const isAnyInvalidRow = this.valueList.find(row => !this.isValidRow(row));
    const routerCommands = this.nounModifierService.attributeSheetRoute;
    if (isAnyInvalidRow) {
      this.transientService.confirm({
        data: { label: 'Empty entries will not be saved. Click Ok to continue.' },
        disableClose: true,
        autoFocus: false,
        backdropClass: 'no-backdrop'
      }, (response) => {
        if (response === 'yes') {
          this.nounModifierService.attributeValuesModels = this.valueList.filter(this.isValidRow);
          this.router.navigate(routerCommands, { queryParamsHandling: 'preserve' });
        }
      });
    } else {
      this.nounModifierService.attributeValuesModels = this.valueList;
      this.router.navigate(routerCommands, { queryParamsHandling: 'preserve' });
    }
  }

  uploadData() {
    if (document.getElementById('uploadFileCtrl')) {
      document.getElementById('uploadFileCtrl').click();
    }
    return true;
  }

  addValueRow() {
    const valueRow: AttributeDefaultValue = {
      code: '',
      shortValue: ''
    };
    this.valueList.unshift(valueRow);
  }

  copyData(i: number) {
    const valueRow = this.valueList[i];
    this.valueList.splice(i + 1, 0, { ...valueRow });
  }

  deleteValueRow(i: number) {
    this.globalDialogService.confirm({
      label: 'Are you sure to delete this?'
    }, (response: string) => {
      if (response === 'yes') {
        this.valueList.splice(i, 1);
      }
    });
  }

  doSearch($event) {
    this.searchStr = $event;
  }

  canDisplayRow(row: AttributeDefaultValue) {
    const searchStr = this.searchStr.toLowerCase();
    return !this.searchStr || row.code.toLowerCase().includes(searchStr) || row.shortValue.toLowerCase().includes(searchStr);
  }
}
