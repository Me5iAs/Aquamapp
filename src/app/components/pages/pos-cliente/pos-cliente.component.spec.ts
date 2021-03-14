import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PosClienteComponent } from './pos-cliente.component';

describe('PosClienteComponent', () => {
  let component: PosClienteComponent;
  let fixture: ComponentFixture<PosClienteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PosClienteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PosClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
