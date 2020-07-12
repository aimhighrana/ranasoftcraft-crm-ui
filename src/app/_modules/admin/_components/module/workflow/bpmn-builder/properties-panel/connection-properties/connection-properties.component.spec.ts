import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionPropertiesComponent } from './connection-properties.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

describe('ConnectionPropertiesComponent', () => {
  let component: ConnectionPropertiesComponent;
  let fixture: ComponentFixture<ConnectionPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectionPropertiesComponent ],
      imports : [MatDialogModule],
      providers: [FormBuilder]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectionPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init the connection form with initial value', () => {
    const initialValue = {name : 'test'}
    component.initForm(initialValue);
    expect(component.connectionForm.value.name).toEqual('test');
  });

  it('should init the connection form without initial value', () => {
    component.initForm();
    expect(component.connectionForm.value.name).toBeDefined();
  });

  it('should emit a properties update event', () => {
    spyOn(component.updateProperties, 'emit') ;
    component.initForm();
    component.updateStepProperties({name: 'test'}) ;
    expect(component.updateProperties.emit).toHaveBeenCalled();
  });


});
