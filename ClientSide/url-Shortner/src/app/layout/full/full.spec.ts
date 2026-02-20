import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Full } from './full';

describe('Full', () => {
  let component: Full;
  let fixture: ComponentFixture<Full>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Full]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Full);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
