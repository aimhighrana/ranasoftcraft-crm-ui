import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaDetailsComponent } from './schema-details.component';
import { BreadcrumbComponent } from 'src/app/_components/breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OverviewChartComponent } from './overview-chart/overview-chart.component';

// describe('SchemaDetailsComponent', () => {
//   let component: SchemaDetailsComponent;
//   let fixture: ComponentFixture<SchemaDetailsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         AppMaterialModuleForSpec,
//         RouterTestingModule,
//         FormsModule,
//         ReactiveFormsModule
//       ],
//       declarations: [ SchemaDetailsComponent, BreadcrumbComponent, OverviewChartComponent ]
//     })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(SchemaDetailsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
