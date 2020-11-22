import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SchemaDetailsService } from '@services/home/schema/schema-details.service';
import { AppMaterialModuleForSpec } from 'src/app/app-material-for-spec.module';

import { SubscriberSideSheetComponent } from './subscriber-side-sheet.component';
import { of } from 'rxjs';
import { SchemaDashboardPermission } from '@models/collaborator';
import { SearchInputComponent } from '@modules/shared/_components/search-input/search-input.component';

describe('SubscriberSideSheetComponent', () => {
  let component: SubscriberSideSheetComponent;
  let fixture: ComponentFixture<SubscriberSideSheetComponent>;
  let router: Router;
  let schemaDetailsServiceSpy: SchemaDetailsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SubscriberSideSheetComponent, SearchInputComponent],
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
    const subscriberData: SchemaDashboardPermission[] = [
      {
        userid: 'Ashish'
      } as SchemaDashboardPermission
    ]
    component.subscribers = [
      {
        userName: 'AshishGoyal'
      }
    ]
    component.collaboratorData = subscriberData;
    component.getSubscribersBySchemaId(component.schemaId);
    expect(component.subscribers.length).toEqual(1);
    expect(schemaDetailsServiceSpy.getCollaboratorDetails).toHaveBeenCalledWith(component.schemaId);
  })

  // it('getCollaborators(), should get all collaborators', async () => {
  //   const queryString = '';
  //   spyOn(schemaDetailsServiceSpy, 'getAllUserDetails').withArgs(queryString).and.returnValue(of({} as PermissionOn));
  //   const response: PermissionOn = {
  //     users: [
  //       {
  //         userId: 'Ashish',
  //         userName: 'Ashishkr',
  //         fName: 'Ashish',
  //         lName: 'Goyal',
  //         fullName: 'Ashish Goyal',
  //         email: 'ashish.goyal@prospecta.com'
  //       }
  //     ]
  //   } as PermissionOn;
  //   component.subscribers = response.users;
  //   component.getCollaborators(queryString);
  //   expect(schemaDetailsServiceSpy.getAllUserDetails).toHaveBeenCalledWith(queryString);
  // })

  it('shortName(), should return initials of subscriber', () => {
    let fName = 'Ashish';
    let lName = 'Goyal';
    let result = component.shortName(fName, lName);
    expect(result).toEqual('AG');

    fName = 'Ashish';
    lName = '';
    result = component.shortName(fName, lName);
    expect(result).toEqual('')
  })

  it('addSubscriber(), should add subscriber while click on ADD button', async () => {
    const subscriber = {
      userName: 'AshishKumar',
      fName: 'Ashish',
      lName: 'Kumar',
      fullName: 'Ashish Kumar Goyal'
    };
    component.addSubscriberArr = []
    component.addSubscriber(subscriber);
    expect(component.addSubscriberArr.length).toEqual(1);
  })

  it('uncheckSubscriber(), should uncheck subscriber on click tick mark button', async () => {
    const subscriber = {
      userid: 'AshishKumar',
      fName: 'Ashish',
      lName: 'Kumar',
      fullName: 'Ashish Kumar Goyal'
    };
    component.addSubscriberArr = [
      {
        sno: '12345567',
        schemaId: '1004',
        isAdmin: false,
        isReviewer: false,
        isViewer: false,
        isEditer: false,
        groupid: '',
        roleId: '',
        userid: 'AshishKumar',
        permissionType: 'USER',
        initials: 'AK',
        fullName: 'Ashish Kumar Goyal',
        role: '',
        plantCode: ''
      }
    ]
    component.uncheckSubscriber(subscriber);
    expect(component.addSubscriberArr.length).toEqual(0);
  })
});
