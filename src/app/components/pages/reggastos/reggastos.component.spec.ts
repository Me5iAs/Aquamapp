import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReggastosComponent } from './reggastos.component';

describe('ReggastosComponent', () => {
  let component: ReggastosComponent;
  let fixture: ComponentFixture<ReggastosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReggastosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReggastosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
