import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumnSettingsComponent } from './table-column-settings.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';

describe('TableColumnSettingsComponent', () => {
  let component: TableColumnSettingsComponent;
  let fixture: ComponentFixture<TableColumnSettingsComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableColumnSettingsComponent],
      imports: [AppMaterialModuleForSpec, MatDialogModule, RouterTestingModule],
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
    fixture = TestBed.createComponent(TableColumnSettingsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  const data = { fields: { headers: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } }, hierarchyFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, hierarchy: [{ heirarchyId: 'VALUE', heirarchyText: 'Plant' }], gridFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, grids: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, selectedFields: ['VALUE'] };
  it('headerData: should create', () => {
    component.data = { fields: { headers: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } }, hierarchyFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, hierarchy: [{ heirarchyId: 'VALUE', heirarchyText: 'Plant' }], gridFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, grids: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, selectedFields: ['VALUE', 'VALUE12'] };
    component.headerDetails();
    expect(component.header.length).toEqual(1);
  });
  it('hierarchyData: should create', () => {
    component.data = data;
    component.data.selectedHierarchyIds = ['VALUE'];
    component.hierarchyDetails();
    expect(component.hierarchy.length).toEqual(1);
  });

  it('gridData: should create', () => {
    component.data = data;
    component.data.selectedGridIds = ['VALUE'];
    component.gridDetails();
    expect(component.grid.length).toEqual(1);
  });

  it('ngonit creation', () => {
    component.data = data;
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });
  it('Drag & Drop', () => {
    component.data = data;
    const cdkEvent: CdkDragDrop<MetadataModel[]> = {} as any;
    component.drop(cdkEvent, null, null);
    expect(cdkEvent).toBeTruthy();
  });
  it('ismarked', () => {
    component.isMarked(null);
  });
  // it('canMoveHighlight()', ()=>{
  //   component.canMoveHighlight();
  // });
  it('isChecked()', () => {
    component.data = data;
    component.data.fldId = ['VALUE'];
    component.isSelected(component.data.fldId);
  });
  it('submitcolumn()', () => {
    component.data = data;
    component.data.selectedFields = ['VALUE'];
    component.submitColumn();
  });
  it('close()', () => {
    component.data = data;
    component.data.selectedFields = ['VALUE'];
    component.close();
  });
  it('selectall()', () => {
    component.data = data;
    component.allChecked = true;
    component.selectAll();
  });
  it('hierarchSelect()', () => {
    component.data = data;
    component.hierarchyChecked = true;
    component.hierarchSelect();
  })
  it('gridSelect()', () => {
    component.data = data;
    component.gridChecked = true;
    component.gridSelect();
  })
  it('search()', () => {
    component.data = data;
    const el = fixture.nativeElement.querySelector('input');
    el.value = 'VALUE';
    el.dispatchEvent(new Event('input'));
    component.search();
  });
  it('find()', () => {
    component.data = data;
    const increment = 0;
    component.find(increment);
  });
  it('onTextboxChange()', () => {
    component.data = data;
    component.onTextboxChange();
  });

  it('findprev()', () => {
    component.data = data;
    component.findPrev();
  });
});
