import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericTextboxComponent } from './generic-textbox.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('GenericTextboxComponent', () => {
  let component: GenericTextboxComponent;
  let fixture: ComponentFixture<GenericTextboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericTextboxComponent],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericTextboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
