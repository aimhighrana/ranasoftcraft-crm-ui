import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialEditComponent } from './material-edit.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('MaterialEditComponent', () => {
  let component: MaterialEditComponent;
  let fixture: ComponentFixture<MaterialEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MaterialEditComponent],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
