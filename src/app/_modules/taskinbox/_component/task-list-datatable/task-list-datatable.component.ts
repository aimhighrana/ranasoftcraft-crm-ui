import { ActivatedRoute } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
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

@Component({
	selector: 'pros-task-list-datatable',
	templateUrl: './task-list-datatable.component.html',
	styleUrls: ['./task-list-datatable.component.scss'],
})
export class TaskListDatatableComponent implements OnInit {
	displayedColumns: string[] = [
		'select',
		'setting',
		'Records',
		'description',
		'labels',
		'sent',
		'dueby',
		'requestby',
		'sentby',
	];
	dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
	selection = new SelectionModel<PeriodicElement>(true, []);
	node: string = null;
	savedSearchParameters: string = null;
	inlineFilters: string = null;

	constructor(private route: ActivatedRoute) {}

	ngOnInit(): void {
		this.route.params.subscribe((param) => {
			debugger;
			this.node = param.node || null;
		});
		this.route.queryParams.subscribe((queryParam) => {
			debugger;
			this.savedSearchParameters = queryParam['s'] || null;
			this.inlineFilters = queryParam['f'] || null;
		});
	}
}
