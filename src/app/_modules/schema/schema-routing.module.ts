import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../shared/_components/page-not-found/page-not-found.component';
import { SchemaGroupFormComponent } from 'src/app/_modules/schema/_components/schema-group-form/schema-group-form.component';
import { SchemaVariantsComponent } from './_components/schema-variants/schema-variants.component';
import { SchemaExecutionComponent } from './_components/schema-execution/schema-execution.component';
import { SchemaCollaboratorsComponent } from 'src/app/_modules/schema/_components/schema-collaborators/schema-collaborators.component';
import { SchemaExecutionLogsComponent } from './_components/schema-execution-logs/schema-execution-logs.component';
import { AddbusinessruleComponent } from '../admin/_components/module/business-rules/addbusinessrule/addbusinessrule.component';
import { TableColumnSettingsComponent } from '../shared/_components/table-column-settings/table-column-settings.component';
import { UploadDataComponent } from './_components/upload-data-sidesheet/upload-data.component';
import { SalesforceConnectionComponent } from './_components/salesforce-connection/salesforce-connection.component';
import { DuplicateBusinessruleComponent } from './_components/duplicate-businessrule/duplicate-businessrule.component';
import { AdvanceoptionsDialogComponent } from './_components/advanceoptions-dialog/advanceoptions-dialog.component';
import { DuplicateDetailsComponent } from './_components/duplicate-details/duplicate-details.component';
import { DiwCreateSchemaComponent } from '../admin/_components/module/schema/diw-create-schema/diw-create-schema.component';
import { DiwCreateBusinessruleComponent } from '../admin/_components/module/schema/diw-create-businessrule/diw-create-businessrule.component';
import { CreateVariantComponent } from './_components/create-variant/create-variant.component';
import { WelcomeMdoComponent } from './_components/welcome-mdo/welcome-mdo.component';
import { UploadDatasetComponent } from './_components/upload-dataset/upload-dataset.component';
import { PrimaryNavbarComponent } from './_components/primary-navbar/primary-navbar.component';
import { CreateRuleComponent } from './_components/create-rule/create-rule.component';
import { SecondaryNavbarComponent } from './_components/secondary-navbar/secondary-navbar.component';
import { SidenavUserdefinedComponent } from './_components/sidenav-userdefined/sidenav-userdefined.component';
import { TableLoadingComponent } from './_components/table-loading/table-loading.component';
import { MdoGenericComponentsComponent } from '@modules/lib/_components/mdo-generic-components/mdo-generic-components.component';
import { CreateSchemaComponent } from './_components/v2/create-schema/create-schema.component';
import { SchemaInfoComponent } from './_components/v2/schema-info/schema-info.component';
import { BrruleSideSheetComponent } from './_components/v2/brrule-side-sheet/brrule-side-sheet.component';
import { SubscriberSideSheetComponent } from './_components/v2/subscriber-side-sheet/subscriber-side-sheet.component';
import { DuplicateDatacheckSidesheetComponent } from './_components/duplicate-datacheck-sidesheet/duplicate-datacheck-sidesheet.component';
import { DatascopeSidesheetComponent } from './_components/datascope-sidesheet/datascope-sidesheet.component';
import { ConfigureSidesheetComponent } from './_components/configure-sidesheet/configure-sidesheet.component';
import { AttributeMappingComponent } from './_components/attribute-mapping/attribute-mapping.component';
import { BrClassificationSidesheetComponent } from './_components/br-classification-sidesheet/br-classification-sidesheet.component';
import { BrDuplicatecheckSidesheetComponent } from './_components/br-duplicatecheck-sidesheet/br-duplicatecheck-sidesheet.component';
import { SchemaSummarySidesheetComponent } from './_components/schema-summary-sidesheet/schema-summary-sidesheet.component';
import { NewDuplicateCheckComponent } from './_components/new-duplicate-check/new-duplicate-check.component';
import { StringReplaceComponent } from './_components/string-replace/string-replace.component';
import { EmptyDataComponent } from './_components/empty-data/empty-data.component';
import { RunningProgressComponent } from './_components/running-progress/running-progress.component';
import { InvitePeopleComponent } from './_components/invite-people/invite-people.component';
import { ScheduleComponent } from '@modules/shared/_components/schedule/schedule.component';
import { NewAttributeSidesheetComponent } from './_components/new-attribute-sidesheet/new-attribute-sidesheet.component';
import { NewModifierSidesheetComponent } from './_components/new-modifier-sidesheet/new-modifier-sidesheet.component';
import { NewNounSidesheetComponent } from './_components/new-noun-sidesheet/new-noun-sidesheet.component';
import { LibraryMappingSidesheetComponent } from './_components/library-mapping-sidesheet/library-mapping-sidesheet.component';
import { ExclusionsSidesheetComponent } from './_components/v2/brrule-side-sheet/duplicate-rule-config/exclusions-sidesheet/exclusions-sidesheet.component';
import { DetailBuilderComponent } from './_components/v2/_builder/detail-builder/detail-builder.component';
import { SchemaListsComponent } from './_components/v2/schema-lists/schema-lists.component';
import { BusinessrulelibrarySidesheetComponent } from './_components/businessrulelibrary-sidesheet/businessrulelibrary-sidesheet.component';
import { StaticsComponent } from './_components/v2/statics/statics.component';
import { BusinessCaseRuleComponent } from './_components/business-case-rule/business-case-rule.component';
import { BusinessConcatenationComponent } from './_components/business-concatenation/business-concatenation.component';
import { SubscriberInviteSidesheetComponent } from '@modules/shared/_components/subscriber-invite-sidesheet/subscriber-invite-sidesheet.component';

const routes: Routes = [
  { path: 'group/:groupId', component: SchemaGroupFormComponent },
  // { path: 'schema-list/:schemaGrpId', component: SchemaListComponent },
  { path: 'schema-details/:moduleId/:schemaId', component: DetailBuilderComponent },
  { path: 'schema-variants/:moduleId/:schemaId', component: SchemaVariantsComponent },
  { path: 'schema-execution/:schemaId', component: SchemaExecutionComponent },
  { path: 'collab/:schemaId', component: SchemaCollaboratorsComponent },
  { path: 'execution-logs/:schemaId', component: SchemaExecutionLogsComponent },
  { path: 'addbusinessrule', component: AddbusinessruleComponent },
  { path: 'table-column-settings', component: TableColumnSettingsComponent },
  { path: 'uploaddata', component: UploadDataComponent },
  { path: 'create-schema/:schemaId', component: CreateSchemaComponent },
  { path: 'create-schema/:moduleId/:schemaId', component: CreateSchemaComponent },
  { path: 'salesforce-connection', component: SalesforceConnectionComponent },
  { path: 'duplicate-businessrule', component: DuplicateBusinessruleComponent },
  { path: 'advanceoptions-dialog', component: AdvanceoptionsDialogComponent },
  { path: 'duplicate-details', component: DuplicateDetailsComponent },
  { path: 'diw-create-schema', component: DiwCreateSchemaComponent },
  { path: 'diw-create-businessrule', component: DiwCreateBusinessruleComponent },
  { path: 'schema-variants/create-variant/:moduleId/:schemaId/:variantId', component: CreateVariantComponent },
  { path: 'welcome', component: WelcomeMdoComponent },
  { path: 'upload-dataset', component: UploadDatasetComponent },
  { path: 'welcome-mdo', component: WelcomeMdoComponent },
  { path: 'upload-dataset', component: UploadDatasetComponent },
  { path: 'primary-navbar', component: PrimaryNavbarComponent },
  { path: 'secondary-navbar', component: SecondaryNavbarComponent },
  { path: 'create-rule', component: CreateRuleComponent },
  { path: 'setup-br-exclusion', component: ExclusionsSidesheetComponent },
  { path: ':moduleId', component: SchemaListsComponent },
  { path: 'sidenav-userdefined', component: SidenavUserdefinedComponent },
  { path: 'table-loading', component: TableLoadingComponent },
  { path: 'upload-data/:moduleId/:outlet', component: UploadDataComponent },
  { path: 'mdo-generic-components', component: MdoGenericComponentsComponent },
  { path: 'schema-info/:moduleId/:schemaId', component: SchemaInfoComponent },
  { path: 'business-rule/:moduleId/:schemaId/:brId', component: BrruleSideSheetComponent },
  { path: 'subscriber/:moduleId/:schemaId/:subscriberId', component: SubscriberSideSheetComponent },
  { path: 'subscriber/:moduleId/:schemaId/:subscriberId/:outlet', component: SubscriberSideSheetComponent },
  { path: 'system/duplicate-datacheck-sidesheet', component: DuplicateDatacheckSidesheetComponent },
  { path: 'data-scope/:moduleId/:schemaId/:variantId', component: DatascopeSidesheetComponent },
  { path: 'system/configure-sidesheet', component: ConfigureSidesheetComponent },
  { path: 'system/attribute-mapping', component: AttributeMappingComponent },
  { path: 'system/br-classification-sidesheet', component: BrClassificationSidesheetComponent },
  { path: 'system/br-duplicatecheck-sidesheet', component: BrDuplicatecheckSidesheetComponent },
  { path: 'check-data/:moduleId/:schemaId', component: SchemaSummarySidesheetComponent },
  { path: 'system/new-duplicate-check', component: NewDuplicateCheckComponent },
  { path: 'system/string-replace', component: StringReplaceComponent },
  { path: 'system/empty-data', component: EmptyDataComponent },
  { path: 'system/running-progress', component: RunningProgressComponent },
  { path: 'system/invite-people', component: InvitePeopleComponent },
  { path: 'schedule/:schemaId/:scheduleId', component: ScheduleComponent},
  { path: 'system/exclusions-sidesheet', component: ExclusionsSidesheetComponent },
  { path: 'system/new-attribute-sidesheet', component: NewAttributeSidesheetComponent },
  { path: 'system/new-modifier-sidesheet', component: NewModifierSidesheetComponent },
  { path: 'system/new-noun-sidesheet', component: NewNounSidesheetComponent },
  { path: 'system/library-mapping-sidesheet', component: LibraryMappingSidesheetComponent },
  { path: 'businessrule-library/:moduleId/:schemaId/:outlet', component: BusinessrulelibrarySidesheetComponent},
  { path: ':moduleId/statics/:schemaId', component: StaticsComponent },
  { path: 'system/business-case-rule', component: BusinessCaseRuleComponent },
  { path: 'system/business-concatenation', component: BusinessConcatenationComponent },
  { path: 'invite-subscriber/:moduleId/:schemaId', component: SubscriberInviteSidesheetComponent},

  // anything not mapped should go to page not found component
  { path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchemaRoutingModule { }
