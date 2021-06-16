import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRangeSliderComponent } from './form-range-slider.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormControl } from '@angular/forms';

describe('FormRangeSliderComponent', () => {
  let component: FormRangeSliderComponent;
  let fixture: ComponentFixture<FormRangeSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormRangeSliderComponent],
      imports: [AppMaterialModuleForSpec]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('applyFilter(), filter values', async(() => {
    component.control = new FormControl();
    component.minValue = '0';
    component.maxValue = '10';

    const emitEventSpy = spyOn(component.valueChange, 'emit');
    component.applyFilter();
    expect(emitEventSpy).toHaveBeenCalled();
  }));


  it('getSelectedRangeValue(),should return selected range', async(() => {
    component.control = new FormControl();

    const res = component.getSelectedRangeValue();
    expect(res).toEqual('');

    component.control.setValue({ min: 1, max: 10 });
    const result = component.getSelectedRangeValue();
    expect(result).toEqual('1-10');

    component.control.setValue({ min: 0, max: 10 });
    const result1 = component.getSelectedRangeValue().toString();
    expect(result1).toEqual('10');

    component.control.setValue({ min: 1, max: 0 });
    const result2 = component.getSelectedRangeValue().toString();
    expect(result2).toEqual('1');

    component.control.setValue({ min: 0, max: 0 });
    const result3 = component.getSelectedRangeValue();
    expect(result3).toEqual('');
  }));


  it('ngOnIt()', async(() => {
    component.control = null;
    component.control = new FormControl();
    component.control.setValue({ min: '5', max: '20' });
    component.fltrCtrl = new FormControl();
    component.fltrCtrl.setValue('10-20');
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  }));

  it('isInvalidInput(),check that input is valid or not',async()=>{
    component.fltrCtrl.setValue('22-aa');
    component.isInValidInput();
    expect(component.isInValidInput()).toBeTrue();

    component.fltrCtrl.setValue('20-10');
    component.minValue = '20';
    component.maxValue = '10';
    expect(component.isInValidInput()).toBeTrue();

    component.fltrCtrl.setValue('10-20');
    component.minValue = '10';
    component.maxValue = '20';
    expect(component.isInValidInput()).toBeFalse();
  })

});
