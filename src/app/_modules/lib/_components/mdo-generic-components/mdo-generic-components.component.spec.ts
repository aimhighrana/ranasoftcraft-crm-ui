import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdoGenericComponentsComponent } from './mdo-generic-components.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';

describe('MdoGenericComponentsComponent', () => {
  let component: MdoGenericComponentsComponent;
  let fixture: ComponentFixture<MdoGenericComponentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MdoGenericComponentsComponent ],
      imports: [AppMaterialModuleForSpec,
      RouterTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MdoGenericComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
