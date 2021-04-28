
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportCategory } from '@modules/report/_models/widget';
import { WidgetService } from '@services/widgets/widget.service';
import { of, throwError } from 'rxjs';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { ImportComponent } from './import.component';

describe('ImportComponent', () => {
  let component: ImportComponent;
  let fixture: ComponentFixture<ImportComponent>;
  let WidgetServiceSpy: WidgetService;
  // let router: Router;

  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportComponent],
      imports: [
        AppMaterialModuleForSpec,
        RouterTestingModule
      ],
      providers: [
        {
          provide: MatDialogRef,
          useValue: mockDialogRef
        }, {
          provide: MAT_DIALOG_DATA, useValue: {}
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportComponent);
    component = fixture.componentInstance;
    WidgetServiceSpy = fixture.debugElement.injector.get(WidgetService);
    // router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close(), should close the dialog', async(() => {
    component.close();
    expect(mockDialogRef.close).toHaveBeenCalled();
  }));

  it('back(), should reset the dialog', async(() => {
    component.back();
    expect(component.importData).toEqual(undefined);
    expect(component.dataSource).toEqual(undefined);
    expect(component.uploadLoader).toBeFalsy();
    expect(component.successful).toBeFalsy();
    expect(component.isDuplicate).toBeFalsy();
    expect(component.isMissingModule).toBeFalsy();
  }));

  it('fileChange(), should set file to seletedFile', async(() => {
    const mockFile = new File([''], 'filename', { type: 'application/json' });
    const mockFileList = new DataTransfer();
    mockFileList.items.add(mockFile);
    component.fileChange(mockFileList.files);
    expect(component.seletedFile).toEqual(mockFile);
    expect(component.uploadLoader).toBeTruthy();
    expect(component.errorMsg).toBeNull();
  }));

  it('fileChange(), should set error message for wrong file type', async(() => {
    const mockFile = new File([''], 'filename', { type: 'text/html' });
    let mockFileList = new DataTransfer();
    mockFileList.items.add(mockFile);
    component.fileChange(mockFileList.files);
    expect(component.seletedFile).toEqual(undefined);
    expect(component.uploadLoader).toBeFalsy();
    expect(component.errorMsg).not.toBeNull();

    mockFileList = new DataTransfer();
    component.fileChange(mockFileList.files);
    expect(component.seletedFile).toEqual(undefined);
    expect(component.uploadLoader).toBeFalsy();
    expect(component.errorMsg).not.toBeNull();
  }));

  it('importReport(), should be successful', async(() => {
    component.seletedFile = new File([''], 'filename', { type: 'application/json' });
    const mockRes = { alreadyExits: false, acknowledge: true, reportId: 'extract_from_file', reportName: 'extract_from_file', importedBy: '${current_userid_who_imported}', importedAt: 16887879908, updatedAt: 16887879908, fileSno: 872234723674 };
    spyOn(WidgetServiceSpy, 'importUploadReport').withArgs(component.seletedFile).and.returnValue(of(mockRes));
    component.importReport();
    expect(WidgetServiceSpy.importUploadReport).toHaveBeenCalledWith(component.seletedFile);
    fixture.detectChanges();
    expect(component.importData).toEqual(mockRes);
    // expect(component.dataSource).toEqual([mockRes]);
    expect(component.successful).toBeTruthy();
  }));

  it('importReport(), should have Duplicate report name', async(() => {
    component.seletedFile = new File([''], 'filename', { type: 'application/json' });
    const mockRes = {
      acknowledge: false,
      alreadyExits: true,
      reportId: '87347237573',
      reportName: 'Inprogress tickets',
      importedBy: '${current_userid_who_imported}',
      importedAt: 16887879908,
      updatedAt: 16887879908,
      fileSno: 872234723674,
      logs: [
        {
          messageId: 236823642,
          reportId: 87347237573,
          category: ReportCategory.DUPLICATE_REPORT,
          message: 'Duplicate report exists on server',
          status: 'OPEN',
          createdAt: 166877799002,
          updatedAt: 167998989903,
          updatedBy: '${import_by_userid}'
        },
        {
          messageId: 7354523232,
          reportId: 87347237573,
          category: ReportCategory.MISSING_MODULE,
          message: 'Customer module not available on target server',
          status: 'OPEN',
          createdAt: 166877799002,
          updatedAt: 167998989903,
          updatedBy: '${import_by_userid}'
        }
      ]
    };
    spyOn(WidgetServiceSpy, 'importUploadReport').withArgs(component.seletedFile).and.returnValue(throwError({ error: mockRes }));
    component.importReport();
    expect(WidgetServiceSpy.importUploadReport).toHaveBeenCalledWith(component.seletedFile);
    fixture.detectChanges();
    expect(component.importData).toEqual(mockRes);
    expect(component.dataSource).toEqual(undefined);
    expect(component.successful).toEqual(undefined);
    expect(component.isDuplicate).toBeTruthy();
    expect(component.isMissingModule).toBeFalsy();
  }));

  it('importUploadReport(), should have Missing module only', async(() => {
    component.seletedFile = new File([''], 'filename', { type: 'application/json' });    const mockRes = {
      acknowledge: false,
      alreadyExits: true,
      reportId: '87347237573',
      reportName: 'Inprogress tickets',
      importedBy: '${current_userid_who_imported}',
      importedAt: 16887879908,
      updatedAt: 16887879908,
      fileSno: 872234723674,
      logs: [
        {
          messageId: 236823642,
          reportId: 87347237573,
          category: ReportCategory.MISSING_MODULE,
          message: 'Material module not available on target server',
          status: 'OPEN',
          createdAt: 166877799002,
          updatedAt: 167998989903,
          updatedBy: '${import_by_userid}'
        },
        {
          messageId: 7354523232,
          reportId: 87347237573,
          category: ReportCategory.MISSING_MODULE,
          message: 'Customer module not available on target server',
          status: 'OPEN',
          createdAt: 166877799002,
          updatedAt: 167998989903,
          updatedBy: '${import_by_userid}'
        }
      ]
    };
    spyOn(WidgetServiceSpy, 'importUploadReport').withArgs(component.seletedFile).and.returnValue(throwError({ error: mockRes }));
    component.importReport();
    expect(WidgetServiceSpy.importUploadReport).toHaveBeenCalledWith(component.seletedFile);
    fixture.detectChanges();
    expect(component.importData).toEqual(mockRes);
    expect(component.dataSource).toEqual(undefined);
    expect(component.successful).toEqual(undefined);
    expect(component.isDuplicate).toBeFalsy();
    expect(component.isMissingModule).toBeTruthy();
  }));
});
