import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ScheduleDialogComponent } from './schedule-dialog.component';
import { SchemaService } from '@services/home/schema.service';

describe('ScheduleDialogComponent', () => {
  let component: ScheduleDialogComponent;
  let fixture: ComponentFixture<ScheduleDialogComponent>;
  let schemaService: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleDialogComponent ],
      imports: [
        HttpClientTestingModule,
        AppMaterialModuleForSpec,
        FormsModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleDialogComponent);
    component = fixture.componentInstance;
    schemaService = fixture.debugElement.injector.get(SchemaService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getScheduleInfo(), should call getSchedule service', () => {
    spyOn(schemaService, 'getSchedule').and.returnValue(of(null));
    component.getScheduleInfo('test');
    expect(schemaService.getSchedule).toHaveBeenCalled();
  });

  it('setValue(), should set the form values by key', () => {
    component.createForm();
    component.setValue('isEnable', true);
    expect(component.form.controls.isEnable.value).toBeTrue();
  });
});
