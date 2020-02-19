import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtInterceptorService } from './_services/jwt-interceptor.service';
import { HomeLayoutComponent } from './_components/home/home-layout/home-layout.component';
import { SchemaListComponent } from './_components/home/schema/schema-list/schema-list.component';
import {ChartsModule} from 'ng2-charts';
import { SchemaGroupsComponent } from './_components/home/schema/schema-groups/schema-groups.component';
import { SchemaTileComponent } from './_components/home/schema/schema-tile/schema-tile.component';
import { SchemaDetailsComponent } from './_components/home/schema/schema-details/schema-details.component';
import { OverviewChartComponent } from './_components/home/schema/schema-details/overview-chart/overview-chart.component';
import { CategoriesChartComponent } from './_components/home/schema/schema-details/categories-chart/categories-chart.component';
import { BusinessRulesChartComponent } from './_components/home/schema/schema-details/business-rules-chart/business-rules-chart.component';
import { SchemaDatatableComponent } from './_components/home/schema/schema-details/schema-datatable/schema-datatable.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { SchemaVariantsComponent } from './_components/home/schema/schema-variants/schema-variants.component';
import { SubstringPipe } from './_pipes/substringpipe.pipe';
import { SchemaStatusinfoDialogComponent } from './_components/home/schema/schema-details/schema-statusinfo-dialog/schema-statusinfo-dialog.component';
import { SchemaGroupFormComponent } from './_components/home/schema/schema-group-form/schema-group-form.component';
import { LoadingInterceptorService } from './_services/loading-interceptor.service';
import { SharedModule } from './_modules/shared/shared.module';
import { SchemaExecutionComponent } from './_components/home/schema/schema-execution/schema-execution.component';
import { SchemaCollaboratorsComponent } from './_components/home/schema/schema-collaborators/schema-collaborators.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeLayoutComponent,
    SchemaListComponent,
    SchemaGroupsComponent,
    SchemaTileComponent,
    SchemaDetailsComponent,
    OverviewChartComponent,
    CategoriesChartComponent,
    BusinessRulesChartComponent,
    SchemaDatatableComponent,
    SchemaVariantsComponent,
    SubstringPipe,
    SchemaStatusinfoDialogComponent,
    SchemaGroupFormComponent,
    SchemaExecutionComponent,
    SchemaCollaboratorsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ChartsModule,
    NgxMatSelectSearchModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptorService, multi: true }
  ],
  bootstrap: [ AppComponent ],
  entryComponents: [ SchemaStatusinfoDialogComponent ]
})
export class AppModule {
}
