import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFilterMenuComponent } from './add-filter-menu.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('AddFilterMenuComponent', () => {
  let component: AddFilterMenuComponent;
  let fixture: ComponentFixture<AddFilterMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFilterMenuComponent ],
      imports: [AppMaterialModuleForSpec]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFilterMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
