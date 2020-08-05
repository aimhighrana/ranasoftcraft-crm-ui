import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeterminationStepPropertiesComponent } from './determination-step-properties.component';
import { FormBuilder } from '@angular/forms';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('DeterminationStepPropertiesComponent', () => {
  let component: DeterminationStepPropertiesComponent;
  let fixture: ComponentFixture<DeterminationStepPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeterminationStepPropertiesComponent ],
      imports : [AppMaterialModuleForSpec],
      providers: [FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeterminationStepPropertiesComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the determination form without initial value', () => {
    component.initForm();
    expect(component.determinationForm).toBeDefined() ;
  });

  it('should init the determination form with intial value', () => {
    const initialValue = {name : 'test'}
    component.initForm(initialValue);
    expect(component.determinationForm.value.name).toEqual('test');
  });

  it('should emit a properties update event', () => {
    spyOn(component.updateProperties, 'emit') ;
    component.updateStepProperties({name: 'test'}) ;
    expect(component.updateProperties.emit).toHaveBeenCalled();
  });

});
