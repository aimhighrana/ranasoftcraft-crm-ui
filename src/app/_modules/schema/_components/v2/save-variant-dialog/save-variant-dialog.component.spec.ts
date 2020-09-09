import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveVariantDialogComponent } from './save-variant-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

describe('SaveVariantDialogComponent', () => {
  let component: SaveVariantDialogComponent;
  let fixture: ComponentFixture<SaveVariantDialogComponent>;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveVariantDialogComponent ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }, { provide: MAT_DIALOG_DATA, useValue: {}
        }
      ],
      imports:[
        HttpClientTestingModule, RouterTestingModule, AppMaterialModuleForSpec
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveVariantDialogComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
