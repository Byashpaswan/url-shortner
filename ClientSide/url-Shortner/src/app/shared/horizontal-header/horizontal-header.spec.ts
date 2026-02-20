import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalHeader } from './horizontal-header';

describe('HorizontalHeader', () => {
  let component: HorizontalHeader;
  let fixture: ComponentFixture<HorizontalHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
