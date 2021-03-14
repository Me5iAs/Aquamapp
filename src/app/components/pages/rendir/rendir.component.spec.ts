import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RendirComponent } from './rendir.component';

describe('RendirComponent', () => {
  let component: RendirComponent;
  let fixture: ComponentFixture<RendirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RendirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RendirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
