import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GMapaComponent } from './g-mapa.component';

describe('GMapaComponent', () => {
  let component: GMapaComponent;
  let fixture: ComponentFixture<GMapaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GMapaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GMapaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
