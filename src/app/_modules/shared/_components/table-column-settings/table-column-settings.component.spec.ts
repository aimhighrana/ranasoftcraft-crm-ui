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

  it('ngonit creation', () => {
    component.data = data;
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('headerDetails(), should return the header details', () => {
    component.data = { fields: { headers: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } }, hierarchyFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, hierarchy: [{ heirarchyId: 'VALUE', heirarchyText: 'Plant' }], gridFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, grids: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, selectedFields: ['VALUE', 'VALUE12'] };
    component.headerDetails();
    expect(component.header.length).toEqual(1);
  });

  it('hierarchyDetails(), should return the hierarchy details', () => {
    component.data = data;
    component.data.selectedHierarchyIds = ['VALUE'];
    component.hierarchyDetails();
    expect(component.hierarchy.length).toEqual(1);
  });

  it('gridDetails(), should return the grid details', () => {
    component.data = data;
    component.data.selectedGridIds = ['VALUE'];
    component.gridDetails();
    expect(component.grid.length).toEqual(1);
  });

  it('search()', () => {
    component.data = data;
    const el = fixture.nativeElement.querySelector('input');
    el.value = 'VALUE';
    el.dispatchEvent(new Event('input'));
    component.search();
    expect(component.search).toBeTruthy();
  });

  it('Drag & Drop', () => {
    component.data = data;
    const cdkEvent: CdkDragDrop<MetadataModel[]> = {} as any;
    component.drop(cdkEvent, null, null);
    expect(cdkEvent).toBeTruthy();
  });

  it('ismarked', () => {
    component.markedFields = ['test'];
    expect(component.isMarked('test')).toEqual(true);
    expect(component.isMarked('mock')).toEqual(false);
  });

  it('onTextboxChange()', () => {
    component.data = data;
    component.onTextboxChange();
    expect(component.onTextboxChange).toBeTruthy();
  });

  it('findprev()', () => {
    component.findPrev();
    expect(component.findPrev).toBeTruthy();
  });

  it('findNext()', () => {
    component.findNext();
    expect(component.findNext).toBeTruthy();
  });

  it('canMoveHighlight() should highlight the search word', async(() => {
    component.canMoveHighlight();
    expect(component.matchCount).toBeGreaterThanOrEqual(0);
  }))
  it('find() should return the index', () => {
    component.data = data;
    component.dynamicSearchVal = 'test';
    component.matchCount = 1;
    component.markedFields = ['test','mock'];
    component.index = 1;
    component.find(0);
    expect(component.markedFields.length).toEqual(2);

    component.index = 0;
    component.find(0);
    expect(component.markedFields.length).toEqual(2);
  });

  it('selectall()', () => {
    component.data = data;
    component.allChecked = true;
    component.selectAll();
    expect(component.selectAll).toBeTruthy();
  });

  it('hierarchSelect()', () => {
    component.data = data;
    component.hierarchyChecked = true;
    component.hierarchSelect();
    expect(component.hierarchSelect).toBeTruthy();
  });

  it('gridSelect()', () => {
    component.grid = [{fieldId: 'VALUE'} as MetadataModel]
    component.gridChecked = true;
    component.data = data;
    component.gridSelect();
    expect(component.gridSelect).toBeTruthy();
  });

  it('isChecked()', () => {
    component.data = data;
    component.data.fldId = ['VALUE'];
    component.isSelected(component.data.fldId);
    expect(component.isSelected).toBeTruthy();
  });

  it('submitcolumn()', () => {
    component.data = data;
    component.data.selectedFields = ['VALUE'];
    component.submitColumn();
    expect(component.submitColumn).toBeTruthy();
  });

  it('close()', () => {
    component.data = data;
    component.data.selectedFields = ['VALUE'];
    component.close();
    expect(component.close).toBeTruthy();
  });
});
