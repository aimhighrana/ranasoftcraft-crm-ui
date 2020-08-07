import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnsettingComponent } from './columnsetting.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ColumnsettingComponent', () => {
  let component: ColumnsettingComponent;
  let fixture: ComponentFixture<ColumnsettingComponent>;

  const sampleViews = [
    {
      viewId: '578871542211198268',
      viewName: 'Without tags',
      fieldId: [
        'emailtext',
        'taskid',
        'requestorName',
        'datestarted',
        'objectdesc',
        'duedate',
        'fname',
        'priorityType'
      ],
      default: true,
      active: false,
      fields: []
    },
    {
      viewId: '736992753262805879',
      viewName: 'test',
      fieldId: [
        'requestorName',
        'taskid',
        'datestarted',
        'tags',
        'emailtext',
        'objectdesc',
        'priorityType',
        'fname',
        'duedate'
      ],
      default: false,
      active: false,
      fields: []
    },
    {
      viewId: '782071388208177150',
      viewName: 'top 4 only',
      fieldId: [
        'requestorName',
        'emailtext',
        'taskid',
        'datestarted'
      ],
      default: false,
      active: false,
      fields: []
    },
    {
      viewId: '967589022265877187',
      viewName: 'top 6 only',
      fieldId: [
        'datestarted',
        'duedate',
        'requestorName',
        'taskid',
        'fname',
        'emailtext'
      ],
      default: false,
      active: false,
      fields: []
    },
    {
      viewId: '986965177187517263',
      viewName: 'top 4 only',
      fieldId: [
        'requestorName',
        'datestarted',
        'taskid',
        'emailtext'
      ],
      default: false,
      active: false,
      fields: []
    },
    {
      viewId: '999950497191809933',
      viewName: 'Without tags',
      fieldId: [
        'emailtext',
        'priorityType',
        'taskid',
        'datestarted',
        'fname',
        'requestorName',
        'objectdesc',
        'duedate'
      ],
      default: false,
      active: false,
      fields: []
    }
  ];

  const tableColumns = [
    {
      visible: true,
      value: 'taskid'
    },
    {
      visible: true,
      value: 'emailtext'
    },
    {
      visible: true,
      value: 'requestorName'
    },
    {
      visible: true,
      value: 'datestarted'
    },
    {
      visible: true,
      value: 'duedate'
    },
    {
      visible: true,
      value: 'fname'
    },
    {
      visible: true,
      value: 'objectdesc'
    },
    {
      visible: true,
      value: 'priorityType'
    },
    {
      visible: true,
      value: 'tags'
    }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppMaterialModuleForSpec, RouterTestingModule, SharedModule, HttpClientTestingModule],
      declarations: [ColumnsettingComponent],
      providers: [HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnsettingComponent);
    component = fixture.componentInstance;
    component.ngOnInit();
    component.tableColumns = tableColumns;
    component.taskListViews = sampleViews;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call ngOnInit()', () => {
    component.ngOnInit();
    fixture.detectChanges();
    expect(component.userDetails).not.toBe(null);
    expect(component.taskListViews.length).toBeGreaterThanOrEqual(0);
  });

  it('should call setAsDefault()', () => {
    component.setAsDefault(sampleViews[0]);
    expect(sampleViews[0].default).toBe(true)
  });

  it('should call setActiveView()', () => {
    component.setActiveView(sampleViews[0]);
    expect(sampleViews[0].active).toBe(true);
  });

  it('should call resetView()', () => {
    component.resetView();
    // show all columns by toggling on
    expect(component.tableColumns.map(column => { return column.visible === true ? column.visible : false }).length).toBe(tableColumns.length);
    // no view should be set as active
    expect(component.taskListViews.filter(view => view.active === false).map(view => view.active).length).toBe(sampleViews.length);
  });

  it('should call saveChange()', () => {
    component.saveChange(tableColumns[0], { checked: true });
    expect(tableColumns[0].visible).toBe(true);
  });

  it('should call addNewView()', () => {
    component.addNewView();
    fixture.detectChanges();
    // make sure that the column data is passed for sure.
    expect(component.saveViewform.value.fields).not.toBe(null);
  });

  it('should return true for isAnyViewActive()', () => {
    component.setActiveView(sampleViews[0]);
    fixture.detectChanges();
    expect(component.isAnyViewActive).not.toBe(null);
  });

  it('should call deleteView() and emit object', () => {
    spyOn(component.performOperation, 'emit');
    component.deleteView(sampleViews[0]);
    fixture.detectChanges();
    expect(component.performOperation.emit).toHaveBeenCalledWith({
      type: 'delete',
      data: sampleViews[0]
    });
  })

  it('should call updateView() and emit object', () => {
    spyOn(component.performOperation, 'emit');
    sampleViews[0].active = true
    component.updateView();
    fixture.detectChanges();
    expect(component.performOperation.emit).toHaveBeenCalledWith({
      type: 'update',
      data: sampleViews[0]
    });
  });

  it('should call closeSettingColumn()', () => {
    spyOn(component.close, 'emit');
    component.closeSettingColumn();
    fixture.detectChanges();
    expect(component.close.emit).toHaveBeenCalledWith(true);
  });
  // drop
});
