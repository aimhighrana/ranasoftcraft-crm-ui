import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskinboxRoutingModule } from './taskinbox-routing.module';
import { TaskListDatatableComponent } from './_component/task-list-datatable/task-list-datatable.component';
import { SharedModule } from '@modules/shared/shared.module';
import { TaskListTableViewSettingsComponent } from './_component/task-list-table-view-settings/task-list-table-view-settings.component';

@NgModule({
  declarations: [TaskListDatatableComponent, TaskListTableViewSettingsComponent],
  imports: [CommonModule, TaskinboxRoutingModule, SharedModule],
})
export class TaskinboxModule {}
