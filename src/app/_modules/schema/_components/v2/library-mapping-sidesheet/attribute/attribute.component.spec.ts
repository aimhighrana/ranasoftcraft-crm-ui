import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { AttributeComponent } from './attribute.component';

describe('AttributeComponent', () => {
  let component: AttributeComponent;
  let fixture: ComponentFixture<AttributeComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the attribute form', () => {

    component.buildAttributeForm();
    expect(component.attributeForm).toBeDefined();

  });

  it('should set form control value', () => {

    component.buildAttributeForm();
    component.setControlValue('attrCode', 'bilel');
    expect(component.attributeForm.value.attrCode).toEqual('bilel');

  });

  it('close sidesheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { outer: null } }])
  });

  it(`To get FormControl from fromGroup `, async(() => {
    component.buildAttributeForm()
    const field=component.formField('attrCode');
    expect(field).toBeDefined();
   }));
});
