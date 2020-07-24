import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListComponent } from './_components/task-list/task-list.component';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { TaskDetailsComponent } from './_components/task-details/task-details.component'
import { ListPageComponent } from './list-page_components/list-page/list-page.component';
import { MaterialEditComponent } from './_components/material-edit/material-edit.component';
import { AttachmentTabComponent } from './_components/attachment-tab/attachment-tab.component';
import { SaveSearchDialogComponent } from './_components/save-search-dialog/save-search-dialog.component';

const routes: Routes = [
  { path: 'task-list', component: TaskListComponent, pathMatch: 'full' },
  { path: 'task-list/:tabId/:wfid/:eventCode', component: TaskListComponent },
  { path: 'task-details/:wfid/:eventCode', component: TaskDetailsComponent },
  { path: 'list-page', component: ListPageComponent },
  { path: 'material-edit', component: MaterialEditComponent },
  { path: 'attachment-tab', component: AttachmentTabComponent },
  { path: 'save-search-dialog', component: SaveSearchDialogComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BaseRoutingModule { }
