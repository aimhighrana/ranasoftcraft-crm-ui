import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ContainerComponent } from './edit/container/container.component';
import { Widget1Component } from './edit/container/widget1/widget1.component';
import { WidgetlistComponent } from './edit/container/widgetlist/widgetlist.component';
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


@NgModule({
  declarations: [
    DashboardComponent,
    ContainerComponent,
    Widget1Component,
    WidgetlistComponent,
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
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }
