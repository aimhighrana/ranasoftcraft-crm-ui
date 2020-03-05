import { TestBed, inject, async } from '@angular/core/testing';

import { EndpointService } from './endpoint.service';

describe('EndpointService', () => {
  beforeEach(() => {
    const endPointProvider = jasmine.createSpyObj('EndpointService',['getAllUnselectedFields']);
    TestBed.configureTestingModule({
      providers: [
        {provide:EndpointService, useValue:endPointProvider}
      ]
    });
  });

  it('should be created', inject([EndpointService], (service: EndpointService) => {
    expect(service).toBeTruthy();
  }));

  it('getAllUnselectedFields(), should return the unselected url', async(() =>{
      const serObj = new EndpointService();
      expect(serObj.getAllUnselectedFields()).toContain('/schema/get-unselected-fields');
  }));
});