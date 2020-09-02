import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplicateCheckComponent } from './duplicate-check.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('DuplicateCheckComponent', () => {
  let component: DuplicateCheckComponent;
  let fixture: ComponentFixture<DuplicateCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DuplicateCheckComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DuplicateCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
