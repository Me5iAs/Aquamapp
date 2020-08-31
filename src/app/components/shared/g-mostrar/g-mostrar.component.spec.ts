import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GMostrarComponent } from './g-mostrar.component';

describe('GMostrarComponent', () => {
  let component: GMostrarComponent;
  let fixture: ComponentFixture<GMostrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GMostrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GMostrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
