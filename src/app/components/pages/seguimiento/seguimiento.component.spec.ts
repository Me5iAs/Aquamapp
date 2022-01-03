import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoComponent } from './seguimiento.component';

describe('SeguimientoComponent', () => {
  let component: SeguimientoComponent;
  let fixture: ComponentFixture<SeguimientoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
