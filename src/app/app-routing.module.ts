import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { TasklistComponent } from './_components/tasklist/tasklist.component';

const routes: Routes = [
  { path: 'tasklist', component: TasklistComponent },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
