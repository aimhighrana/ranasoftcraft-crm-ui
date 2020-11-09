import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadDatasetComponent } from './upload-dataset.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { FilterValuesComponent } from '@modules/shared/_components/filter-values/filter-values.component';
import { FormInputComponent } from '@modules/shared/_components/form-input/form-input.component';
import { AddFilterMenuComponent } from '@modules/shared/_components/add-filter-menu/add-filter-menu.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SchemaService } from '@services/home/schema.service';
import { of } from 'rxjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '@services/user/userservice.service';
import { Userdetails } from '@models/userdetails';
import { GlobaldialogService } from '@services/globaldialog.service';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';


describe('UploadDatasetComponent', () => {
  let component: UploadDatasetComponent;
  let fixture: ComponentFixture<UploadDatasetComponent>;
  let schemaServiceSpy: SchemaService;
  let userServiceSpy: UserService;
  let schemaDetailsService: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        UploadDatasetComponent,
        SearchInputComponent,
        FilterValuesComponent,
        FormInputComponent,
        AddFilterMenuComponent],
      imports: [AppMaterialModuleForSpec],
      providers: [
        SchemaDetailsService,
        GlobaldialogService,
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        SchemaService,
        UserService,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: [] }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadDatasetComponent);
    component = fixture.componentInstance;
    schemaServiceSpy = fixture.debugElement.injector.get(SchemaService);
    userServiceSpy = fixture.debugElement.injector.get(UserService);
    schemaDetailsService = fixture.debugElement.injector.get(SchemaDetailsService);
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`getAllObjectType(), should get all Object Types`, async(() => {
    const returnData = [];
    const userDetails: Userdetails = {
      firstName: 'test',
      lastName: 'test',
      currentRoleId: 'test',
      fullName: 'test',
      plantCode: 'test',
      userName: 'test',
      dateformat: 'test',
      email: 'test',
      assignedRoles: []
  };
    spyOn(schemaServiceSpy, 'getAllObjectType').and.returnValue(of(returnData));
    spyOn(userServiceSpy, 'getUserDetails').and.returnValue(of(userDetails));
    component.ngOnInit();
    expect(schemaServiceSpy.getAllObjectType).toHaveBeenCalled();
    expect(userServiceSpy.getUserDetails).toHaveBeenCalled();
  }));

  it(`createForm(), should create requestForm`, async(() => {
    component.createForm();
    expect(component.requestForm.value).not.toBeNull();
    expect(component.requestForm.value).not.toBeUndefined();
  }));

  it(`initHeaderForm(), should create headerForm`, async(() => {
    const dataSource = [{
      excelFld: 'testField',
      excelFrstRow: 'test',
      mdoFldId: 'testId',
      mdoFldDesc: 'Test Field',
      columnIndex: 0
    }];
    component.initHeaderForm(dataSource).then((res) => {
      expect(component.headerForm.value).not.toBeNull();
      expect(component.headerForm.value).not.toBeUndefined();
    }).catch((err) => {
      console.log('my error ',err);

    });
  }));

  it(`createfieldObjectForRequest(), should create fieldValues`, async(() => {
    const dataSource = [{
      excelFld: 'testField',
      excelFrstRow: 'test',
      mdoFldId: 'testId',
      mdoFldDesc: 'Test Field',
      columnIndex: 0
    }];
    component.initHeaderForm(dataSource).then((res) => {
      component.createfieldObjectForRequest(dataSource, component.headerForm.value).then((fieldValues: any[]) => {
        expect(fieldValues.length).toBeGreaterThan(0);
      })
    });
  }));


  it(`createBrObject(), should create business rule object`, async(() => {
      const formData = {
        rule_type: 'test',
        rule_name: 'test',
        error_message: 'test',
        standard_function: 'test',
        regex:'test',
        fields: [],
        udrTreeData: { udrHierarchies: [], blocks: [] },
        weightage: 10,
        categoryId: 'test',
      };

     expect(component.createBrObject(formData, formData.udrTreeData)).not.toBeUndefined();
     expect(component.createBrObject(formData, formData.udrTreeData)).not.toBeNull();
  }));

  it(`getModulesMetaHeaders(), should be called when creating modules metadata`, async(() => {
    component.createForm();
    component.requestForm.controls.objectId.setValue('testId')
    spyOn(schemaDetailsService, 'getMetadataFields').and.returnValue(of(null));
    component.getModulesMetaHeaders();
    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalled();
    expect(component.headerFieldsList.length).toEqual(0);
  }))

  it(`getModulesMetaHeaders(), shouldcreate headerFieldsList`, async(() => {
    component.createForm();
    component.requestForm.controls.objectId.setValue('testId')
     const response = {
      headers: {
        testHeader1: '',
        testHeader2: ''
      },
      grids: null,
      hierarchy: [],
      gridFields: null,
      hierarchyFields: null
    };
    spyOn(schemaDetailsService, 'getMetadataFields').and.returnValue(of(response));
    component.getModulesMetaHeaders();
    expect(schemaDetailsService.getMetadataFields).toHaveBeenCalled();
    expect(component.headerFieldsList.length).toEqual(3);
  }))


  it(`setActiveChip(), should set current chip data as active`, async(() => {
    component.setActiveChip({});
    expect(component.activeChipValue).not.toBeNull();
    expect(component.activeChipValue).not.toBeUndefined();
  }));

  it(`updateFilterCriteria(), should update current filter value`, async(() => {
    component.subscribersList.push({
      sno : 5456667,
      plantCode: 'uyuid',
      dataAllocation : [],
      filterFieldIds : []
    })
    component.updateFilterCriteria({}, 0);
    expect(component.activeChipValue).not.toBeNull();
    expect(component.activeChipValue).not.toBeUndefined();
  }));

  it(`updateRole(), update the current Role`, async(() => {
    const subscriber = {
      sno : 5456667,
      plantCode: 'uyuid',
      dataAllocation : [],
      filterFieldIds : [],
      role: null
    };
    component.subscribersList.push(subscriber);

    component.updateRole({value: 'isAdmin'}, subscriber);
    expect(component.subscribersList[0].role).toEqual('isAdmin');
  }));

  it(`setValueToForm(), should set requestform values`, async(() => {
    component.createForm();
    component.setValueToForm('threshold', '13');
    expect(component.requestForm.controls.threshold.value).toEqual('13');
  }))

  it(`isSchemaSet(), check if schema exists`, async(() => {
    component.createForm();
    component.requestForm.controls.core_schema.setValue(component.coreSchemaObject);
    expect(component.isSchemaSet(component.requestForm.controls.core_schema.value)).toBeFalse();
  }))
});
