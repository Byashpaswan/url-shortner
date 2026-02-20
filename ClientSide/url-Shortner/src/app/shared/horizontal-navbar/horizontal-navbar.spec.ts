import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalNavbar } from './horizontal-navbar';

describe('HorizontalNavbar', () => {
  let component: HorizontalNavbar;
  let fixture: ComponentFixture<HorizontalNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalNavbar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
