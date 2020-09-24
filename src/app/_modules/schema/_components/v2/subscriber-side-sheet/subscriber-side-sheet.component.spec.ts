import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SubscriberSideSheetComponent } from './subscriber-side-sheet.component';
import { of } from 'rxjs';
import { PermissionOn, SchemaDashboardPermission } from '@models/collaborator';

describe('SubscriberSideSheetComponent', () => {
  let component: SubscriberSideSheetComponent;
  let fixture: ComponentFixture<SubscriberSideSheetComponent>;
  let router: Router;
  let schemaDetailsServiceSpy: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriberSideSheetComponent],
      imports: [
        AppMaterialModuleForSpec, HttpClientTestingModule, RouterTestingModule
      ]
    })
      .compileComponents();
    router = TestBed.inject(Router);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriberSideSheetComponent);
    component = fixture.componentInstance;
    schemaDetailsServiceSpy = fixture.debugElement.injector.get(SchemaDetailsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('close(), should close the sidesheet', () => {
    spyOn(router, 'navigate');
    component.close();
    expect(router.navigate).toHaveBeenCalledWith([{ outlets: { sb: null } }])
  })

  it('getSubscribersBySchemaId(), should get subscriber details according to schema id', async () => {
    component.schemaId = '8738297834';
    spyOn(schemaDetailsServiceSpy, 'getCollaboratorDetails').withArgs(component.schemaId).and.returnValue(of({} as SchemaDashboardPermission[]));
    component.getSubscribersBySchemaId(component.schemaId);

    expect(schemaDetailsServiceSpy.getCollaboratorDetails).toHaveBeenCalledWith(component.schemaId);
  })

  it('getCollaborators(), should get all collaborators', async () => {
    const queryString = '';
    spyOn(schemaDetailsServiceSpy, 'getAllUserDetails').withArgs(queryString).and.returnValue(of({} as PermissionOn));
    component.getCollaborators(queryString);

    expect(schemaDetailsServiceSpy.getAllUserDetails).toHaveBeenCalledWith(queryString);
  })

  it('setPermissions(), should set permissions for a subscriber/collaborator', async() => {
    const permission = {
      value : ''
    }
    component.form.controls.isAdmin.setValue(false);
    component.form.controls.isViewer.setValue(false);
    component.form.controls.isEditer.setValue(false);
    component.form.controls.isReviewer.setValue(false);

    permission.value = 'Admin';
    component.setPermissions(permission);
    expect(component.form.controls.isAdmin.value).toEqual(true);

    permission.value = 'Viewer';
    component.setPermissions(permission);
    expect(component.form.controls.isViewer.value).toEqual(true);

    permission.value = 'Reviewer';
    component.setPermissions(permission);
    expect(component.form.controls.isReviewer.value).toEqual(true);

    permission.value = 'Editer';
    component.setPermissions(permission);
    expect(component.form.controls.isEditer.value).toEqual(true);
  })
});
