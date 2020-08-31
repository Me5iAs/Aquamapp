import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { movimientosComponent } from './movimientos.component';

describe('movimientosComponent', () => {
  let component: movimientosComponent;
  let fixture: ComponentFixture<movimientosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ movimientosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(movimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
