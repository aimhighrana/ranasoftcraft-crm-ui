import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SchemaRoutingModule } from './schema-routing.module';
import { SchemaTileComponent } from 'src/app/_modules/schema/_components/schema-tile/schema-tile.component';
import { SchemaDatatableComponent } from './_components/schema-details/schema-datatable/schema-datatable.component';
import { SchemaCollaboratorsComponent } from 'src/app/_modules/schema/_components/schema-collaborators/schema-collaborators.component';
import { SchemaExecutionComponent } from './_components/schema-execution/schema-execution.component';
import { SchemaExecutionDialogComponent } from './_components/schema-execution/schema-execution-dialog/schema-execution-dialog.component';
import { SchemaExecutionLogsComponent } from './_components/schema-execution-logs/schema-execution-logs.component';
import { UploadDataComponent } from './_components/upload-data-sidesheet/upload-data.component';
import { MapMdoFieldComponent } from './_components/upload-data-sidesheet/map-mdo-field/map-mdo-field.component';
import { AccessDeniedDialogComponent } from '@modules/shared/_components/access-denied-dialog/access-denied-dialog.component';
import { CollaboratorComponent } from './_components/collaborator/collaborator.component';
import { UploadDatasetComponent } from './_components/upload-dataset/upload-dataset.component';
import { SchemaDetailsComponent } from './_components/v2/schema-details/schema-details.component';
import { NewBusinessRulesComponent } from './_components/new-business-rules/new-business-rules.component';
import { NewSchemaCollaboratorsComponent } from './_components/new-schema-collaborators/new-schema-collaborators.component';
import { SaveVariantDialogComponent } from './_components/v2/save-variant-dialog/save-variant-dialog.component';
import { BrruleSideSheetComponent } from './_components/v2/brrule-side-sheet/brrule-side-sheet.component';
import { SchemaInfoComponent } from './_components/v2/schema-info/schema-info.component';
import { CreateSchemaComponent } from './_components/v2/create-schema/create-schema.component';
import { SubscriberSideSheetComponent } from './_components/v2/subscriber-side-sheet/subscriber-side-sheet.component';
import { BusinessrulelibraryDialogComponent } from './_components/businessrulelibrary-dialog/businessrulelibrary-dialog.component';
import { DatascopeSidesheetComponent } from './_components/datascope-sidesheet/datascope-sidesheet.component';
import { SchemaSummarySidesheetComponent } from './_components/schema-summary-sidesheet/schema-summary-sidesheet.component';
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
import { NounComponent } from './_components/v2/library-mapping-sidesheet/noun/noun.component';
import { ModifierComponent } from './_components/v2/library-mapping-sidesheet/modifier/modifier.component';
import { AttributeComponent } from './_components/v2/library-mapping-sidesheet/attribute/attribute.component';
import { NounModifierAutocompleteComponent } from './_components/v2/library-mapping-sidesheet/noun-modifier-autocomplete/noun-modifier-autocomplete.component';
import { ExecutionTrendSidesheetComponent } from './_components/v2/statistics/execution-trend-sidesheet/execution-trend-sidesheet.component';
import { SchemaProgressComponent } from './_components/schema-progress/schema-progress.component';
import { DownloadExecutionDataComponent } from './_components/v2/download-execution-data/download-execution-data.component';


@NgModule({
  declarations: [
    SchemaTileComponent,
    SchemaDetailsComponent,
    SchemaDatatableComponent,
    SchemaExecutionComponent,
    SchemaCollaboratorsComponent,
    SchemaExecutionDialogComponent,
    SchemaExecutionLogsComponent,
    UploadDataComponent,
    MapMdoFieldComponent,
    AccessDeniedDialogComponent,
    CollaboratorComponent,
    UploadDatasetComponent,
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
    DatascopeSidesheetComponent,
    SchemaSummarySidesheetComponent,
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
    NounComponent,
    ModifierComponent,
    AttributeComponent,
    NounModifierAutocompleteComponent,
    ExecutionTrendSidesheetComponent,
    SchemaProgressComponent,
    DownloadExecutionDataComponent
  ],
  imports: [
    CommonModule,
    SchemaRoutingModule,
    SharedModule
  ]
})
export class SchemaModule { }
