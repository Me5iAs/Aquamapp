import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosicionClientesComponent } from './posicion-clientes.component';

describe('PosicionClientesComponent', () => {
  let component: PosicionClientesComponent;
  let fixture: ComponentFixture<PosicionClientesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosicionClientesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosicionClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
