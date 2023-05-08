import { TestBed } from '@angular/core/testing';

import { RequestLocationService } from './request-location.service';

describe('RequestLocationService', () => {
  let service: RequestLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
