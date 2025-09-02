import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PullRequest } from './pull-request';

describe('PullRequest', () => {
  let component: PullRequest;
  let fixture: ComponentFixture<PullRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PullRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PullRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
