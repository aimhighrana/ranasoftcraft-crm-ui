import { TaskListTableViewSettingsComponent } from './_component/task-list-table-view-settings/task-list-table-view-settings.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListDatatableComponent } from './_component/task-list-datatable/task-list-datatable.component';

const routes: Routes = [
  { path: '', redirectTo: 'feed', pathMatch: 'full' },
  {
    path: 'feed',
    component: TaskListDatatableComponent,
  },
  {
    path: 'view/:node',
    component: TaskListTableViewSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskinboxRoutingModule {}
