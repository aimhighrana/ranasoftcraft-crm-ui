import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { AttributeComponent } from './attribute.component';

describe('AttributeComponent', () => {
  let component: AttributeComponent;
  let fixture: ComponentFixture<AttributeComponent>;
  let router: Router;
  let nounModifierService: NounModifierService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttributeComponent ],
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule],
      providers: [{
        provide: ActivatedRoute,
        useValue: {params : of({nounSno: '1701'})}
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttributeComponent);
    component = fixture.componentInstance;

    nounModifierService = fixture.debugElement.injector.get(NounModifierService);
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

   it('should init component', () => {
    component.ngOnInit();
    expect(component.nounSno).toEqual('1701');
  });


  it('should save', () => {

   spyOn(component, 'close');
   spyOn(nounModifierService, 'addAttribute').and.returnValue(of('success'));

   component.buildAttributeForm();
   component.save();
   expect(component.submitted).toBeTrue();

   component.setControlValue('attrCode', 'length');
   component.setControlValue('attrDesc', 'length mm');
   component.save();

   expect(nounModifierService.addAttribute).toHaveBeenCalledTimes(1);

  })


});
