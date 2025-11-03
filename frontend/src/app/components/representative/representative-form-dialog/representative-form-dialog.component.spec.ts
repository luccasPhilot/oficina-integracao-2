import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepresentativeFormDialogComponent } from './representative-form-dialog.component';

describe('RepresentativeFormDialogComponent', () => {
  let component: RepresentativeFormDialogComponent;
  let fixture: ComponentFixture<RepresentativeFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RepresentativeFormDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RepresentativeFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
