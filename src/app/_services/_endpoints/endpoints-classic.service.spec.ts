import { async, inject, TestBed } from '@angular/core/testing';

import { EndpointsClassicService } from './endpoints-classic.service';

describe('EndpointsClassicService', () => {

  beforeEach(() => {
    const endPointProvider = jasmine.createSpyObj('EndpointsClassicService', ['onLoadSchema']);
    TestBed.configureTestingModule({
      providers: [
        { provide: EndpointsClassicService, useValue: endPointProvider }
      ]
    });
  });

  it('should be created', inject([EndpointsClassicService], (service: EndpointsClassicService) => {
    expect(service).toBeTruthy();
  }));

  it('onLoadSchema(),should load schema', async(() => {
    const serObj = new EndpointsClassicService();
    expect(serObj.onLoadSchema()).toContain('restSchemaLogs');
  }));
});
