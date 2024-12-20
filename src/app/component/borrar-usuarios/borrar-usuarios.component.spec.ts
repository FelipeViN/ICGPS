import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrarUsuariosComponent } from './borrar-usuarios.component';

describe('BorrarUsuariosComponent', () => {
  let component: BorrarUsuariosComponent;
  let fixture: ComponentFixture<BorrarUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BorrarUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BorrarUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
