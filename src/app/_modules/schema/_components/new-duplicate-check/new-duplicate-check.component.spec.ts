import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { NewDuplicateCheckComponent } from './new-duplicate-check.component';

describe('NewDuplicateCheckComponent', () => {
  let component: NewDuplicateCheckComponent;
  let fixture: ComponentFixture<NewDuplicateCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDuplicateCheckComponent ],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDuplicateCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
