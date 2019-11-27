import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  MatFormFieldModule ,
  MatLineModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { IntMappingComponent } from './_components/int-mapping/int-mapping.component';
import { AdminLayoutComponent } from './_components/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './_components/admin-home/admin-home.component';
import { AdminTileComponent } from './_components/admin-tile/admin-tile.component';
import { IntegrationAdapterComponent } from './_components/integration-adapter/integration-adapter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from './_components/breadcrumb/breadcrumb.component';
import { ClickStopPropagationDirective } from './_directives/click-stop-propagation.directive';
import { InterfacesComponent } from './_components/interfaces/interfaces.component';
import { SapComponent } from './_components/integration-adapter/sap/sap.component';
import { RfcComponent } from './_components/integration-adapter/sap/rfc/rfc.component';
import { OdataComponent } from './_components/integration-adapter/sap/odata/odata.component';
import { SoapComponent } from './_components/integration-adapter/salesforce/soap/soap.component';
import { RestComponent } from './_components/integration-adapter/salesforce/rest/rest.component';
import { RdbmsComponent } from './_components/integration-adapter/rdbms/rdbms.component';
import { IBMDB2Component } from './_components/integration-adapter/rdbms/ibmdb2/ibmdb2.component';
import { MysqlComponent } from './_components/integration-adapter/rdbms/mysql/mysql.component';
import { PostGreSQLComponent } from './_components/integration-adapter/rdbms/post-gre-sql/post-gre-sql.component';
import { XmlComponent } from './_components/integration-adapter/custom/xml/xml.component';
import { CsvComponent } from './_components/integration-adapter/custom/csv/csv.component';
import { CustomComponent } from './_components/integration-adapter/custom/custom.component';
import { WebserviceComponent } from './_components/integration-adapter/webservice/webservice.component';
import { CxmlComponent } from './_components/integration-adapter/webservice/cxml/cxml.component';
import { WsRestComponent } from './_components/integration-adapter/webservice/ws-rest/ws-rest.component';
import { WsSoapComponent } from './_components/integration-adapter/webservice/ws-soap/ws-soap.component';
import { UserManagementComponent } from './_components/user-mgmt-home/user-management.component';
import { SecurityLogsComponent } from './_components/security-logs/security-logs.component';
import { EmailNotifComponent } from './_components/email-notif/email-notif.component';
import { AdvancedSettingsComponent } from './_components/advanced-settings/advanced-settings.component';
import { SalesforceComponent } from './_components/integration-adapter/salesforce/salesforce.component';
import { IdocsComponent } from './_components/integration-adapter/sap/idocs/idocs.component';
import { MsSqlComponent } from './_components/integration-adapter/rdbms/ms-sql/ms-sql.component';
import { ApiComponent } from './_components/integration-adapter/custom/api/api.component';
import { ModuleComponent } from './_components/module/module.component';
import { WorkflowComponent } from './_components/module/workflow/workflow.component';
import { ChangeRequestComponent } from './_components/module/change-request/change-request.component';
import { FieldsComponent } from './_components/module/fields/fields.component';
import { GridFieldsComponent } from './_components/module/grid-fields/grid-fields.component';
import { ListPageComponent } from './_components/module/list-page/list-page.component';
import { DropdownComponent } from './_components/module/dropdown/dropdown.component';
import { SecurityComponent } from './_components/module/security/security.component';
import { CustomEventsComponent } from './_components/module/custom-events/custom-events.component';
import { BusinessRulesComponent } from './_components/module/business-rules/business-rules.component';
import { NounsCharacteristicsComponent } from './_components/module/nouns-characteristics/nouns-characteristics.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './_services/jwt-interceptor.service';
import { HomeLayoutComponent } from './_components/home/home-layout/home-layout.component';
import { SchemaProgressbarComponent } from './_components/home/schema-progressbar/schema-progressbar.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import { SchemalistComponent } from './_components/home/schema/schemalist/schemalist.component';
import {ChartsModule} from 'ng2-charts';
import { SchemaComponent } from './_components/home/schema/schema/schema.component';
import { SchemaLayoutComponent } from './_components/home/schema/schema-layout/schema-layout.component';
import { SchemaTileComponent } from './_components/home/schema/schema-tile/schema-tile.component';
import { DataSource } from '@angular/cdk/table';
import { SchemaDetailsComponent } from './_components/home/schema/schema-details/schema-details.component';
import { SchemaDialogComponent } from './_components/home/schema/schema-dialog/schema-dialog.component';
import { OverviewChartComponent } from './_components/home/schema/schema-details/overview-chart/overview-chart.component';
import { CategoriesChartComponent } from './_components/home/schema/schema-details/categories-chart/categories-chart.component';
import { BusinessRulesChartComponent } from './_components/home/schema/schema-details/business-rules-chart/business-rules-chart.component';
import { SchemaDatatableComponent } from './_components/home/schema/schema-details/schema-datatable/schema-datatable.component';
import { SchemaDatatableDialogComponent } from './_components/home/schema/schema-details/schema-datatable-dialog/schema-datatable-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    IntMappingComponent,
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminTileComponent,
    IntegrationAdapterComponent,
    BreadcrumbComponent,
    ClickStopPropagationDirective,
    InterfacesComponent,
    IdocsComponent,
    SapComponent,
    RfcComponent,
    OdataComponent,
    SoapComponent,
    RestComponent,
    SalesforceComponent,
    RdbmsComponent,
    IBMDB2Component,
    MysqlComponent,
    MsSqlComponent,
    PostGreSQLComponent,
    XmlComponent,
    CsvComponent,
    ApiComponent,
    CustomComponent,
    WebserviceComponent,
    CxmlComponent,
    WsRestComponent,
    WsSoapComponent,
    UserManagementComponent,
    SecurityLogsComponent,
    ModuleComponent,
    EmailNotifComponent,
    AdvancedSettingsComponent,
    WorkflowComponent,
    ChangeRequestComponent,
    FieldsComponent,
    GridFieldsComponent,
    ListPageComponent,
    DropdownComponent,
    SecurityComponent,
    CustomEventsComponent,
    BusinessRulesComponent,
    NounsCharacteristicsComponent,
    HomeLayoutComponent,
    SchemaProgressbarComponent,
    SchemalistComponent,
    SchemaComponent,
    SchemaLayoutComponent,
    SchemaTileComponent,
    SchemaDetailsComponent,
    SchemaDialogComponent,
    OverviewChartComponent,
    CategoriesChartComponent,
    BusinessRulesChartComponent,
    SchemaDatatableComponent,
    SchemaDatatableDialogComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    // for flex-progress bar
    FlexLayoutModule,
    // for chart
    ChartsModule,
    // Material Modules Start
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    MatListModule,
    MatLineModule,
    MatTableModule,
    // Material Modules End
    // Theme changer CDK
    OverlayModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
  ],
  bootstrap: [ AppComponent ],
  exports: [
    BreadcrumbComponent
  ],
  entryComponents: [SchemaDialogComponent, SchemaDatatableDialogComponent]
})
export class AppModule { }
