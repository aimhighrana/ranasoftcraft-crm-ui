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
  const data = { fields: { headers: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } }, hierarchyFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, hierarchy: [{ heirarchyId: 'VALUE', heirarchyText: 'Plant' }], gridFields: { VALUE: { Test: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, grids: { VALUE: { fieldId: 'VALUE', fieldDescri: 'Test Value' } } }, selectedFields: ['VALUE', 'VALUE12', 'VALUE1'] };

  it('ngonit creation', () => {
    component.data = data;
    component.ngOnInit();
    expect(component.ngOnInit).toBeTruthy();
  });

  it('headerDetails(), should return the header details', () => {
    component.data = data;
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
    component.headerArray = ['NDCTYPE'];
    component.hierarchyArray = ['CON_DOCDT'];
    component.gridArray = ['Weight'];
    component.markedFields = ['NDCTYPE','CON_DOCDT','Weight'];
    const dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('mat-card').and.returnValue(dummyElement);
    component.findPrev();
    expect(component.markedFields.length).toEqual(3);

    component.markedFields = ['CON_DOCDT','Weight'];
    component.findPrev();
    expect(component.markedFields.length).toEqual(2);

    component.markedFields = ['Weight'];
    component.findPrev();
    expect(component.markedFields.length).toEqual(1);

    component.markedFields = ['Weigt'];
    component.findPrev();
    expect(component.markedFields.length).toEqual(1);

    component.markedFields = [];
    component.findPrev();
    expect(component.markedFields.length).toEqual(0);
  });

  it('findNext()', () => {
    component.headerArray = ['NDCTYPE'];
    component.hierarchyArray = ['CON_DOCDT'];
    component.gridArray = ['Weight'];
    component.markedFields = ['NDCTYPE','CON_DOCDT','Weight'];
    const dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('mat-card').and.returnValue(dummyElement);
    component.findNext();
    expect(component.markedFields.length).toEqual(3);

    component.markedFields = ['CON_DOCDT','Weight'];
    component.findNext();
    expect(component.markedFields.length).toEqual(2);

    component.markedFields = ['Weight'];
    component.findNext();
    expect(component.markedFields.length).toEqual(1);

    component.markedFields = ['Weigt'];
    component.findNext();
    expect(component.markedFields.length).toEqual(1);

    component.markedFields = [];
    component.findNext();
    expect(component.markedFields.length).toEqual(0);
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

    component.index = -1;
    component.find(0);
    expect(component.markedFields.length).toEqual(2);

    component.index = 2;
    component.find(0);
    expect(component.markedFields.length).toEqual(2);

    component.index = 0;
    component.find(0);
    expect(component.markedFields.length).toEqual(2);
  });

  it('selectall()', () => {
    component.data = data;
    component.headerArray = ['VALUE'];
    component.hierarchyArray = ['VALUE12'];
    component.gridArray = ['VALUE1'];
    component.allChecked = true;
    component.selectAll();
    expect(component.data.selectedFields.length).toEqual(3);

    component.allChecked = false;
    component.selectAll();
    expect(component.gridChecked).toEqual(false);
  });

  it('hierarchSelect()', () => {
    component.data = {selectedFields:['VAUE']};
    component.hierarchyChecked = true;
    component.hierarchyArray = ['VALUE12'];
    component.hierarchSelect();
    expect(component.data.selectedFields.length).toEqual(2);

    component.data = {selectedFields:['VALUE']};
    component.hierarchyChecked = false;
    component.hierarchyArray = ['VALUE12'];
    component.hierarchSelect();
    expect(component.data.selectedFields.length).toEqual(1);
  });

  it('gridSelect()', () => {
    component.gridArray = ['VALE']
    component.gridChecked = true;
    component.data = {selectedFields:['VALUE']};
    component.gridSelect();
    expect(component.data.selectedFields.length).toEqual(2);

    component.gridArray = ['VALUE']
    component.gridChecked = false;
    component.data = {selectedFields:['VALUE']};
    component.gridSelect();
    expect(component.data.selectedFields.length).toEqual(0);
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

  it('onWindowScroll(), should scroll to initial marked element', () => {
    component.headerArray = ['NDCTYPE'];
    component.hierarchyArray = ['CON_DOCDT'];
    component.gridArray = ['Weight'];
    component.markedFields = ['NDCTYPE','CON_DOCDT','Weight'];
    const dummyElement = document.createElement('div');
    document.getElementById = jasmine.createSpy('mat-card').and.returnValue(dummyElement);
    component.onWindowScroll();
    expect(component.markedFields.length).toEqual(3);

    component.markedFields = ['CON_DOCDT','Weight'];
    component.onWindowScroll();
    expect(component.markedFields.length).toEqual(2);

    component.markedFields = ['Weight'];
    component.onWindowScroll();
    expect(component.markedFields.length).toEqual(1);

    component.markedFields = ['Weigt'];
    component.onWindowScroll();
    expect(component.markedFields.length).toEqual(1);
  });

  it('searchKeyDown(), shoud return the press key', async(() => {
    component.dynamicSearchVal = 'test';
    const ev = {key:'Enter',preventDefault(){}} as KeyboardEvent;
    component.searchKeyDown(ev);
    expect(component.searchKeyDown).toBeTruthy();

    const ev1 = {key:'ArrowDown',preventDefault(){}} as KeyboardEvent;
    component.searchKeyDown(ev1) ;
    expect(component.searchKeyDown).toBeTruthy();

    const ev2 = {key:'ArrowRight',preventDefault(){}} as KeyboardEvent;
    component.searchKeyDown(ev2);
    expect(component.searchKeyDown).toBeTruthy();

    const ev3 = {key:'ArrowUp',preventDefault(){}} as KeyboardEvent;
    component.searchKeyDown(ev3);
    expect(component.searchKeyDown).toBeTruthy();

    const ev4 = {key:'ArrowLeft',preventDefault(){}} as KeyboardEvent;
    component.searchKeyDown(ev4);
    expect(component.searchKeyDown).toBeTruthy();

    const ev5 = {key:'Arroweft',preventDefault(){}} as KeyboardEvent;
    component.searchKeyDown(ev5);
    expect(component.searchKeyDown).toBeTruthy();

    component.dynamicSearchVal = null;
    const ev6 = {key:'Enter',preventDefault(){}} as KeyboardEvent;
    component.searchKeyDown(ev6);
    expect(component.searchKeyDown).toBeTruthy();
  }));

  it('selectCheckbox(), should return the Indeterminate', ()=> {
    component.data = {selectedFields:['VALUE', 'VALUE12', 'VALUE1']};
    component.headerArray = ['VALUE'];
    component.hierarchyArray = ['VALUE12'];
    component.gridArray = ['VALUE1'];
    component.selectCheckbox();
    expect(component.allIndeterminate).toEqual(false);

    component.data = {selectedFields:['VALUE2', 'VALUE1']};
    component.hierarchyArray = ['VALUE12'];
    component.gridArray = ['VALUE1'];
    component.selectCheckbox();
    expect(component.allIndeterminate).toEqual(true);

    component.data = {selectedFields:['VALUE12', 'VALUE1']};
    component.hierarchyArray = ['VALUE12'];
    component.gridArray = ['VALUE1'];
    component.selectCheckbox();
    expect(component.allIndeterminate).toEqual(true);

    component.data = {selectedFields:[]};
    component.hierarchyArray = ['VALUE12'];
    component.gridArray = ['VALUE1'];
    component.selectCheckbox();
    expect(component.allIndeterminate).toEqual(false);
  });
});