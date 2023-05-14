import { TestBed } from '@angular/core/testing';

import { UpdateLocationService } from './update-location.service';

describe('UpdateLocationService', () => {
  let service: UpdateLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
