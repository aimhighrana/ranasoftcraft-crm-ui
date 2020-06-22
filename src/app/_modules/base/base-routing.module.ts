import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './_components/task-list/task-list.component';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { TaskSummaryComponent } from './_components/task-summary/task-summary.component';
import { TasklistTableComponent } from './_components/tasklist-table/tasklist-table.component'

const routes: Routes = [
  { path: 'task-list', component: TaskListComponent, pathMatch: 'full' },
  { path: 'task-list/table', component: TasklistTableComponent },
  { path: 'task-list/:tabId/:summaryId', component: TaskListComponent },
  { path: 'task-details/:taskId', component: TaskSummaryComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
