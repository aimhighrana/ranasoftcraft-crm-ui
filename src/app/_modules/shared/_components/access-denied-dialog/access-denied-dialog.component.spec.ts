import { async, TestBed } from '@angular/core/testing';

import { AccessDeniedDialogComponent } from './access-denied-dialog.component';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

describe('AccessDeniedDialogComponent', () => {
  // let component: AccessDeniedDialogComponent;
  // let fixture: ComponentFixture<AccessDeniedDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccessDeniedDialogComponent ],
      providers: [
        {
          provide: MatDialog,
          useValue: mockDialogRef
        }, { provide: MAT_DIALOG_DATA, useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(AccessDeniedDialogComponent);
  //   component = fixture.componentInstance;
  // });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
