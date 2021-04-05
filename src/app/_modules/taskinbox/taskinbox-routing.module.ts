import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskListDatatableComponent } from './_component/task-list-datatable/task-list-datatable.component';


const routes: Routes = [
  {path: '' , component:TaskListDatatableComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TaskinboxRoutingModule { }