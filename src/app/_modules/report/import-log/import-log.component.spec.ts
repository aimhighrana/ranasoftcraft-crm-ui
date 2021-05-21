import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLogComponent } from './import-log.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MdoUiLibraryModule } from 'mdo-ui-library';

describe('ImportLogComponent', () => {
  let component: ImportLogComponent;
  let fixture: ComponentFixture<ImportLogComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportLogComponent],
      imports: [RouterTestingModule, AppMaterialModuleForSpec, MdoUiLibraryModule],
      providers: []
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLogComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit, loaded pre required', (() => {
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
    component.getWarningList();
    expect(component.getWarningList).toBeTruthy();

  }));

  it('close(), should close the current router', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(component.close).toBeTruthy();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }]);
  });

  it('getWarningList(), get warning list', () => {
    component.dataSource = [{ warning: 'Customer Module', category: 'Missing Module', status: 'Open', updated: '12/12/20' },
    { warning: 'BOM', category: 'Missing Module', status: 'Open', updated: '12/12/20' }]
    component.initializeForm();
    component.getWarningList();
    expect(component.frmArray.length).toEqual(2);
  })

  it('change status, change status of the warning', () => {
    component.changeStatus(0,'Open');
    expect(component.dataSource[0].status).toEqual('Open');
  })

});
