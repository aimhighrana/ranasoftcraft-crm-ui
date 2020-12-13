import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { NewModifierSidesheetComponent } from './new-modifier-sidesheet.component';

describe('NewModifierSidesheetComponent', () => {
  let component: NewModifierSidesheetComponent;
  let fixture: ComponentFixture<NewModifierSidesheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewModifierSidesheetComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewModifierSidesheetComponent);
    component = fixture.componentInstance;

    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
