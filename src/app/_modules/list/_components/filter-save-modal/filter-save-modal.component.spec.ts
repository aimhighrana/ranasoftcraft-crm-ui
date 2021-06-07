import { MdoUiLibraryModule } from 'mdo-ui-library';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { FilterSaveModalComponent } from './filter-save-modal.component';

describe('FilterSaveModalComponent', () => {
  let component: FilterSaveModalComponent;
  let fixture: ComponentFixture<FilterSaveModalComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterSaveModalComponent ],
      imports:[ MdoUiLibraryModule, 
        AppMaterialModuleForSpec,
        SharedModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }, { provide: MAT_DIALOG_DATA, useValue: {}
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterSaveModalComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close modal', () => {

    component.close(false);
    expect(mockDialogRef.close).toHaveBeenCalledWith('');

    component.close(true);
    expect(mockDialogRef.close).toHaveBeenCalledTimes(1);

    component.nameControl.setValue('new filter');
    component.close(true);
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.nameControl.value);

  });

});
