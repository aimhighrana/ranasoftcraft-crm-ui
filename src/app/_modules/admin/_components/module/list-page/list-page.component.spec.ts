import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPageComponent } from './list-page.component';
import { BreadcrumbComponent } from '../../../../shared/_components/breadcrumb/breadcrumb.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('ListPageComponent', () => {
  let component: ListPageComponent;
  let fixture: ComponentFixture<ListPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ ListPageComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
