import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { StringReplaceComponent } from './string-replace.component';

describe('StringReplaceComponent', () => {
  let component: StringReplaceComponent;
  let fixture: ComponentFixture<StringReplaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringReplaceComponent ],
      imports: [ AppMaterialModuleForSpec, SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
