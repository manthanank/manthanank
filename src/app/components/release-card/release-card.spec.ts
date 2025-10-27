import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReleaseCard } from './release-card';

describe('ReleaseCard', () => {
  let component: ReleaseCard;
  let fixture: ComponentFixture<ReleaseCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReleaseCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReleaseCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
