import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { NounComponent } from './noun.component';

describe('NounComponent', () => {
  let component: NounComponent;
  let fixture: ComponentFixture<NounComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NounComponent ],
      imports: [ AppMaterialModuleForSpec, RouterTestingModule, SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NounComponent);
    component = fixture.componentInstance;

    router = TestBed.inject(Router);
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

});
