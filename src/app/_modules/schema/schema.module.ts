import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SchemaRoutingModule } from './schema-routing.module';
import { SchemaListComponent } from 'src/app/_modules/schema/_components/schema-list/schema-list.component';
import { SchemaGroupsComponent } from 'src/app/_modules/schema/_components/schema-groups/schema-groups.component';
import { SchemaTileComponent } from 'src/app/_modules/schema/_components/schema-tile/schema-tile.component';
import { OverviewChartComponent } from './_components/schema-details/overview-chart/overview-chart.component';
import { CategoriesChartComponent } from './_components/schema-details/categories-chart/categories-chart.component';
import { SchemaDatatableComponent } from './_components/schema-details/schema-datatable/schema-datatable.component';
import { SchemaVariantsComponent } from './_components/schema-variants/schema-variants.component';
import { SchemaStatusinfoDialogComponent } from './_components/schema-details/schema-statusinfo-dialog/schema-statusinfo-dialog.component';
import { SchemaGroupFormComponent } from 'src/app/_modules/schema/_components/schema-group-form/schema-group-form.component';
import { SchemaCollaboratorsComponent } from 'src/app/_modules/schema/_components/schema-collaborators/schema-collaborators.component';
import { SchemaExecutionComponent } from './_components/schema-execution/schema-execution.component';
import { SchemaExecutionDialogComponent } from './_components/schema-execution/schema-execution-dialog/schema-execution-dialog.component';
import { SchemaExecutionLogsComponent } from './_components/schema-execution-logs/schema-execution-logs.component';
import { UploadDataComponent } from './_components/upload-data-sidesheet/upload-data.component';
import { ExecutionSummaryComponent } from './_components/schema-details/execution-summary/execution-summary.component';
import { MapMdoFieldComponent } from './_components/upload-data-sidesheet/map-mdo-field/map-mdo-field.component';
import { SalesforceConnectionComponent } from './_components/salesforce-connection/salesforce-connection.component';
import { AccessDeniedDialogComponent } from '@modules/shared/_components/access-denied-dialog/access-denied-dialog.component';
import { DuplicateBusinessruleComponent } from './_components/duplicate-businessrule/duplicate-businessrule.component';
import { AdvanceoptionsDialogComponent } from './_components/advanceoptions-dialog/advanceoptions-dialog.component';
import { DuplicateDetailsComponent } from './_components/duplicate-details/duplicate-details.component';
import { CollaboratorComponent } from './_components/collaborator/collaborator.component';
import { CreateVariantComponent } from './_components/create-variant/create-variant.component';
import { WelcomeMdoComponent } from './_components/welcome-mdo/welcome-mdo.component';
import { UploadDatasetComponent } from './_components/upload-dataset/upload-dataset.component';
import { CreateRuleComponent } from './_components/create-rule/create-rule.component';
import { SidenavUserdefinedComponent } from './_components/sidenav-userdefined/sidenav-userdefined.component';
import { TableLoadingComponent } from './_components/table-loading/table-loading.component';
import { SchemaDetailsComponent } from './_components/v2/schema-details/schema-details.component';
import { NewBusinessRulesComponent } from './_components/new-business-rules/new-business-rules.component';
import { NewSchemaCollaboratorsComponent } from './_components/new-schema-collaborators/new-schema-collaborators.component';
import { SaveVariantDialogComponent } from './_components/v2/save-variant-dialog/save-variant-dialog.component';
import { BrruleSideSheetComponent } from './_components/v2/brrule-side-sheet/brrule-side-sheet.component';
import { SchemaInfoComponent } from './_components/v2/schema-info/schema-info.component';
import { CreateSchemaComponent } from './_components/v2/create-schema/create-schema.component';
import { SubscriberSideSheetComponent } from './_components/v2/subscriber-side-sheet/subscriber-side-sheet.component';
import { BusinessrulelibraryDialogComponent } from './_components/businessrulelibrary-dialog/businessrulelibrary-dialog.component';
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
import { LibraryMappingSidesheetComponent } from './_components/v2/library-mapping-sidesheet/library-mapping-sidesheet.component';
import { ExclusionsSidesheetComponent } from './_components/v2/brrule-side-sheet/duplicate-rule-config/exclusions-sidesheet/exclusions-sidesheet.component';
import { SetupDuplicateRuleComponent } from './_components/v2/brrule-side-sheet/duplicate-rule-config/setup-duplicate-rule/setup-duplicate-rule.component';
import { ClassificationBuilderComponent } from './_components/v2/classification/classification-builder/classification-builder.component';
import { DetailBuilderComponent } from './_components/v2/_builder/detail-builder/detail-builder.component';
import { PotextViewComponent } from './_components/v2/potext/potext-view/potext-view.component';
import { SchemaListsComponent } from './_components/v2/schema-lists/schema-lists.component';
import { BusinessrulelibrarySidesheetComponent } from './_components/businessrulelibrary-sidesheet/businessrulelibrary-sidesheet.component';
import { GroupDataTableComponent } from './_components/v2/duplicacy/group-data-table/group-data-table.component';
import { DuplicacyComponent } from './_components/v2/duplicacy/duplicacy.component';
import { StaticsComponent } from './_components/v2/statics/statics.component';
import { ExecutionResultComponent } from './_components/v2/statics/execution-result/execution-result.component';
import { ExecutionTrendComponent } from './_components/v2/statics/execution-trend/execution-trend.component';
import { BusinessCaseRuleComponent } from './_components/business-case-rule/business-case-rule.component';
import { BusinessConcatenationComponent } from './_components/business-concatenation/business-concatenation.component';
import { NounComponent } from './_components/v2/library-mapping-sidesheet/noun/noun.component';
import { ModifierComponent } from './_components/v2/library-mapping-sidesheet/modifier/modifier.component';
import { AttributeComponent } from './_components/v2/library-mapping-sidesheet/attribute/attribute.component';
import { NounModifierAutocompleteComponent } from './_components/v2/library-mapping-sidesheet/noun-modifier-autocomplete/noun-modifier-autocomplete.component';
import { NewPrimaryNavbarComponent } from './_components/new-primary-navbar/new-primary-navbar.component';
import { CheckdataProgressComponent } from './_components/checkdata-progress/checkdata-progress.component';


@NgModule({
  declarations: [
    SchemaListComponent,
    SchemaGroupsComponent,
    SchemaTileComponent,
    SchemaDetailsComponent,
    OverviewChartComponent,
    CategoriesChartComponent,
    SchemaDatatableComponent,
    SchemaVariantsComponent,
    SchemaStatusinfoDialogComponent,
    SchemaGroupFormComponent,
    SchemaExecutionComponent,
    SchemaCollaboratorsComponent,
    SchemaExecutionDialogComponent,
    SchemaExecutionLogsComponent,
    UploadDataComponent,
    ExecutionSummaryComponent,
    MapMdoFieldComponent,
    SalesforceConnectionComponent,
    AccessDeniedDialogComponent,
    DuplicateBusinessruleComponent,
    AdvanceoptionsDialogComponent,
    DuplicateDetailsComponent,
    CollaboratorComponent,
    CreateVariantComponent,
    UploadDatasetComponent,
    WelcomeMdoComponent,
    CreateRuleComponent,
    SidenavUserdefinedComponent,
    TableLoadingComponent,
    SchemaDetailsComponent,
    NewBusinessRulesComponent,
    NewBusinessRulesComponent,
    NewSchemaCollaboratorsComponent,
    SaveVariantDialogComponent,
    BrruleSideSheetComponent,
    SchemaInfoComponent,
    CreateSchemaComponent,
    SubscriberSideSheetComponent,
    CreateSchemaComponent,
    BusinessrulelibraryDialogComponent,
    DuplicateDatacheckSidesheetComponent,
    DatascopeSidesheetComponent,
    ConfigureSidesheetComponent,
    AttributeMappingComponent,
    BrClassificationSidesheetComponent,
    BrDuplicatecheckSidesheetComponent,
    SchemaSummarySidesheetComponent,
    NewDuplicateCheckComponent,
    StringReplaceComponent,
    EmptyDataComponent,
    RunningProgressComponent,
    ExclusionsSidesheetComponent,
    LibraryMappingSidesheetComponent,
    ClassificationBuilderComponent,
    DetailBuilderComponent,
    PotextViewComponent,
    SchemaListsComponent,
    SetupDuplicateRuleComponent,
    BusinessrulelibrarySidesheetComponent,
    // PotextCatalogcheckComponent,
    GroupDataTableComponent,
    DuplicacyComponent,
    StaticsComponent,
    ExecutionResultComponent,
    ExecutionTrendComponent,
    BusinessCaseRuleComponent,
    BusinessConcatenationComponent,
    NounComponent,
    ModifierComponent,
    AttributeComponent,
    NounModifierAutocompleteComponent,
    NewPrimaryNavbarComponent,
    CheckdataProgressComponent
  ],
  imports: [
    CommonModule,
    SchemaRoutingModule,
    SharedModule
  ]
})
export class SchemaModule { }
