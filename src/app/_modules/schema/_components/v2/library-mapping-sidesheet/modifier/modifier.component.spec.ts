import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { ModifierComponent } from './modifier.component';

describe('ModifierComponent', () => {
  let component: ModifierComponent;
  let fixture: ComponentFixture<ModifierComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifierComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule, SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the modifier form', () => {

    component.buildForm();
    expect(component.modifierForm).toBeDefined();

  });

  it('should set form control value', () => {

    component.buildForm();
    component.setControlValue('modeCode', '20012');
    expect(component.modifierForm.value.modeCode).toEqual('20012');

  });

  it('close sidesheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { outer: null } }])
  });

  it(`To get FormControl from fromGroup `, async(() => {
    component.buildForm()
    const field=component.formField('modeCode');
    expect(field).toBeDefined();
   }));

});
