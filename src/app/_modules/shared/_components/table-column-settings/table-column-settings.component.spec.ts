// import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TableColumnSettingsComponent } from './table-column-settings.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { MetadataModel } from 'src/app/_models/schema/schemadetailstable';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { of } from 'rxjs';
import { SharedServiceService } from '@modules/shared/_services/shared-service.service';
import { Router } from '@angular/router';

describe('TableColumnSettingsComponent', () => {
  let component: TableColumnSettingsComponent;
  let fixture: ComponentFixture<TableColumnSettingsComponent>;
  let sharedServiceSpy: SharedServiceService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableColumnSettingsComponent],
      imports: [AppMaterialModuleForSpec, RouterTestingModule],
      providers: [SchemaDetailsService, SharedServiceService]
    })
      .compileComponents();
      router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnSettingsComponent);
    component = fixture.componentInstance;
    // const schemaDetailsServiceSpy = fixture.debugElement.injector.get(SchemaDetailsService);
    // schemaDetailsServiceSpy.getCategoryChartData
    sharedServiceSpy = fixture.debugElement.injector.get(SharedServiceService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngonit creation', () => {
    spyOn(sharedServiceSpy, 'getChooseColumnData').and.returnValue(of({}));
    component.ngOnInit();
    expect(sharedServiceSpy.getChooseColumnData).toHaveBeenCalledTimes(1);

  });

  it('manageStateOfCheckbox(), should manage the state of checkboxes', async() => {
    component.header = [
      {
        fieldId : 'NDCTYPE',
        fieldDescri: 'NDC TYPE MATERIAL'
      } as MetadataModel
    ]

    component.data = {
        schemaId: 123365,
        variantId: 1236544,
        fields: [],
        selectedFields:['NDCTYPE']
    }

    component.manageStateOfCheckBox();
    expect(component.allIndeterminate).toEqual(false);

    component.header = [
      {
        fieldId : 'NDCTYPE',
        fieldDescri: 'NDC TYPE MATERIAL'
      } as MetadataModel
    ]

    component.data = {
        schemaId: 123365,
        variantId: 1236544,
        fields: [],
        selectedFields:['NDCTYPE', 'NDCTYPEMATL']
    }


    component.manageStateOfCheckBox();
    expect(component.allIndeterminate).toEqual(true);
  })


  it('isChecked(), should check state of select/unselect', async() => {
      component.data = {
        schemaId: 123365,
        variantId: 1236544,
        fields: [],
        selectedFields:['NDCTYPE', 'NDCTYPEMATL']
      }
      const fld = {
          fieldId: 'NDCTYPE'
      } as MetadataModel

      const res = component.isChecked(fld);
      expect(res).toEqual(true)

      component.data = {
        schemaId: 123365,
        variantId: 1236544,
        fields: [],
        selectedFields:['NDCTYPE', 'NDCTYPEMATL']
      }
      const fld1 = {
          fieldId: 'TYPEMATL'
      } as MetadataModel

      const res1 = component.isChecked(fld1);
      expect(res1).toEqual(false)
  })

  it('selectAll(), should select all', async() => {
    component.data = {
        schemaId: 123365,
        variantId: 1236544,
        fields: [],
        selectedFields:[]
      }
    component.allChecked = true;
    component.selectAll();
    expect(component.allIndeterminate).toEqual(false);

    component.allChecked = false;
    component.selectAll();
    expect(component.allIndeterminate).toEqual(false);
  })


  it('close(), should close the side sheet', () => {
      spyOn(router, 'navigate');
      component.close();
      expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null }}])
  })
//   it('headerDetails(), should return the header details', async(() => {
//     // Mock data 1
//     const data = {
//       selectedFields: ['ACCOUNT_VIEW', 'SALES_VIEW'],
//       fields: {
//         headers: {
//           AACR: { fieldId: 'AACR', fieldDescri: 'What is the estimated annual consumption' },
//           ACCOUNT_VIEW: { fieldId: 'ACCOUNT_VIEW', fieldDescri: 'Account View' }
//         }
//       }
//     }
//     component.data = data;

//     component.headerDetails();
//     expect(component.header.length).toEqual(2);

//     // mock data 2
//     const data1 = {
//       selectedFields: [],
//       fields: {
//         headers: {
//           AACR: { fieldId: 'AACR', fieldDescri: 'What is the estimated annual consumption' },
//           ACCOUNT_VIEW: { fieldId: 'ACCOUNT_VIEW', fieldDescri: 'Account View' }
//         }
//       }
//     }
//     component.data = data1;

//     component.headerDetails();
//     expect(component.header.length).toEqual(2);

//     // mock data 3
//     const data2 = {};
//     component.data = data2;

//     component.headerDetails();
//     expect(component.header.length).toEqual(0);
//   }));

//   it('hierarchyDetails(), should return the hierarchy details', async(() => {
//     // mock data 1
//     const data = {
//       selectedFields: ['ABC_INDIC', 'ASSY_SCRAP'],
//       fields: {
//         hierarchyFields: {
//           1: {
//             ABC_INDIC: { fieldId: 'ABC_INDIC', fieldDescri: 'ABC Indicator.' },
//             ALTERNATIVE_BOM: { fieldId: 'ALTERNATIVE_BOM', fieldDescri: 'AltBOM' }
//           }
//         },
//         hierarchy: [{ heirarchyId: '1', heirarchyText: 'Plant Data' }]
//       },
//       selectedHierarchyIds: ['1', '2']
//     }
//     component.data = data;

//     component.hierarchyDetails();
//     expect(component.hierarchy.length).toEqual(2);

//     // mock data 2
//     const data1 = {
//       selectedFields: [],
//       fields: {
//         hierarchyFields: {
//           1: {
//             ABC_INDIC: { fieldId: 'ABC_INDIC', fieldDescri: 'ABC Indicator.' },
//             ALTERNATIVE_BOM: { fieldId: 'ALTERNATIVE_BOM', fieldDescri: 'AltBOM' }
//           }
//         },
//         hierarchy: [{ heirarchyId: '1', heirarchyText: 'Plant Data' }]
//       },
//       selectedHierarchyIds: ['1']
//     }

//     component.data = data1;

//     component.hierarchyDetails();
//     expect(component.hierarchy.length).toEqual(2);

//     // mock data 3
//     const data2 = {};
//     component.data = data2;

//     component.hierarchyDetails();
//     expect(component.hierarchy.length).toEqual(0);
//   }));

//   it('gridDetails(), should return the grid details', async(() => {
//     // mock data 1
//     const data = {
//       selectedFields: ['ADD_HEIGHT', 'ASSY_SCRAP'],
//       fields: {
//         gridFields: {
//           ADDINFO: {
//             ADD_HEIGHT: { fieldId: 'ADD_HEIGHT', fieldDescri: 'Height' },
//             ADD_LENGTH: { fieldId: 'ADD_LENGTH', fieldDescri: 'Length' }
//           }
//         },
//         grids: {
//           ADDINFO: { fieldId: 'ADDINFO', fieldDescri: 'Additional data for GS1' }
//         }
//       },
//       selectedGridIds: ['ADDINFO', 'ADD_EANDATA']
//     }

//     component.data = data;
//     component.gridDetails();
//     expect(component.grid.length).toEqual(2);

//     // mock data 2
//     const data1 = {
//       selectedFields: [],
//       fields: {
//         gridFields: {
//           ADDINFO: {
//             ADD_HEIGHT: { fieldId: 'ADD_HEIGHT', fieldDescri: 'Height' },
//             ADD_LENGTH: { fieldId: 'ADD_LENGTH', fieldDescri: 'Length' }
//           }
//         },
//         grids: {
//           ADDINFO: { fieldId: 'ADDINFO', fieldDescri: 'Additional data for GS1' }
//         }
//       },
//       selectedGridIds: ['ADDINFO']
//     }

//     component.data = data1;
//     component.gridDetails();
//     expect(component.grid.length).toEqual(2);

//     // mock data 3
//     const data2 = {};
//     component.data = data2;

//     component.gridDetails();
//     expect(component.grid.length).toEqual(0);
//   }));

//   it('selectCheckbox(), should return the selected fields', async(() => {
//     // mock data 1
//     component.headerArray = ['NDCTYPE', 'PROC_RULE'];
//     component.hierarchyArray = ['CON_DOCDT', 'INF_NO'];
//     component.gridArray = ['ADD_LENGTH', 'ADD_WIDTH'];
//     const data = {
//       selectedFields: ['NDCTYPE', 'INF_NO', 'ADD_WIDTH', 'MATL_MAT_CODE']
//     }
//     component.data = data;

//     component.selectCheckbox();
//     expect(component.allIndeterminate).toEqual(true);

//     // mock data 2
//     const data1 = {
//       selectedFields: ['NDCTYPE', 'PROC_RULE', 'CON_DOCDT', 'INF_NO', 'ADD_LENGTH', 'ADD_WIDTH']
//     }
//     component.data = data1;

//     component.selectCheckbox();
//     expect(component.allIndeterminate).toEqual(false);

//     // mock data 3
//     const data2 = {
//       selectedFields: ['NDCTYPE', 'CON_DOCDT', 'INF_NO', 'ADD_LENGTH', 'ADD_WIDTH']
//     }
//     component.data = data2;

//     component.selectCheckbox();
//     expect(component.allIndeterminate).toEqual(true);

//     // mock data 4
//     const data3 = {
//       selectedFields: []
//     }
//     component.data = data3;

//     component.selectCheckbox();
//     expect(component.allIndeterminate).toEqual(false);
//   }));

//   it('Drop(), should emit the change in drrag & drop array ', async(() => {
//     component.headerArray = ['NDCTYPE', 'PROC_RULE'];
//     component.hierarchyArray = ['CON_DOCDT', 'INF_NO'];
//     component.gridArray = ['ADD_LENGTH', 'ADD_WIDTH'];
//     const cdkEvent = { previousIndex: 0, currentIndex: 1 } as CdkDragDrop<MetadataModel[]>;

//     component.drop(cdkEvent, 'header', null);
//     expect(component.headerArray.length).toEqual(2);

//     component.drop(cdkEvent, 'grid', null);
//     expect(component.gridArray.length).toEqual(2);

//     component.drop(cdkEvent, 'hierarchy', null);
//     expect(component.hierarchyArray.length).toEqual(2);

//     component.drop(cdkEvent, 'else', null);
//     expect(component.hierarchyArray.length).toEqual(2);
//   }));

//   it('ismarked(), should highlight the user search fields', () => {
//     component.markedFields = ['NDCTYPE'];
//     expect(component.isMarked('NDCTYPE')).toEqual(true);

//     expect(component.isMarked('INF_NO')).toEqual(false);
//   });

//   it('onWindowScroll(), should scroll to initial marked element', async(() => {
//     component.headerArray = ['NDCTYPE'];
//     component.hierarchyArray = ['CON_DOCDT'];
//     component.gridArray = ['ADD_WEIGHT'];
//     component.markedFields = ['NDCTYPE', 'ADD_WEIGHT'];
//     const dummyElement = document.createElement('div');
//     document.getElementById = jasmine.createSpy('mat-card').and.returnValue(dummyElement);

//     component.onWindowScroll();
//     expect(component.markedFields.length).toEqual(2);

//     component.markedFields = ['ADD_WEIGHT'];
//     component.onWindowScroll();
//     expect(component.markedFields.length).toEqual(1);

//     component.markedFields = ['INF_NO'];
//     component.onWindowScroll();
//     expect(component.markedFields.length).toEqual(1);
//   }));

//   it('searchKeyDown(), shoud return the press key', async(() => {
//     component.dynamicSearchVal = 'NDC';
//     const ev = { key: 'Enter', preventDefault() { } } as KeyboardEvent;
//     component.searchKeyDown(ev);
//     expect(ev.key).toEqual('Enter');

//     const ev1 = { key: 'ArrowRight', preventDefault() { } } as KeyboardEvent;
//     component.searchKeyDown(ev1);
//     expect(ev1.key).toEqual('ArrowRight');

//     const ev2 = { key: 'ArrowLeft', preventDefault() { } } as KeyboardEvent;
//     component.searchKeyDown(ev2);
//     expect(ev2.key).toEqual('ArrowLeft');

//     const ev3 = { key: 'Up', preventDefault() { } } as KeyboardEvent;
//     component.searchKeyDown(ev3);
//     expect(ev3.key).toEqual('Up');

//     component.dynamicSearchVal = null;
//     const ev4 = { key: 'Enter', preventDefault() { } } as KeyboardEvent;
//     component.searchKeyDown(ev4);
//     expect(ev4.key).toEqual('Enter');
//   }));

//   it('onTextboxChange()', () => {
//     component.onTextboxChange();
//     expect(component.index).toEqual(0);
//   });

//   it('findNext(), should emit the next offset value', async(() => {
//     component.headerArray = ['NDCTYPE'];
//     component.hierarchyArray = ['CON_DOCDT'];
//     component.gridArray = ['ADD_WEIGHT'];
//     component.markedFields = ['NDCTYPE', 'ADD_WEIGHT'];
//     const dummyElement = document.createElement('div');
//     document.getElementById = jasmine.createSpy('mat-card').and.returnValue(dummyElement);

//     component.findNext();
//     expect(component.markedFields.length).toEqual(2);

//     component.markedFields = ['ADD_WEIGHT'];
//     component.findNext();
//     expect(component.markedFields.length).toEqual(1);

//     component.markedFields = ['INF_NO'];
//     component.findNext();
//     expect(component.markedFields.length).toEqual(1);

//     component.markedFields = [];
//     component.findNext();
//     expect(component.markedFields.length).toEqual(0);
//   }));


//   it('findprev(), should emit previous offset value', async(() => {
//     component.headerArray = ['NDCTYPE'];
//     component.hierarchyArray = ['CON_DOCDT'];
//     component.gridArray = ['ADD_WEIGHT'];
//     component.markedFields = ['NDCTYPE', 'ADD_WEIGHT'];
//     const dummyElement = document.createElement('div');
//     document.getElementById = jasmine.createSpy('mat-card').and.returnValue(dummyElement);

//     component.findPrev();
//     expect(component.markedFields.length).toEqual(2);

//     component.markedFields = ['ADD_WEIGHT'];
//     component.findPrev();
//     expect(component.markedFields.length).toEqual(1);

//     component.markedFields = ['INF_NO'];
//     component.findPrev();
//     expect(component.markedFields.length).toEqual(1);

//     component.markedFields = [];
//     component.findPrev();
//     expect(component.markedFields.length).toEqual(0);
//   }));

//   it('canMoveHighlight() should return highlight search word', async(() => {
//     component.canMoveHighlight();
//     expect(component.matchCount).toBeGreaterThanOrEqual(0);
//   }));

//   it('selectall(), return all fields is checked or not', () => {
//     component.headerArray = ['NDCTYPE'];
//     component.hierarchyArray = ['CON_DOCDT'];
//     component.gridArray = ['ADD_WEIGHT'];
//     component.allChecked = true;
//     const data = {
//       selectedFields: ['NDCTYPE', 'ADD_WEIGHT']
//     }
//     component.data = data;

//     component.selectAll();
//     expect(component.gridArray.length).toEqual(1);

//     component.allChecked = false;
//     component.selectAll();
//     expect(component.hierarchyChecked).toEqual(false);
//   });

  // it('hierarchSelect(), return all hierarchy fields is checked or not', () => {
  //   const data = {
  //     selectedFields: ['CON_DOCDT']
  //   }
  //   component.data = data;
  //   component.hierarchyChecked = true;
  //   component.hierarchyArray = ['CON_DOCDT', 'INF_NO'];

  //   component.hierarchSelect();
  //   expect(component.hierarchyArray.length).toEqual(2);

  //   component.hierarchyChecked = false;
  //   component.hierarchSelect();
  //   expect(component.allIndeterminate).toEqual(true);
  // });

  // it('gridSelect(), return all grid fields is checked or not', () => {
  //   component.gridArray = ['ADD_WEIGHT', 'ADD_HEIGHT'];
  //   component.gridChecked = true;
  //   const data = {
  //     selectedFields: ['ADD_WEIGHT']
  //   }
  //   component.data = data;

  //   component.gridSelect();
  //   expect(component.gridArray.length).toEqual(2);

  //   component.gridChecked = false;
  //   component.gridSelect();
  //   expect(component.allIndeterminate).toEqual(true);
  // });

  // it('mangeChooseColumn(), should select and unselect the field', async(() => {
  //   const event = {
  //     option: {
  //       _value: { fieldId: 'NDC_TYPE' }
  //     },
  //     source: null
  //   }
  //   const data = {
  //     selectedFields: ['INF_NO']
  //   }
  //   component.data = data;
  //   component.mangeChooseColumn(event);
  //   expect(component.data.selectedFields.length).toEqual(2);

  //   const event1 = {
  //     option: {
  //       _value: { fieldId: 'INF_NO' }
  //     },
  //     source: null
  //   }
  //   component.mangeChooseColumn(event1);
  //   expect(component.data.selectedFields.length).toEqual(1);
  // }));

  // it('isSelected(), check field is selected or not', () => {
  //   const data = {
  //     selectedFields: ['INF_NO']
  //   }
  //   component.data = data;

  //   expect(component.isSelected('INF_NO')).toEqual(true);

  //   expect(component.isSelected('NDC_TYPE')).toEqual(false);

  //   const data1 = {};
  //   component.data = data1;

  //   expect(component.isSelected('NDC_TYPE')).toEqual(false);
  // });

//   it('close()', () => {
//     component.close();
//     expect(component.close).toBeTruthy();
//   });
});