import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShortUrl } from './short-url';

describe('ShortUrl', () => {
  let component: ShortUrl;
  let fixture: ComponentFixture<ShortUrl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShortUrl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShortUrl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
