import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { ListPageViewDetails } from '@models/list-page/listpage';
import { Userdetails } from '@models/userdetails';
import { EndpointsListService } from '@services/_endpoints/endpoints-list.service';

import { ListService } from './list.service';

describe('ListService', () => {
  let listService: ListService;
  let endpointServiceSpy: jasmine.SpyObj<EndpointsListService> ;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    const endpointSpy = jasmine.createSpyObj('EndpointsListService', ['getAllListPageViewsUrl', 'getListPageViewDetailsUrl', 'upsertListPageViewUrl', 'deleteListPageViewUrl']);
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        { provide: EndpointsListService, useValue: endpointSpy}
      ]
    });
    listService = TestBed.inject(ListService);
    httpTestingController = TestBed.inject(HttpTestingController);
    endpointServiceSpy = TestBed.inject(EndpointsListService) as jasmine.SpyObj<EndpointsListService>;
  });

  it('should be created', () => {
    expect(listService).toBeTruthy();
  });

  /* it('getAllListPageViews()', async(() => {

    const url = `getAllListPageViewsUrl`;
    // mock url
    endpointServiceSpy.getAllListPageViewsUrl.and.returnValue(url);

    const response = [new ListPageViewDetails()];

    const userDetails = new Userdetails();
    userDetails.userName = 'Admin';
    userDetails.currentRoleId = 'Admin';
    userDetails.plantCode = '0';
    const moduleId = '1005';

    // actual service call
    listService.getAllListPageViews(userDetails.userName, userDetails.currentRoleId, userDetails.plantCode, moduleId )
      .subscribe(actualResponse => {
          expect(actualResponse).toEqual(response);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?userId=${userDetails.userName}&role=${userDetails.currentRoleId}&tenantcode=${userDetails.plantCode}&moduleId=${moduleId}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(response);
    // verify http
    httpTestingController.verify();
  })); */

  it('getListPageViewDetails()', async(() => {

    const url = `getListPageViewDetailsUrl`;
    // mock url
    endpointServiceSpy.getListPageViewDetailsUrl.and.returnValue(url);

    const viewDetails = new ListPageViewDetails();
    viewDetails.viewId = '1701';
    const userDetails = new Userdetails();
    userDetails.userName = 'Admin';
    userDetails.currentRoleId = 'Admin';
    userDetails.plantCode = '0';
    const moduleId = '1005';

    // actual service call
    listService.getListPageViewDetails(viewDetails.viewId, userDetails.userName, userDetails.currentRoleId, userDetails.plantCode, moduleId )
      .subscribe(actualResponse => {
          expect(actualResponse).toEqual(viewDetails);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?userId=${userDetails.userName}&role=${userDetails.currentRoleId}&tenantcode=${userDetails.plantCode}&moduleId=${moduleId}`);
    expect(mockRequst.request.method).toEqual('GET');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(viewDetails);
    // verify http
    httpTestingController.verify();
  }));

  it('upsertListPageViewDetails()', async(() => {

    const url = `upsertListPageViewUrl`;
    // mock url
    endpointServiceSpy.upsertListPageViewUrl.and.returnValue(url);

    const viewDetails = new ListPageViewDetails();
    viewDetails.viewId = '1701';
    const userDetails = new Userdetails();
    userDetails.userName = 'Admin';
    userDetails.currentRoleId = 'Admin';
    userDetails.plantCode = '0';
    const moduleId = '1005';

    // actual service call
    listService.upsertListPageViewDetails(viewDetails, userDetails.userName, userDetails.currentRoleId, userDetails.plantCode, moduleId )
      .subscribe(actualResponse => {
          expect(actualResponse).toEqual(viewDetails);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?userId=${userDetails.userName}&role=${userDetails.currentRoleId}&tenantcode=${userDetails.plantCode}&moduleId=${moduleId}`);
    expect(mockRequst.request.method).toEqual('POST');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(viewDetails);
    // verify http
    httpTestingController.verify();
  }));

  it('deleteListPageView()', async(() => {

    const url = `deleteListPageViewUrl`;
    // mock url
    endpointServiceSpy.deleteListPageViewUrl.and.returnValue(url);

    const viewDetails = new ListPageViewDetails();
    viewDetails.viewId = '1701';
    const userDetails = new Userdetails();
    userDetails.userName = 'Admin';
    userDetails.currentRoleId = 'Admin';
    userDetails.plantCode = '0';
    const moduleId = '1005';

    // actual service call
    listService.deleteListPageView(viewDetails.viewId, userDetails.userName, userDetails.currentRoleId, userDetails.plantCode, moduleId )
      .subscribe(actualResponse => {
          expect(actualResponse).toEqual(viewDetails);
    });
    // mock http call
    const mockRequst = httpTestingController.expectOne(`${url}?userId=${userDetails.userName}&role=${userDetails.currentRoleId}&tenantcode=${userDetails.plantCode}&moduleId=${moduleId}`);
    expect(mockRequst.request.method).toEqual('DELETE');
    expect(mockRequst.request.responseType).toEqual('json');
    mockRequst.flush(viewDetails);
    // verify http
    httpTestingController.verify();
  }));

});