import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalProfesoresComponent } from './modal-profesores.component';

describe('ModalProfesoresComponent', () => {
  let component: ModalProfesoresComponent;
  let fixture: ComponentFixture<ModalProfesoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalProfesoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalProfesoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
