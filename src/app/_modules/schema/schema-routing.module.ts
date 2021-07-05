import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { SchemaExecutionComponent } from './_components/schema-execution/schema-execution.component';
import { SchemaCollaboratorsComponent } from 'src/app/_modules/schema/_components/schema-collaborators/schema-collaborators.component';
import { SchemaExecutionLogsComponent } from './_components/schema-execution-logs/schema-execution-logs.component';
import { AddbusinessruleComponent } from '../admin/_components/module/business-rules/addbusinessrule/addbusinessrule.component';
import { TableColumnSettingsComponent } from '../shared/_components/table-column-settings/table-column-settings.component';
import { UploadDataComponent } from './_components/upload-data-sidesheet/upload-data.component';
import { DiwCreateSchemaComponent } from '../admin/_components/module/schema/diw-create-schema/diw-create-schema.component';
import { DiwCreateBusinessruleComponent } from '../admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { UploadDatasetComponent } from './_components/upload-dataset/upload-dataset.component';
import { SecondaryNavbarComponent } from '../home/_components/secondary-navbar/secondary-navbar.component';
import { MdoGenericComponentsComponent } from '@modules/lib/_components/mdo-generic-components/mdo-generic-components.component';
import { CreateSchemaComponent } from './_components/v2/create-schema/create-schema.component';
import { SchemaInfoComponent } from './_components/v2/schema-info/schema-info.component';
import { BrruleSideSheetComponent } from './_components/v2/brrule-side-sheet/brrule-side-sheet.component';
import { SubscriberSideSheetComponent } from './_components/v2/subscriber-side-sheet/subscriber-side-sheet.component';
import { DatascopeSidesheetComponent } from './_components/datascope-sidesheet/datascope-sidesheet.component';
import { SchemaSummarySidesheetComponent } from './_components/schema-summary-sidesheet/schema-summary-sidesheet.component';
import { RunningProgressComponent } from './_components/running-progress/running-progress.component';
import { ScheduleComponent } from '@modules/shared/_components/schedule/schedule.component';
import { LibraryMappingSidesheetComponent } from './_components/v2/library-mapping-sidesheet/library-mapping-sidesheet.component';
import { ExclusionsSidesheetComponent } from './_components/v2/brrule-side-sheet/duplicate-rule-config/exclusions-sidesheet/exclusions-sidesheet.component';
import { DetailBuilderComponent } from './_components/v2/_builder/detail-builder/detail-builder.component';
import { SchemaListsComponent } from './_components/v2/schema-lists/schema-lists.component';
import { BusinessrulelibrarySidesheetComponent } from './_components/businessrulelibrary-sidesheet/businessrulelibrary-sidesheet.component';
import { StaticsComponent } from './_components/v2/statics/statics.component';
import { SubscriberInviteSidesheetComponent } from '@modules/shared/_components/subscriber-invite-sidesheet/subscriber-invite-sidesheet.component';
import { AttributeComponent } from './_components/v2/library-mapping-sidesheet/attribute/attribute.component';
import { NounComponent } from './_components/v2/library-mapping-sidesheet/noun/noun.component';
import { ModifierComponent } from './_components/v2/library-mapping-sidesheet/modifier/modifier.component';
import { ExecutionTrendSidesheetComponent } from './_components/v2/statistics/execution-trend-sidesheet/execution-trend-sidesheet.component';
import { SchemaProgressComponent } from './_components/schema-progress/schema-progress.component';

const routes: Routes = [
  { path: 'schema-details/:moduleId/:schemaId', component: DetailBuilderComponent },
  { path: 'schema-execution/:schemaId', component: SchemaExecutionComponent },
  { path: 'collab/:schemaId', component: SchemaCollaboratorsComponent },
  { path: 'execution-logs/:schemaId', component: SchemaExecutionLogsComponent },
  { path: 'addbusinessrule', component: AddbusinessruleComponent },
  { path: 'table-column-settings', component: TableColumnSettingsComponent },
  { path: 'attribute-mapping/:moduleId/:nounCode/:modCode', component: LibraryMappingSidesheetComponent },
  { path: 'attribute/:nounSno', component: AttributeComponent },
  { path: 'noun/:moduleId/:matlGroup', component: NounComponent },
  { path: 'modifier/:moduleId/:matlGroup/:nounCode', component: ModifierComponent },
  { path: 'uploaddata', component: UploadDataComponent },
  { path: 'create-schema/:schemaId', component: CreateSchemaComponent },
  { path: 'create-schema/:moduleId/:schemaId', component: CreateSchemaComponent },
  { path: 'diw-create-schema', component: DiwCreateSchemaComponent },
  { path: 'diw-create-businessrule', component: DiwCreateBusinessruleComponent },
  { path: 'upload-dataset', component: UploadDatasetComponent },
  { path: 'upload-dataset', component: UploadDatasetComponent },
  { path: 'secondary-navbar', component: SecondaryNavbarComponent },
  { path: 'setup-br-exclusion', component: ExclusionsSidesheetComponent },
  { path: ':moduleId', component: SchemaListsComponent, pathMatch: 'full' },
  { path: 'upload-data/:moduleId/:outlet', component: UploadDataComponent },
  { path: 'mdo-generic-components', component: MdoGenericComponentsComponent },
  { path: 'schema-info/:moduleId/:schemaId', component: SchemaInfoComponent },
  { path: 'business-rule/:moduleId/:schemaId/:brId', component: BrruleSideSheetComponent },
  { path: 'business-rule/:moduleId/:schemaId/:brId/:outlet',pathMatch:'full', component: BrruleSideSheetComponent },
  { path: 'subscriber/:moduleId/:schemaId/:subscriberId', component: SubscriberSideSheetComponent },
  { path: 'subscriber/:moduleId/:schemaId/:subscriberId/:outlet', component: SubscriberSideSheetComponent },
  { path: 'data-scope/:moduleId/:schemaId/:variantId/:outlet', component: DatascopeSidesheetComponent },
  { path: 'execution-trend/:moduleId/:schemaId/:variantId', component: ExecutionTrendSidesheetComponent },
  { path: 'check-data/:moduleId/:schemaId', component: SchemaSummarySidesheetComponent },
  { path: 'system/running-progress', component: RunningProgressComponent },
  { path: 'schedule/:schemaId/:scheduleId', component: ScheduleComponent},
  { path: 'system/exclusions-sidesheet', component: ExclusionsSidesheetComponent },
  { path: 'system/library-mapping-sidesheet', component: LibraryMappingSidesheetComponent },
  { path: 'businessrule-library/:moduleId/:schemaId/:outlet', component: BusinessrulelibrarySidesheetComponent},
  { path: ':moduleId/statics/:schemaId', component: StaticsComponent },
  { path: 'invite-subscriber/:moduleId/:schemaId/:outlet', component: SubscriberInviteSidesheetComponent},
  { path: 'system/schema-progress', component: SchemaProgressComponent },
  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaRoutingModule { }
