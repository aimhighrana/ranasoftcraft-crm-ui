import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceoptionsDialogComponent } from './advanceoptions-dialog.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('AdvanceoptionsDialogComponent', () => {
  let component: AdvanceoptionsDialogComponent;
  let fixture: ComponentFixture<AdvanceoptionsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceoptionsDialogComponent ],
      imports:[
        AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceoptionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
