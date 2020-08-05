import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomEventsComponent } from './custom-events.component';
import { BreadcrumbComponent } from '../../../../shared/_components/breadcrumb/breadcrumb.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('CustomEventsComponent', () => {
  let component: CustomEventsComponent;
  let fixture: ComponentFixture<CustomEventsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      declarations: [ CustomEventsComponent, BreadcrumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
