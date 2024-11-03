import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAlumnosComponent } from './card-alumnos.component';

describe('CardAlumnosComponent', () => {
  let component: CardAlumnosComponent;
  let fixture: ComponentFixture<CardAlumnosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardAlumnosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardAlumnosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
