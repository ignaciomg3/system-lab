import { TestBed } from '@angular/core/testing';

import { PullRequestInDatabaseService } from './pull-request-in-database.service';

describe('PullRequestInDatabaseService', () => {
  let service: PullRequestInDatabaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PullRequestInDatabaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
