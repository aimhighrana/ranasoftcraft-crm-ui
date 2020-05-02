import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { ContainerComponent } from './edit/container/container.component';
import { ReportListComponent } from './report-list/report-list.component';


const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path:'list', component: ReportListComponent },
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: 'dashboard-builder/:id', component: ContainerComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
