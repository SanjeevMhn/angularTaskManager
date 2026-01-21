import { TestBed } from '@angular/core/testing';

import { WorkboardService } from './workboard-service';

describe('WorkboardService', () => {
  let service: WorkboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
