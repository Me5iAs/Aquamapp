import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompradirectaComponent } from './compradirecta.component';

describe('CompradirectaComponent', () => {
  let component: CompradirectaComponent;
  let fixture: ComponentFixture<CompradirectaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompradirectaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompradirectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
