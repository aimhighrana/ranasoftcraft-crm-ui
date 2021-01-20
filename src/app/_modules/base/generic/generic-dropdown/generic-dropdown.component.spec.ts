import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericDropdownComponent } from './generic-dropdown.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('GenericDropdownComponent', () => {
  let component: GenericDropdownComponent;
  let fixture: ComponentFixture<GenericDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericDropdownComponent],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
