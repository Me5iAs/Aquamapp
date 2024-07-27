import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregarRendirComponent } from './entregar-rendir.component';

describe('EntregarRendirComponent', () => {
  let component: EntregarRendirComponent;
  let fixture: ComponentFixture<EntregarRendirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntregarRendirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregarRendirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
