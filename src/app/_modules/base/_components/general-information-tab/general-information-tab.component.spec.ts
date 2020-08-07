import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralInformationTabComponent } from './general-information-tab.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { Subscription } from 'rxjs';

describe('GeneralInformationTabComponent', () => {
  let component: GeneralInformationTabComponent;
  let fixture: ComponentFixture<GeneralInformationTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GeneralInformationTabComponent],
      imports: [AppMaterialModuleForSpec]
    })
      .compileComponents();
    fixture = TestBed.createComponent(GeneralInformationTabComponent);
    component = fixture.componentInstance;
    component.editingSubscription = new Subscription();
  }));

  it('should call getDOMElement', () => {
    const object = {
      picklist: 1
    }
    expect(component.getDOMElement(object)).toBe('Dropdown');
    object.picklist = 5;
    expect(component.getDOMElement(object)).toBe('Text');
  });


  it('should call setDynamicHeight', () => {
    let event = {
      fieldsList: [{
        picklist: 15
      }]
    }
    // first case
    expect(component.setDynamicHeight(event)).toBe('100%');

    // second case
    event = {
      fieldsList: [{
        picklist: 20
      }]
    }
    expect(component.setDynamicHeight(event)).toBe('77px');
  })
});
