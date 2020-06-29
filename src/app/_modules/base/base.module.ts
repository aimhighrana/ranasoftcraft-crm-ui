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
import { TasklistTableComponent } from './_components/tasklist-table/tasklist-table.component';
import { ListPageComponent } from './list-page_components/list-page/list-page.component';
import { ListFiltersComponent } from './list-page_components/listfilter-dropdown/listfilter.component';
import { ListColumnsettingComponent } from './list-page_components/listcolumnsetting/listcolumnsetting.component';

@NgModule({
  declarations: [
    TaskListComponent,
    ColumnsettingComponent,
    FiltersDropdownComponent,
    HistoryTabComponent,
    GeneralInformationTabComponent,
    TaskSummaryComponent,
    TasklistTableComponent,
    ListPageComponent,
    ListFiltersComponent,
    ListColumnsettingComponent,
  ],
  imports: [
    CommonModule,
    BaseRoutingModule,
    SharedModule,
  ]
})
export class BaseModule { }
