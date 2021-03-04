import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '@modules/shared/_components/page-not-found/page-not-found.component';
import { ListComponent } from './_components/list.component';

const routes: Routes = [
  {
    path: '',
    component: ListComponent
  },
  { path: '**', component: PageNotFoundComponent }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ListRoutingModule { }
