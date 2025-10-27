import { TestBed } from '@angular/core/testing';

import { Ott } from './ott';

describe('Ott', () => {
  let service: Ott;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ott);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
