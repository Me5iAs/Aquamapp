import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GDialogComponent } from './g-dialog.component';

describe('GDialogComponent', () => {
  let component: GDialogComponent;
  let fixture: ComponentFixture<GDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
