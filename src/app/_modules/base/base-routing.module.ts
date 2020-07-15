import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './_components/task-list/task-list.component';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { TaskSummaryComponent } from './_components/task-summary/task-summary.component';
import { TasklistTableComponent } from './_components/tasklist-table/tasklist-table.component'
import { ListPageComponent } from './list-page_components/list-page/list-page.component';
import { MaterialEditComponent } from './_components/material-edit/material-edit.component';

const routes: Routes = [
  { path: 'task-list', component: TaskListComponent, pathMatch: 'full' },
  { path: 'task-list/table', component: TasklistTableComponent },
  { path: 'task-list/:tabId/:summaryId', component: TaskListComponent },
  { path: 'task-details/:taskId', component: TaskSummaryComponent },
  { path: 'list-page', component: ListPageComponent },
  { path: 'material-edit', component: MaterialEditComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
