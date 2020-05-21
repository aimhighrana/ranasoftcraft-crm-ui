import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './_components/task-list/task-list.component';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { TaskSummaryComponent } from './_components/task-summary/task-summary.component';

const routes: Routes = [
  { path: 'task-list', component: TaskListComponent , pathMatch : 'full' },
  { path: 'task-list/:summaryId', component: TaskListComponent },
  { path: 'task-details/:taskId', component: TaskSummaryComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
