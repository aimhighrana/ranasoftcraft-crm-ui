import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { FormInputAutoselectComponent } from './form-input-autoselect.component';

describe('FormInputAutoselectComponent', () => {
  let component: FormInputAutoselectComponent;
  let fixture: ComponentFixture<FormInputAutoselectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormInputAutoselectComponent ],
      imports: [ AppMaterialModuleForSpec ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormInputAutoselectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('getValue()', () => {
    const option = {
      label: 'Test Label',
      value: '12345'
    }
    component.valueKey = 'value';
    expect(component.getValue(option)).toEqual('12345');
  });

  it('getLabel()', () => {
    const option = {
      label: 'Test Label',
      value: '12345'
    }
    component.labelKey = 'label';
    expect(component.getLabel(option)).toEqual('Test Label');
  });

  it('getTooltipText()', () => {
    const option = {
      label: 'Test Label',
      value: '12345',
    }
    component.tooltipKey = 'label';
    expect(component.getTooltipText(option)).toEqual('Test Label');
  });

  it('mdoFieldDisplayWith()', () => {
    const option = {
      label: 'Test Label',
      value: '12345',
    }
    component.labelKey = 'label';
    expect(component.mdoFieldDisplayWith(option)).toEqual('Test Label');
    expect(component.mdoFieldDisplayWith('')).toEqual('');
  });

  it('emitOptionSelected(), with string value', () => {
    component.viewMoreAction = 'value';
    const eventEmitterSpy = spyOn(component.openCustomDialog, 'emit');
    component.emitOptionSelected('value');
    expect(eventEmitterSpy).toHaveBeenCalled();
  });

  it('emitOptionSelected(), with object value', () => {
    component.extraOption = '';
    const eventEmitterSpy = spyOn(component.optionSelectedEmit, 'emit');
    component.emitOptionSelected({
      option: {
        value: 'extra'
      }
    });
    expect(eventEmitterSpy).toHaveBeenCalled();
  });
});
