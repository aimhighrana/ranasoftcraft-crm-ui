import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveSearchDialogComponent } from './save-search-dialog.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SharedModule } from '@modules/shared/shared.module';

describe('SaveSearchDialogComponent', () => {
  let component: SaveSearchDialogComponent;
  let fixture: ComponentFixture<SaveSearchDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveSearchDialogComponent],
      imports: [AppMaterialModuleForSpec, SharedModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
