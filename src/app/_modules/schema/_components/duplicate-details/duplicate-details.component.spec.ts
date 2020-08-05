import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateDetailsComponent } from './duplicate-details.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('DuplicateDetailsComponent', () => {
  let component: DuplicateDetailsComponent;
  let fixture: ComponentFixture<DuplicateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateDetailsComponent ],
      imports: [
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
