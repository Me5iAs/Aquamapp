import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegVisitaComponent } from './reg-visita.component';

describe('RegVisitaComponent', () => {
  let component: RegVisitaComponent;
  let fixture: ComponentFixture<RegVisitaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegVisitaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegVisitaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
