import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GBuscarComponent } from './g-buscar.component';

describe('GBuscarComponent', () => {
  let component: GBuscarComponent;
  let fixture: ComponentFixture<GBuscarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GBuscarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GBuscarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
