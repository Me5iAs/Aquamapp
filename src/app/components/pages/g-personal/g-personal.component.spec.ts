import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GPersonalComponent } from './g-personal.component';

describe('GPersonalComponent', () => {
  let component: GPersonalComponent;
  let fixture: ComponentFixture<GPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
