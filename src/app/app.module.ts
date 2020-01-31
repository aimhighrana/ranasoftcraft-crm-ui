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
import { IntMappingComponent } from './_components/admin/int-mapping/int-mapping.component';
import { AdminLayoutComponent } from './_components/admin/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './_components/admin/admin-home/admin-home.component';
import { AdminTileComponent } from './_components/admin/admin-tile/admin-tile.component';
import { IntegrationAdapterComponent } from './_components/admin/integration-adapter/integration-adapter.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from './_components/common/breadcrumb/breadcrumb.component';
import { ClickStopPropagationDirective } from './_directives/click-stop-propagation.directive';
import { InterfacesComponent } from './_components/admin/interfaces/interfaces.component';
import { SapComponent } from './_components/admin/integration-adapter/sap/sap.component';
import { RfcComponent } from './_components/admin/integration-adapter/sap/rfc/rfc.component';
import { OdataComponent } from './_components/admin/integration-adapter/sap/odata/odata.component';
import { SoapComponent } from './_components/admin/integration-adapter/salesforce/soap/soap.component';
import { RestComponent } from './_components/admin/integration-adapter/salesforce/rest/rest.component';
import { RdbmsComponent } from './_components/admin/integration-adapter/rdbms/rdbms.component';
import { IBMDB2Component } from './_components/admin/integration-adapter/rdbms/ibmdb2/ibmdb2.component';
import { MysqlComponent } from './_components/admin/integration-adapter/rdbms/mysql/mysql.component';
import { PostGreSQLComponent } from './_components/admin/integration-adapter/rdbms/post-gre-sql/post-gre-sql.component';
import { XmlComponent } from './_components/admin/integration-adapter/custom/xml/xml.component';
import { CsvComponent } from './_components/admin/integration-adapter/custom/csv/csv.component';
import { CustomComponent } from './_components/admin/integration-adapter/custom/custom.component';
import { WebserviceComponent } from './_components/admin/integration-adapter/webservice/webservice.component';
import { CxmlComponent } from './_components/admin/integration-adapter/webservice/cxml/cxml.component';
import { WsRestComponent } from './_components/admin/integration-adapter/webservice/ws-rest/ws-rest.component';
import { WsSoapComponent } from './_components/admin/integration-adapter/webservice/ws-soap/ws-soap.component';
import { UserManagementComponent } from './_components/admin/user-mgmt-home/user-management.component';
import { SecurityLogsComponent } from './_components/admin/security-logs/security-logs.component';
import { EmailNotifComponent } from './_components/admin/email-notif/email-notif.component';
import { AdvancedSettingsComponent } from './_components/admin/advanced-settings/advanced-settings.component';
import { SalesforceComponent } from './_components/admin/integration-adapter/salesforce/salesforce.component';
import { IdocsComponent } from './_components/admin/integration-adapter/sap/idocs/idocs.component';
import { MsSqlComponent } from './_components/admin/integration-adapter/rdbms/ms-sql/ms-sql.component';
import { ApiComponent } from './_components/admin/integration-adapter/custom/api/api.component';
import { ModuleComponent } from './_components/admin/module/module.component';
import { WorkflowComponent } from './_components/admin/module/workflow/workflow.component';
import { ChangeRequestComponent } from './_components/admin/module/change-request/change-request.component';
import { FieldsComponent } from './_components/admin/module/fields/fields.component';
import { GridFieldsComponent } from './_components/admin/module/grid-fields/grid-fields.component';
import { ListPageComponent } from './_components/admin/module/list-page/list-page.component';
import { DropdownComponent } from './_components/admin/module/dropdown/dropdown.component';
import { SecurityComponent } from './_components/admin/module/security/security.component';
import { CustomEventsComponent } from './_components/admin/module/custom-events/custom-events.component';
import { BusinessRulesComponent } from './_components/admin/module/business-rules/business-rules.component';
import { NounsCharacteristicsComponent } from './_components/admin/module/nouns-characteristics/nouns-characteristics.component';
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
import { SchemaDetailsComponent } from './_components/home/schema/schema-details/schema-details.component';
import { OverviewChartComponent } from './_components/home/schema/schema-details/overview-chart/overview-chart.component';
import { CategoriesChartComponent } from './_components/home/schema/schema-details/categories-chart/categories-chart.component';
import { BusinessRulesChartComponent } from './_components/home/schema/schema-details/business-rules-chart/business-rules-chart.component';
import { SchemaDatatableComponent } from './_components/home/schema/schema-details/schema-datatable/schema-datatable.component';
import { SchemaDatatableDialogComponent } from './_components/home/schema/schema-details/schema-datatable-dialog/schema-datatable-dialog.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatRangeDatepickerModule, MatRangeNativeDateModule } from 'mat-range-datepicker';
import { SchemaVariantsComponent } from './_components/home/schema/schema-variants/schema-variants.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SubstringPipe } from './_pipes/substringpipe.pipe';
import { SchemaStatusinfoDialogComponent } from './_components/home/schema/schema-details/schema-statusinfo-dialog/schema-statusinfo-dialog.component';
import { SchemabadgeTileComponent } from './_components/home/schema/schemabadge-tile/schemabadge-tile.component';
import { SchemaGroupMappingComponent } from './_components/home/schema/schema-group-mapping/schema-group-mapping.component';
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
    OverviewChartComponent,
    CategoriesChartComponent,
    BusinessRulesChartComponent,
    SchemaDatatableComponent,
    SchemaDatatableDialogComponent,
    SchemaVariantsComponent,
    SubstringPipe,
    SchemaStatusinfoDialogComponent,
    SchemabadgeTileComponent,
    SchemaGroupMappingComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    ChartsModule,
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
    OverlayModule,
    BrowserAnimationsModule,
    NgxMatSelectSearchModule,
    AppRoutingModule,
    MatRangeDatepickerModule,
    MatRangeNativeDateModule,
    MatDatepickerModule,
    DragDropModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptorService, multi: true },
  ],
  bootstrap: [ AppComponent ],
  exports: [
    BreadcrumbComponent,
    DragDropModule
  ],
  entryComponents: [SchemaDatatableDialogComponent, SchemaStatusinfoDialogComponent]
})
export class AppModule {
}
