import { TestBed } from '@angular/core/testing';

import { EndpointsListService } from './endpoints-list.service';

describe('EndpointsListService', () => {
  let service: EndpointsListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EndpointsListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getAllListPageViewsUrl', () => {
    expect(service.getAllListPageViewsUrl()).toContain('/view/get-all-view');
  });

  it('should getListPageViewDetailsUrl', () => {
    expect(service.getListPageViewDetailsUrl('1701')).toContain('/view/1701');
  });

  it('should upsertListPageViewUrl', () => {
    expect(service.upsertListPageViewUrl()).toContain('/view/save-update-view');
  });

  it('should deleteListPageViewUrl', () => {
    expect(service.deleteListPageViewUrl('1701')).toContain('/view/delete-view/1701');
  });

  it('should getTableDataUrl', () => {
    expect(service.getTableDataUrl()).toContain('/search/all-data');
  });

  it('should getDataCountUrl', () => {
    expect(service.getDataCountUrl()).toContain('/search/data-count');
  });

  it('should upsertListFiltersUrl', () => {
    expect(service.upsertListFiltersUrl()).toContain('/search/save-update-filter');
  });

  it('getInboxNodesCountUrl', () => {
    expect(service.getInboxNodesCountUrl()).toContain('process/feed/count');
  });
});
