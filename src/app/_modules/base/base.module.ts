import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseRoutingModule } from './base-routing.module';
import { TaskListComponent } from './_components/task-list/task-list.component'
import { ColumnsettingComponent } from './_components/columnsetting/columnsetting.component';
import { FiltersDropdownComponent } from './_components/filters-dropdown/filters-dropdown.component';
import { SharedModule } from '../shared/shared.module';
import { HistoryTabComponent } from './_components/history-tab/history-tab.component';
import { GeneralInformationTabComponent } from './_components/general-information-tab/general-information-tab.component';
import { TaskSummaryComponent } from './_components/task-summary/task-summary.component';
import { TaskDetailsComponent } from './_components/task-details/task-details.component';
import { ListPageComponent } from './list-page_components/list-page/list-page.component';
import { ListFiltersComponent } from './list-page_components/listfilter-dropdown/listfilter.component';
import { ListColumnsettingComponent } from './list-page_components/listcolumnsetting/listcolumnsetting.component';
import { MaterialEditComponent } from './_components/material-edit/material-edit.component';
import { GenericTextboxComponent } from './generic/generic-textbox/generic-textbox.component';
import { GenericDropdownComponent } from './generic/generic-dropdown/generic-dropdown.component';
import { GenericTableComponent } from './generic/generic-table/generic-table.component';
import { AttachmentTabComponent } from './_components/attachment-tab/attachment-tab.component';
import { SaveSearchDialogComponent } from './_components/save-search-dialog/save-search-dialog.component';

@NgModule({
  declarations: [
    TaskListComponent,
    ColumnsettingComponent,
    FiltersDropdownComponent,
    HistoryTabComponent,
    GeneralInformationTabComponent,
    TaskSummaryComponent,
    TaskDetailsComponent,
    ListPageComponent,
    ListFiltersComponent,
    ListColumnsettingComponent,
    MaterialEditComponent,
    ListColumnsettingComponent,
    GenericTextboxComponent,
    GenericDropdownComponent,
    GenericTableComponent,
    AttachmentTabComponent,
    SaveSearchDialogComponent,
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    SharedModule,
  ]
})
export class BaseModule { }
