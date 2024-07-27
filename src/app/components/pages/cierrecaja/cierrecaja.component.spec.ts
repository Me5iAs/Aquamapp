import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CierrecajaComponent } from './cierrecaja.component';

describe('CierrecajaComponent', () => {
  let component: CierrecajaComponent;
  let fixture: ComponentFixture<CierrecajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CierrecajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CierrecajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
