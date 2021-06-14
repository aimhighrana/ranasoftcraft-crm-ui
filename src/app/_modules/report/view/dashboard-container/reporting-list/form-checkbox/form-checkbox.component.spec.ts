import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckboxComponent } from './form-checkbox.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

describe('FormInputComponent', () => {
  let component: FormCheckboxComponent;
  let fixture: ComponentFixture<FormCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormCheckboxComponent],
      imports: [AppMaterialModuleForSpec]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('ngOnIt()', async(() => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();

  }));


  it('ngOnChanges()', async(() => {
    component.control = new FormControl();
    let changes: SimpleChanges = {};
    component.ngOnChanges(changes);
    expect(component.ngOnChanges).toBeTruthy();
    const change1: SimpleChanges = {
      formFieldId: {
        previousValue: 'activityCheck',
        currentValue: 'column',
        firstChange: false,
        isFirstChange() { return false }
      },
      controls : {
        previousValue: false,
        currentValue: true,
        firstChange: false,
        isFirstChange() { return false }
      }
    };

    component.ngOnChanges(change1);
    console.log(component.control.value)
    expect(component.control.value).toBeTrue();
    expect(component.formFieldId).toEqual('column')

  }));


  it('applyFilter(), filter values', async(() => {
    const response = {
      formFieldId: component.formFieldId,
      value: true
    }
    const emitEventSpy = spyOn(component.valueChange, 'emit');
    component.applyFilter();
    expect(emitEventSpy).toHaveBeenCalled();
  }));

  it('ischecked(), is checked method called', async(() => {
    component.control.setValue(true);
    component.isChecked();
    expect(component.isChecked()).toBeTrue();
  }))
});
