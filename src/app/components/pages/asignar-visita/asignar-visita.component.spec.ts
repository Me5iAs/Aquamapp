import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarVisitaComponent } from './asignar-visita.component';

describe('AsignarVisitaComponent', () => {
  let component: AsignarVisitaComponent;
  let fixture: ComponentFixture<AsignarVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AsignarVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
