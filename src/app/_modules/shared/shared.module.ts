import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatLineModule, MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './_components/breadcrumb/breadcrumb.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { AddTileComponent } from './_components/add-tile/add-tile.component';
import { SvgIconComponent } from './_components/svg-icon/svg-icon.component';
import { ChartsModule } from 'ng2-charts';
import { TableColumnSettingsComponent } from './_components/table-column-settings/table-column-settings.component';
import { ClickStopPropagationDirective } from './_directives/click-stop-propagation.directive';
import { SubstringPipe } from './_pipes/substringpipe.pipe';
import { ThousandconvertorPipe } from './_pipes/thousandconvertor.pipe';
import { FormatTableHeadersPipe } from './_pipes/format-table-headers.pipe';
import { TagsEllipsisDirective } from './_directives/tags-ellipsis.directive';
import { ResizeableDirective } from './_directives/resizeable.directive';
import { BrConditionalFieldsComponent } from '@modules/admin/_components/module/business-rules/br-conditional-fields/br-conditional-fields.component';
import { UdrConditionOperatorsComponent } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-condition-operators/udr-condition-operators.component';

@NgModule({
  declarations: [
    // directives
    ClickStopPropagationDirective,
    TagsEllipsisDirective,
    // pipes
    SubstringPipe,
    ThousandconvertorPipe,
    // shared components
    PageNotFoundComponent,
    BreadcrumbComponent,
    AddTileComponent,
    SvgIconComponent,
    TableColumnSettingsComponent,
    FormatTableHeadersPipe,
    ResizeableDirective,
    BrConditionalFieldsComponent,
    UdrConditionOperatorsComponent
  ],
  imports: [
    // ng modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    // material modules
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
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
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    DragDropModule,
    OverlayModule,
    // chart module
    ChartsModule
  ],
  exports: [
    // modules
    // ng modules
    FormsModule,
    ReactiveFormsModule,
    // material modules
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatLineModule,
    MatListModule,
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
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatTreeModule,
    DragDropModule,
    OverlayModule,
    // chart module
    ChartsModule,
    // directives
    ClickStopPropagationDirective,
    TagsEllipsisDirective,
    ResizeableDirective,
    // pipes
    SubstringPipe,
    ThousandconvertorPipe,
    FormatTableHeadersPipe,
    // components
    PageNotFoundComponent,
    BreadcrumbComponent,
    AddTileComponent,
    SvgIconComponent,
    TableColumnSettingsComponent,
    BrConditionalFieldsComponent,
    UdrConditionOperatorsComponent
  ]
})
export class SharedModule { }
