import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { ContainerComponent } from './edit/container/container.component';
import { ReportCollaboratorComponent } from './permissions/report-collaborator/report-collaborator.component';
import { SummaryLayoutComponent } from './view/summary-layout/summary-layout.component';
import { ReportDatatableColumnSettingsComponent } from './view/dashboard-container/reporting-list/report-datatable-column-settings/report-datatable-column-settings.component';
import { ExportReportDatatableComponent } from './view/dashboard-container/reporting-list/export-report-datatable/export-report-datatable.component';
import { SendEmailComponent } from './view/email/send-email/send-email.component';
import { EmailTemplateComponent } from './view/email/email-template/email-template.component';
import { ImportLogComponent } from './import-log/import-log.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dashboard/:id', component: DashboardComponent },
  { path: 'dashboard-builder/:id', component: ContainerComponent },
  { path: 'collaborators/:reportId', component: ReportCollaboratorComponent },
  { path: 'summary/:widgetId/:objectNumber/:layoutId', component: SummaryLayoutComponent },
  { path: 'column-settings/:widgetId', component: ReportDatatableColumnSettingsComponent },
  { path: 'download-widget/:widgetId', component: ExportReportDatatableComponent },
  { path: 'send-email', component: SendEmailComponent },
  { path: 'email-template', component: EmailTemplateComponent },
  { path: 'import-log/:reportId', component: ImportLogComponent },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
