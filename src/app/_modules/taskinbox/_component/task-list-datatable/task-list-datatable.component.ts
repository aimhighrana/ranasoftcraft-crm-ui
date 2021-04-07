import { ViewsPage } from '@models/list-page/listpage';
import { MatSort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
	Records: string;
	setting: number;
	description: number;
	labels: string;
	sent: string;
	dueby: string;
	requestby: string;
	sentby: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
	{
		setting: 1,
		Records: 'Hydrogen',
		description: 1.0079,
		labels: 'H',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 2,
		Records: 'Helium',
		description: 4.0026,
		labels: 'He',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 3,
		Records: 'Lithium',
		description: 6.941,
		labels: 'Li',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 4,
		Records: 'Beryllium',
		description: 9.0122,
		labels: 'Be',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 5,
		Records: 'Boron',
		description: 10.811,
		labels: 'B',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 6,
		Records: 'Carbon',
		description: 12.0107,
		labels: 'C',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 7,
		Records: 'Nitrogen',
		description: 14.0067,
		labels: 'N',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 8,
		Records: 'Oxygen',
		description: 15.9994,
		labels: 'O',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 9,
		Records: 'Fluorine',
		description: 18.9984,
		labels: 'F',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
	{
		setting: 10,
		Records: 'Neon',
		description: 20.1797,
		labels: 'Ne',
		sent: 'L',
		dueby: 'L',
		requestby: 'L',
		sentby: 'L',
	},
];

const NODEFIELDS: { [node: string]: { fldId: string; fldDesc: string }[] } = {
	inbox: [
		{
			fldId: 'description',
			fldDesc: 'Description',
		},
		{
			fldId: 'labels',
			fldDesc: 'Labels',
		},
		{
			fldId: 'sent',
			fldDesc: 'Sent',
		},
		{
			fldId: 'dueby',
			fldDesc: 'Due by',
		},
		{
			fldId: 'requestby',
			fldDesc: 'Request by',
		},
		{
			fldId: 'sentby',
			fldDesc: 'Sent by',
		},
	],
	in_workflow: [
		{
			fldId: 'description',
			fldDesc: 'Description',
		},
		{
			fldId: 'labels',
			fldDesc: 'Labels',
		},
		{
			fldId: 'sent',
			fldDesc: 'Sent',
		},
		{
			fldId: 'requestby',
			fldDesc: 'Request by',
		},
		{
			fldId: 'sentby',
			fldDesc: 'Sent by',
		},
	],
	rejected: [
		{
			fldId: 'description',
			fldDesc: 'Description',
		},
		{
			fldId: 'labels',
			fldDesc: 'Labels',
		},
		{
			fldId: 'sent',
			fldDesc: 'Sent',
		},
		{
			fldId: 'dueby',
			fldDesc: 'Due by',
		},
		{
			fldId: 'sentby',
			fldDesc: 'Sent by',
		},
	],
	draft: [
		{
			fldId: 'description',
			fldDesc: 'Description',
		},
		{
			fldId: 'labels',
			fldDesc: 'Labels',
		},
		{
			fldId: 'sent',
			fldDesc: 'Sent',
		},
		{
			fldId: 'dueby',
			fldDesc: 'Due by',
		},
		{
			fldId: 'requestby',
			fldDesc: 'Request by',
		},
	],
	completed: [
		{
			fldId: 'description',
			fldDesc: 'Description',
		},
		{
			fldId: 'labels',
			fldDesc: 'Labels',
		},
		{
			fldId: 'dueby',
			fldDesc: 'Due by',
		},
		{
			fldId: 'requestby',
			fldDesc: 'Request by',
		},
		{
			fldId: 'sentby',
			fldDesc: 'Sent by',
		},
	],
};

@Component({
	selector: 'pros-task-list-datatable',
	templateUrl: './task-list-datatable.component.html',
	styleUrls: ['./task-list-datatable.component.scss'],
})
export class TaskListDatatableComponent implements OnInit, AfterViewInit {
	displayedColumns: string[] = [
		// 'select',
		// 'setting',
		// 'Records',
		// 'description',
		// 'labels',
		// 'sent',
		// 'dueby',
		// 'requestby',
		// 'sentby',
	];
	staticColumns: string[] = ['select', 'setting', 'Records'];
	dataSource: MatTableDataSource<PeriodicElement>;
	selection: SelectionModel<PeriodicElement>;
	node: string = null;
	nodeColumns: { fldId: string; fldDesc: string }[] = [];
	savedSearchParameters: string = null;
	inlineFilters: string = null;
	pageEvent: { pageIndex: number; pageSize: number; length: number } = {
		pageIndex: 0,
		pageSize: 10,
		length: 0, // totalCount
	};
	isLoadingResults = false;

	viewsList: ViewsPage = new ViewsPage();

	// @ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.params.subscribe((param) => {
			this.node = param.node || null;
			this.nodeColumns = NODEFIELDS[this.node];
			this.displayedColumns = this.nodeColumns.map((d) => d.fldId);
			this.displayedColumns.unshift('select', 'setting', 'Records');
			this.dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
			this.selection = new SelectionModel<PeriodicElement>(true, []);
		});
		this.route.queryParams.subscribe((queryParam) => {
			this.savedSearchParameters = queryParam.s || null;
			this.inlineFilters = queryParam.f || null;
		});
	}

	ngAfterViewInit() {
		this.sort.sortChange.subscribe(() => {
			// this.paginator.pageIndex = 0;
			this.pageEvent.pageIndex = 0;
		});
	}

	/** Whether the number of selected elements matches the total number of rows. */
	isAllSelected() {
		// const numSelected = this.selection.selected.length;
		// const numRows = this.dataSource.docLength();
		// return numSelected === numRows;
		return false;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		// this.isAllSelected() ? this.selection.clear() : this.dataSource.docValue().forEach((row) => this.selection.select(row));
	}

	/** The label for the checkbox on the passed row */
	checkboxLabel(row?: any): string {
		if (!row) {
			return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
		}
	}

	onPageChange(event: PageEvent) {
		this.pageEvent.pageIndex = event.pageIndex;
		// this.getTableData();
	}
	isStaticCol(dynCol) {
		return this.staticColumns.includes(dynCol);
	}
	getFieldDesc(dynCol) {
		const field = this.nodeColumns.find((f) => f.fldId === dynCol);
		return field ? field.fldDesc || 'Unkown' : dynCol || 'Unkown';
	}
}
