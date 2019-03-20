import { TestBed } from '@angular/core/testing';

import { TasklistService } from './tasklist.service';
import { HttpClientModule } from '@angular/common/http';

describe('TasklistService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      HttpClientModule
    ]
  }));

  it('should be created', () => {
    const service: TasklistService = TestBed.get(TasklistService);
    expect(service).toBeTruthy();
  });
});
