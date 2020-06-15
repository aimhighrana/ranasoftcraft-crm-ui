import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollaboratorComponent } from './collaborator.component';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ReportDashboardPermission } from '@models/collaborator';

describe('CollaboratorComponent', () => {
  let component: CollaboratorComponent;
  let fixture: ComponentFixture<CollaboratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollaboratorComponent ],
      imports:[AppMaterialModuleForSpec, ReactiveFormsModule, FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollaboratorComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('ngOnInit(), should initilize pre required ',async(()=>{
    // mock data
    const data:ReportDashboardPermission = new ReportDashboardPermission();
    data.isViewable = true; data.isEditable = true; data.isDeleteable = true;

    component.collaborator = data;
    // call actual method
    component.ngOnInit();

    const expectedData = {isViewable: true, isEditable: true, isDeleteable: true};

    expect(component.permissionFrmGrp.value).toEqual(expectedData, 'Controls should equals');

  }));

  it('updateEmit(), should emit for update request',async(()=>{

    component.updateEmit();

    expect(component.isEditMode).toEqual(false, 'After click on update tiles should be in view mode');
  }));
});
