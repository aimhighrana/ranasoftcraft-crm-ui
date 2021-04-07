import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TaskinboxRoutingModule } from './taskinbox-routing.module';
import { TaskListDatatableComponent } from './_component/task-list-datatable/task-list-datatable.component';
import { SharedModule } from '@modules/shared/shared.module';
import { TaskListViewSettingsComponent } from './_component/task-list-view-settings/task-list-view-settings.component';


@NgModule({
  declarations: [TaskListDatatableComponent, TaskListViewSettingsComponent],
  imports: [
    CommonModule,
    TaskinboxRoutingModule,
    SharedModule
  ]
})
export class TaskinboxModule { }
