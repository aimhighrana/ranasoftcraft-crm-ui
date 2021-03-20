import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { NounModifierService } from '@services/home/schema/noun-modifier.service';
import { of } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { NounComponent } from './noun.component';

describe('NounComponent', () => {
  let component: NounComponent;
  let fixture: ComponentFixture<NounComponent>;
  let router: Router;
  let nounModifierService: NounModifierService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NounComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule, SharedModule ],
      providers: [{
        provide: ActivatedRoute,
        useValue: {params : of({moduleId: '1005', matlGroup: 'valve'})}
      }]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NounComponent);
    component = fixture.componentInstance;

    router = fixture.debugElement.injector.get(Router);
    nounModifierService = fixture.debugElement.injector.get(NounModifierService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build noun form', () => {
    component.buildForm();
    expect(component.nounForm).toBeDefined();
  });

  it('close noun sidesheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { outer: null } }])
  });
  it(`To get FormControl from fromGroup `, async(() => {
    component.buildForm()
    const field=component.formField('nounCode');
    expect(field).toBeDefined();
   }));

   it('should init component', () => {
     component.ngOnInit();
     expect(component.moduleId).toEqual('1005');
   });

   it('should setControlValue', () => {
    component.buildForm();
    component.setControlValue('nounCode', 'Bearing');
    expect(component.nounForm.value.nounCode).toEqual('Bearing');
   });

   it('should save', () => {

    spyOn(component, 'close');
    spyOn(nounModifierService, 'createNounModifier').and.returnValue(of('success'));

    component.buildForm();
    component.save();
    expect(component.submitted).toBeTrue();

    component.setControlValue('nounCode', 'Bearing');
    component.save();

    component.setControlValue('shortDescActive', true);
    component.setControlValue('active', true);
    component.save();

    expect(nounModifierService.createNounModifier).toHaveBeenCalledTimes(2);

   })



});
