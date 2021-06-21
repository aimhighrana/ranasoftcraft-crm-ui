import { NgModule } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
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
import { CloseScrollStrategy, Overlay, OverlayModule } from '@angular/cdk/overlay';
import { RouterModule } from '@angular/router';
import { BreadcrumbComponent } from './_components/breadcrumb/breadcrumb.component';
import { PageNotFoundComponent } from './_components/page-not-found/page-not-found.component';
import { AddTileComponent } from './_components/add-tile/add-tile.component';
import { SvgIconComponent } from './_components/svg-icon/svg-icon.component';
import { ChartsModule } from 'ng2-charts';
import { TableColumnSettingsComponent } from './_components/table-column-settings/table-column-settings.component';
import { ClickStopPropagationDirective } from './_directives/click-stop-propagation.directive';
import { SubstringPipe } from './_pipes/substringpipe.pipe';
import { ReplaceUnderscorePipe } from './_pipes/replaceUnderscore.pipe';
import { ThousandconvertorPipe } from './_pipes/thousandconvertor.pipe';
import { FormatTableHeadersPipe } from './_pipes/format-table-headers.pipe';
import { TagsEllipsisDirective } from './_directives/tags-ellipsis.directive';
import { ResizeableDirective } from './_directives/resizeable.directive';
import { BrConditionalFieldsComponent } from '@modules/admin/_components/module/business-rules/br-conditional-fields/br-conditional-fields.component';
import { UdrConditionOperatorsComponent } from '@modules/admin/_components/module/business-rules/user-defined-rule/udr-condition-operators/udr-condition-operators.component';
import { SearchInputComponent } from './_components/search-input/search-input.component';
import { FormInputComponent } from './_components/form-input/form-input.component';
import { AddFilterMenuComponent } from './_components/add-filter-menu/add-filter-menu.component';
import { NavigationDropdownComponent } from './_components/navigation-dropdown/navigation-dropdown.component';
import { FilterValuesComponent } from './_components/filter-values/filter-values.component';
import { ConfirmationDialogComponent } from './_components/confirmation-dialog/confirmation-dialog.component';
import { ResumeSessionComponent } from './_components/resume-session/resume-session.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TableCellInputComponent } from './_components/table-cell-input/table-cell-input.component';
import { ContainerRefDirective } from './_directives/container-ref.directive';
import { ScheduleComponent } from './_components/schedule/schedule.component'
import { DatePickerFieldComponent } from './_components/date-picker-field/date-picker-field.component';
import { NullStateComponent } from './_components/null-state/null-state/null-state.component';
import { FormInputAutoselectComponent } from './_components/form-input-autoselect/form-input-autoselect.component';
import { ScheduleDialogComponent } from './_components/schedule-dialog/schedule-dialog.component';
import { TransformationRuleComponent } from './_components/transformation-rule/transformation-rule.component';
import { LookupRuleComponent } from './_components/lookup/lookup.component';
import { LookupConfigComponent } from './_components/lookup/lookup-config/lookup-config.component';
import { SubscriberInviteComponent } from './_components/subscriber-invite/subscriber-invite.component';
import { ClassificationDatatableCellEditableComponent } from './_components/classification-datatable-cell-editable/classification-datatable-cell-editable.component';
import { SubscriberInviteSidesheetComponent } from './_components/subscriber-invite-sidesheet/subscriber-invite-sidesheet.component';
import { SchemaExecutionTrendComponent } from './_components/statistics/schema-execution-trend/schema-execution-trend.component';
import { InfiniteScrollDirective } from './_directives/infinite-scroll.directive';
import { MdoUiLibraryModule } from 'mdo-ui-library';
import { AutoCompleteScrollDirective } from './_directives/auto-complete-scroll.directive';
import { ResizableColumnDirective } from './_directives/resizable-column.directive';
import { DateFormatPipe } from './_pipes/date-format.pipe'
import { GenericFieldControlComponent } from './_components/generic-field-control/generic-field-control.component';
import { StatusBadgeDirective } from './_directives/status-badge.directive';
import { UDRValueControlComponent } from './_components/udr-value-control/udr-value-control.component';
import { OverlayLoaderComponent } from './_components/overlay-loader/overlay-loader.component';

@NgModule({
  declarations: [
    // directives
    ClickStopPropagationDirective,
    TagsEllipsisDirective,
    ContainerRefDirective,
    InfiniteScrollDirective,
    ResizableColumnDirective,
    // pipes
    SubstringPipe,
    ReplaceUnderscorePipe,
    ThousandconvertorPipe,
    DateFormatPipe,
    // shared components
    PageNotFoundComponent,
    BreadcrumbComponent,
    AddTileComponent,
    SvgIconComponent,
    TableColumnSettingsComponent,
    FormatTableHeadersPipe,
    ResizeableDirective,
    BrConditionalFieldsComponent,
    UdrConditionOperatorsComponent,
    SearchInputComponent,
    FormInputComponent,
    AddFilterMenuComponent,
    NavigationDropdownComponent,
    FilterValuesComponent,
    ConfirmationDialogComponent,
    ResumeSessionComponent,
    ScheduleComponent,
    DatePickerFieldComponent,
    TableCellInputComponent,
    NullStateComponent,
    FormInputAutoselectComponent,
    ScheduleDialogComponent,
    TransformationRuleComponent,
    LookupRuleComponent,
    LookupConfigComponent,
    SubscriberInviteComponent,
    ClassificationDatatableCellEditableComponent,
    SubscriberInviteSidesheetComponent,
    SchemaExecutionTrendComponent,
    AutoCompleteScrollDirective,
    GenericFieldControlComponent,
    UDRValueControlComponent,
    StatusBadgeDirective,
    OverlayLoaderComponent
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
    ChartsModule,
    ScrollingModule,
    MdoUiLibraryModule
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
    // MDO UI Library Module
    MdoUiLibraryModule,
    // chart module
    ChartsModule,
    ScrollingModule,
    // directives
    ClickStopPropagationDirective,
    TagsEllipsisDirective,
    ResizeableDirective,
    ContainerRefDirective,
    InfiniteScrollDirective,
    ResizableColumnDirective,
    // pipes
    SubstringPipe,
    ReplaceUnderscorePipe,
    ThousandconvertorPipe,
    FormatTableHeadersPipe,
    DateFormatPipe,
    // components
    PageNotFoundComponent,
    BreadcrumbComponent,
    AddTileComponent,
    SvgIconComponent,
    TableColumnSettingsComponent,
    BrConditionalFieldsComponent,
    UdrConditionOperatorsComponent,
    SearchInputComponent,
    FormInputComponent,
    FormInputAutoselectComponent,
    AddFilterMenuComponent,
    NavigationDropdownComponent,
    FilterValuesComponent,
    ScheduleComponent,
    DatePickerFieldComponent,
    TableCellInputComponent,
    TransformationRuleComponent,
    LookupRuleComponent,
    LookupConfigComponent,
    NullStateComponent,
    SubscriberInviteComponent,
    SubscriberInviteSidesheetComponent,
    SchemaExecutionTrendComponent,
    AutoCompleteScrollDirective,
    GenericFieldControlComponent,
    UDRValueControlComponent,
    StatusBadgeDirective,
    OverlayLoaderComponent
  ],
  providers: [
    TitleCasePipe,
    { provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY, useFactory: scrollFactory, deps: [Overlay] }
  ],
  entryComponents: [
    TableCellInputComponent
  ]
})
export class SharedModule { }

export function scrollFactory(overlay: Overlay): () => CloseScrollStrategy {
	return () => overlay.scrollStrategies.close();
}
