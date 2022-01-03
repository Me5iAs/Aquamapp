import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMapComponent } from './ver-map.component';

describe('VerMapComponent', () => {
  let component: VerMapComponent;
  let fixture: ComponentFixture<VerMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
