import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SchemaRoutingModule } from './schema-routing.module';
import { SchemaListComponent } from 'src/app/_modules/schema/_components/schema-list/schema-list.component';
import { SchemaGroupsComponent } from 'src/app/_modules/schema/_components/schema-groups/schema-groups.component';
import { SchemaTileComponent } from 'src/app/_modules/schema/_components/schema-tile/schema-tile.component';
import { SchemaDetailsComponent } from 'src/app/_components/home/schema/schema-details/schema-details.component';
import { OverviewChartComponent } from 'src/app/_components/home/schema/schema-details/overview-chart/overview-chart.component';
import { CategoriesChartComponent } from 'src/app/_components/home/schema/schema-details/categories-chart/categories-chart.component';
import { BusinessRulesChartComponent } from 'src/app/_components/home/schema/schema-details/business-rules-chart/business-rules-chart.component';
import { SchemaDatatableComponent } from 'src/app/_components/home/schema/schema-details/schema-datatable/schema-datatable.component';
import { SchemaVariantsComponent } from 'src/app/_components/home/schema/schema-variants/schema-variants.component';
import { SchemaStatusinfoDialogComponent } from 'src/app/_components/home/schema/schema-details/schema-statusinfo-dialog/schema-statusinfo-dialog.component';
import { SchemaGroupFormComponent } from 'src/app/_modules/schema/_components/schema-group-form/schema-group-form.component';
import { SchemaExecutionComponent } from 'src/app/_components/home/schema/schema-execution/schema-execution.component';
import { SchemaCollaboratorsComponent } from 'src/app/_modules/schema/_components/schema-collaborators/schema-collaborators.component';
import { CreateSchemaComponent } from 'src/app/_components/home/schema/create-schema/create-schema.component';
import { AddbusinessruleComponent } from 'src/app/_components/home/schema/addbusinessrule/addbusinessrule.component';

@NgModule({
  declarations: [
    SchemaListComponent,
    SchemaGroupsComponent,
    SchemaTileComponent,
    SchemaDetailsComponent,
    OverviewChartComponent,
    CategoriesChartComponent,
    BusinessRulesChartComponent,
    SchemaDatatableComponent,
    SchemaVariantsComponent,
    SchemaStatusinfoDialogComponent,
    SchemaGroupFormComponent,
    SchemaExecutionComponent,
    SchemaCollaboratorsComponent,
    CreateSchemaComponent,
    AddbusinessruleComponent
  ],
  imports: [
    CommonModule,
    SchemaRoutingModule,
    SharedModule
  ],
  entryComponents: [ SchemaStatusinfoDialogComponent ]
})
export class SchemaModule { }
