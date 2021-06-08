import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMultiselectComponent } from './form-multiselect.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormControl, Validators } from '@angular/forms';

fdescribe('FormInputComponent', () => {
  let component: FormMultiselectComponent;
  let fixture: ComponentFixture<FormMultiselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormMultiselectComponent],
      imports: [AppMaterialModuleForSpec]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMultiselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('applyFilter(), filter values', async(() => {
    component.control = new FormControl();
    component.formFieldId = 'MATL_GROUP';
    const res = {
      formFieldId: 'column',
      value: 'first'
    }

    const emitEventSpy = spyOn(component.valueChange, 'emit');
    component.applyFilter();
    expect(component.displayMultiselectedText).toHaveBeenCalled();
    expect(emitEventSpy).toHaveBeenCalled();
  }));

});
