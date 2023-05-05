import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestLocationComponent } from './request-location.component';

describe('RequestLocationComponent', () => {
  let component: RequestLocationComponent;
  let fixture: ComponentFixture<RequestLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestLocationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
