import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ScheduleTabComponent } from './schedule-tab.component';

describe('ScheduleTabComponent', () => {
  let component: ScheduleTabComponent;
  let fixture: ComponentFixture<ScheduleTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleTabComponent, FormInputComponent ],
      imports: [AppMaterialModuleForSpec, HttpClientTestingModule, ReactiveFormsModule, FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
