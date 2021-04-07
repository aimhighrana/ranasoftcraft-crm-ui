import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskListViewSettingsComponent } from './task-list-view-settings.component';

describe('TaskListViewSettingsComponent', () => {
	let component: TaskListViewSettingsComponent;
	let fixture: ComponentFixture<TaskListViewSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TaskListViewSettingsComponent],
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TaskListViewSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
