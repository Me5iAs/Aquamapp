import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GInputComponent } from './g-input.component';

describe('GInputComponent', () => {
  let component: GInputComponent;
  let fixture: ComponentFixture<GInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
