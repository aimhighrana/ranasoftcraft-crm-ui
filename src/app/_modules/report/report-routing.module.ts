import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { ContainerComponent } from './edit/container/container.component';
import { ReportCollaboratorComponent } from './permissions/report-collaborator/report-collaborator.component';
import { SummaryLayoutComponent } from './view/summary-layout/summary-layout.component';


const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: 'dashboard-builder/:id', component: ContainerComponent },
  { path: 'collaborators/:reportId', component: ReportCollaboratorComponent },
  { path: 'summary/:widgetId/:objectNumber', component: SummaryLayoutComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
