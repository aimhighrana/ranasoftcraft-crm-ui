import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ContainerComponent } from './edit/container/container.component';
import { WidgetstyleControlComponent } from './edit/container/widgetstyle-control/widgetstyle-control.component';
import { DashboardContainerComponent } from './view/dashboard-container/dashboard-container.component';
import { BarChartComponent } from './view/dashboard-container/bar-chart/bar-chart.component';
import { CountComponent } from './view/dashboard-container/count/count.component';
import { FilterComponent } from './view/dashboard-container/filter/filter.component';
import { ReportingListComponent } from './view/dashboard-container/reporting-list/reporting-list.component';
import { StackedbarChartComponent } from './view/dashboard-container/stackedbar-chart/stackedbar-chart.component';
import { TimeseriesWidgetComponent } from './view/dashboard-container/timeseries-widget/timeseries-widget.component';
import { DynamicWidgetComponent } from './edit/container/dynamic-widget/dynamic-widget.component';
import { ReportListComponent } from './report-list/report-list.component';
import { HtmlEditorComponent } from './view/dashboard-container/html-editor/html-editor.component';
import { ImageComponent } from './view/dashboard-container/image/image.component';
import { PieChartComponent } from './view/dashboard-container/pie-chart/pie-chart.component';
import { MetadatafieldControlComponent } from './edit/container/metadatafield-control/metadatafield-control.component';
import { ReportCollaboratorComponent } from './permissions/report-collaborator/report-collaborator.component';
import { CollaboratorComponent } from './permissions/collaborator/collaborator.component';
import { SummaryLayoutComponent } from './view/summary-layout/summary-layout.component';
import { SummaryTabsComponent } from './view/summary-layout/summary-tabs/summary-tabs.component';
import { WidgetColorPaletteComponent } from './edit/widget-color-palette/widget-color-palette.component';
import { ExportReportDatatableComponent } from './view/dashboard-container/reporting-list/export-report-datatable/export-report-datatable.component';
import { WorkflowfieldControlComponent } from './edit/container/workflowfield-control/workflowfield-control.component';
import { WorkflowDatasetComponent } from './edit/container/workflow-dataset/workflow-dataset.component';
import { ReportDatatableColumnSettingsComponent } from './view/dashboard-container/reporting-list/report-datatable-column-settings/report-datatable-column-settings.component';
import { HierarchyFilterComponent } from './view/dashboard-container/filter/hierarchy-filter/hierarchy-filter.component';
import { DuplicateReportComponent } from './view/duplicate-report/duplicate-report.component';
import { SendEmailComponent } from './view/email/send-email/send-email.component';
import { EmailTemplateComponent } from './view/email/email-template/email-template.component';
import { ImportLogComponent } from './import-log/import-log.component';

import * as Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.plugins.register(ChartDataLabels);

@NgModule({
  declarations: [
    DashboardComponent,
    ContainerComponent,
    WidgetstyleControlComponent,
    DashboardContainerComponent,
    BarChartComponent,
    CountComponent,
    FilterComponent,
    ReportingListComponent,
    StackedbarChartComponent,
    TimeseriesWidgetComponent,
    DynamicWidgetComponent,
    ReportListComponent,
    HtmlEditorComponent,
    ImageComponent,
    PieChartComponent,
    MetadatafieldControlComponent,
    ReportCollaboratorComponent,
    CollaboratorComponent,
    SummaryLayoutComponent,
    SummaryTabsComponent,
    WidgetColorPaletteComponent,
    ExportReportDatatableComponent,
    WorkflowfieldControlComponent,
    WorkflowDatasetComponent,
    ReportDatatableColumnSettingsComponent,
    HierarchyFilterComponent,
    DuplicateReportComponent,
    SendEmailComponent,
    EmailTemplateComponent,
    ImportLogComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }
