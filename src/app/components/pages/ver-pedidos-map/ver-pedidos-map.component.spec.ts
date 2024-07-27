import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPedidosMapComponent } from './ver-pedidos-map.component';

describe('VerPedidosMapComponent', () => {
  let component: VerPedidosMapComponent;
  let fixture: ComponentFixture<VerPedidosMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerPedidosMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPedidosMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
