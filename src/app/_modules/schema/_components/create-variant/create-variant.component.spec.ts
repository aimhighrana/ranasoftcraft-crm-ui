import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateVariantComponent } from './create-variant.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('CreateVariantComponent', () => {
  let component: CreateVariantComponent;
  let fixture: ComponentFixture<CreateVariantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateVariantComponent ],
      imports:[
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateVariantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
