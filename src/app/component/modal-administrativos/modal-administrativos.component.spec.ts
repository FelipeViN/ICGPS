import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalAdministrativosComponent } from './modal-administrativos.component';

describe('ModalAdministrativosComponent', () => {
  let component: ModalAdministrativosComponent;
  let fixture: ComponentFixture<ModalAdministrativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalAdministrativosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalAdministrativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
