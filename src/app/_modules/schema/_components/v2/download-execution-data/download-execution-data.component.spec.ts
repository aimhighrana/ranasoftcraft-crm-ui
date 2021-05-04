import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedModule } from '@modules/shared/shared.module';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { DownloadExecutionDataComponent } from './download-execution-data.component';

describe('DownloadExecutionDataComponent', () => {
  let component: DownloadExecutionDataComponent;
  let fixture: ComponentFixture<DownloadExecutionDataComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadExecutionDataComponent ],
      imports: [SharedModule, AppMaterialModuleForSpec],
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
    fixture = TestBed.createComponent(DownloadExecutionDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close', () => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });

  it('should downloadExecutionDetails', () => {
    component.downloadExecutionDetails();
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.selectedNodes);
  });

  it('should nodeSelectionChanged', () => {
    component.nodeSelectionChanged('header');
    expect(component.selectedNodes.length).toEqual(1);

    component.nodeSelectionChanged('header');
    expect(component.selectedNodes.length).toEqual(0);
  });

});
