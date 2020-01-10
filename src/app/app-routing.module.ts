import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { IntMappingComponent } from './_components/int-mapping/int-mapping.component';
import { AdminLayoutComponent } from './_components/admin-layout/admin-layout.component';
import { AdminHomeComponent } from './_components/admin-home/admin-home.component';
import { IntegrationAdapterComponent } from './_components/integration-adapter/integration-adapter.component';
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
import { BusinessRulesComponent } from './_components/module/business-rules/business-rules.component';
import { WorkflowComponent } from './_components/module/workflow/workflow.component';
import { ChangeRequestComponent } from './_components/module/change-request/change-request.component';
import { FieldsComponent } from './_components/module/fields/fields.component';
import { GridFieldsComponent } from './_components/module/grid-fields/grid-fields.component';
import { ListPageComponent } from './_components/module/list-page/list-page.component';
import { DropdownComponent } from './_components/module/dropdown/dropdown.component';
import { SecurityComponent } from './_components/module/security/security.component';
import { CustomEventsComponent } from './_components/module/custom-events/custom-events.component';
import { NounsCharacteristicsComponent } from './_components/module/nouns-characteristics/nouns-characteristics.component';
import { HomeLayoutComponent } from './_components/home/home-layout/home-layout.component';
import { SchemalistComponent } from './_components/home/schema/schemalist/schemalist.component';
import { SchemaComponent } from './_components/home/schema/schema/schema.component';
import { SchemaDetailsComponent } from './_components/home/schema/schema-details/schema-details.component';
import { SchemaVariantsComponent } from './_components/home/schema/schema-variants/schema-variants.component';

const routes: Routes = [
   { path: 'home', component: HomeLayoutComponent,
     children: [
      { path: '', redirectTo: 'schema', pathMatch: 'full' },
      { path: 'schema', component: SchemaComponent },
      { path: 'schema/schema-list/:schemaGrpId', component: SchemalistComponent },
      { path: 'schema/schema-details/:moduleId/:schemaGroupId/:schemaId', component: SchemaDetailsComponent },
      { path: 'schema/schema-variants/:moduleId/:groupId/:schemaId', component: SchemaVariantsComponent},
    ]
  },
  { path: 'admin', component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'default', pathMatch: 'full' },
      { path: 'default', component: AdminHomeComponent },

      { path: 'user-management', component: UserManagementComponent },

      { path: 'modules', component: ModuleComponent },
      { path: 'modules/:id/business-rules', component: BusinessRulesComponent },
      { path: 'modules/:id/workflow', component: WorkflowComponent },
      { path: 'modules/:id/change-request', component: ChangeRequestComponent },
      { path: 'modules/:id/fields', component: FieldsComponent },
      { path: 'modules/:id/grid-fields', component: GridFieldsComponent },
      { path: 'modules/:id/list-page', component: ListPageComponent },
      { path: 'modules/:id/dropdown', component: DropdownComponent },
      { path: 'modules/:id/security', component: SecurityComponent },
      { path: 'modules/:id/custom-events', component: CustomEventsComponent },
      { path: 'modules/:id/nouns-characteristics', component: NounsCharacteristicsComponent },

      { path: 'securitylogs', component: SecurityLogsComponent },

      { path: 'email', component: EmailNotifComponent },

      { path: 'integration', component: IntegrationAdapterComponent },
      { path: 'integration/sap', component: SapComponent },
      { path: 'integration/sap/idocs', component: IdocsComponent },
      { path: 'integration/sap/rfc', component: RfcComponent },
      { path: 'integration/sap/odata', component: OdataComponent },
      { path: 'integration/salesforce', component: SalesforceComponent },
      { path: 'integration/salesforce/soap', component: SoapComponent },
      { path: 'integration/salesforce/rest', component: RestComponent },
      { path: 'integration/rdbms', component: RdbmsComponent },
      { path: 'integration/rdbms/ibmdb2', component: IBMDB2Component },
      { path: 'integration/rdbms/mysql', component: MysqlComponent },
      { path: 'integration/rdbms/mssql', component: MsSqlComponent },
      { path: 'integration/rdbms/postgresql', component: PostGreSQLComponent },
      { path: 'integration/webservice', component: WebserviceComponent },
      { path: 'integration/webservice/cxml', component: CxmlComponent },
      { path: 'integration/webservice/ws-soap', component: WsSoapComponent },
      { path: 'integration/webservice/ws-rest', component: WsRestComponent },
      { path: 'integration/custom', component: CustomComponent },
      { path: 'integration/custom/xml', component: XmlComponent },
      { path: 'integration/custom/csv', component: CsvComponent },
      { path: 'integration/custom/api', component: ApiComponent },

      { path: 'advanced', component: AdvancedSettingsComponent },

      { path: 'integration/:scid/mapping', component: IntMappingComponent },
      { path: 'interfaces', component: InterfacesComponent }
    ]
  },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
