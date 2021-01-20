import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NameslideToggleComponent } from './nameslide-toggle.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('NameslideToggleComponent', () => {
  let component: NameslideToggleComponent;
  let fixture: ComponentFixture<NameslideToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NameslideToggleComponent],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NameslideToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
