import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportRoutingModule } from './report-routing.module';
import { DashboardComponent } from './view/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { ContainerComponent } from './edit/container/container.component';
import { Widget1Component } from './edit/container/widget1/widget1.component';
import { WidgetlistComponent } from './edit/container/widgetlist/widgetlist.component';
import { WidgetstyleControlComponent } from './edit/container/widgetstyle-control/widgetstyle-control.component';


@NgModule({
  declarations: [DashboardComponent, ContainerComponent, Widget1Component, WidgetlistComponent, WidgetstyleControlComponent],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule
  ]
})
export class ReportModule { }
