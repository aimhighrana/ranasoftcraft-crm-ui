import { MdoUiLibraryModule } from 'mdo-ui-library';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@modules/shared/shared.module';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { HierarchyFilterComponent } from './hierarchy-filter.component';

describe('HierarchyFilterComponent', () => {
  let component: HierarchyFilterComponent;
  let fixture: ComponentFixture<HierarchyFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HierarchyFilterComponent, SearchInputComponent ],
      imports: [ MdoUiLibraryModule,
        HttpClientTestingModule, AppMaterialModuleForSpec, SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clickedActive(), should select or deselect the checkbox', async() => {
    // When child is null
    const elementWithoutChild = {
      nodeId : '1005',
      nodeDesc : 'INDIA',
      child: null,
      checked: false
    }
    component.clickedActive(elementWithoutChild);
    expect(elementWithoutChild.checked).toEqual(true);

    // When child is not null
    const elementWithChild = {
      nodeId : '1005',
      nodeDesc : 'INDIA',
      child: [
        {
          nodeId : '1005-001',
          nodeDesc : 'RAJASTHAN',
          child: null,
          checked: false
        }
      ],
      checked: false
    }
    component.clickedActive(elementWithChild);
    expect(elementWithChild.checked).toEqual(true);
    // expect(component.checkForChild).toHaveBeenCalledWith(!elementWithChild.checked, elementWithChild.child)
  })

  it('checkForChild(), should select/deselect child according to the parent', async() => {
    let parentState = false;
    const childArray = [
        {
          nodeId : '1005-001',
          nodeDesc : 'RAJASTHAN',
          child: null,
          checked: true
        }
    ]
    component.checkForChild(parentState, childArray);
    expect(childArray[0].checked).toEqual(false);

    parentState = true;
    component.checkForChild(parentState, childArray);
    expect(childArray[0].checked).toEqual(true);
  })

  it('changeState(), should change expand state', async() => {
    const data = {
      nodeId : '1005-001',
      nodeDesc : 'RAJASTHAN',
      child: null,
      checked: true,
      expanded: false
    }
    component.changeState(data);
    expect(data.expanded).toEqual(true);
  })
})