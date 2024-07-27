import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicarteraComponent } from './micartera.component';

describe('MicarteraComponent', () => {
  let component: MicarteraComponent;
  let fixture: ComponentFixture<MicarteraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicarteraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicarteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
