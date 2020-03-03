import { TestBed, async } from '@angular/core/testing';

import { UserService } from './userservice.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Any2tsService } from '../any2ts.service';
import { EndpointService } from '../endpoint.service';
import { Userdetails } from 'src/app/_models/userdetails';

describe('UserService', () => {
  let userService: UserService;
  let any2tsServiceSpy: jasmine.SpyObj<Any2tsService>;
  let endpointServiceSpy: jasmine.SpyObj<EndpointService>;
  let httpTestingController: HttpTestingController;
  beforeEach(async(() => {
    const any2tsSpy = jasmine.createSpyObj('Any2tsService', ['any2UserDetails']);
    const endpointSpy = jasmine.createSpyObj('EndpointService', ['getUserDetailsUrl']);
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UserService,
        { provide: EndpointService, useValue: endpointSpy },
        { provide: Any2tsService, useValue: any2tsSpy }
      ]
    }).compileComponents();
    userService = TestBed.inject(UserService);
    any2tsServiceSpy = TestBed.inject(Any2tsService) as jasmine.SpyObj<Any2tsService>;
    endpointServiceSpy = TestBed.inject(EndpointService) as jasmine.SpyObj<EndpointService>;
    httpTestingController = TestBed.inject(HttpTestingController);
  }));

  it('should be created', () => {
    const service: UserService = TestBed.inject(UserService);
    expect(service).toBeTruthy();
  });

  it('getUserDetails(): get user details ', async(() => {
    const apiUrl = 'test user details url';
    const userId = 'admin';
    // mock url
    endpointServiceSpy.getUserDetailsUrl.withArgs(userId).and.returnValue(apiUrl);
    const mockData = {} as any;
    const expectedData: Userdetails = new Userdetails();
    // mock any2Ts
    any2tsServiceSpy.any2UserDetails.withArgs(mockData).and.returnValue(expectedData);
    // actual call
    userService.getUserDetails().subscribe(actualData => {
      expect(actualData).toEqual(expectedData);
    });
    // mock http
    httpTestingController.expectNone(apiUrl);
    // verify http
    httpTestingController.verify();
  }));

});
