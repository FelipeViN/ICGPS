import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstudiantesGrupoComponent } from './estudiantes-grupo.component';

describe('EstudiantesGrupoComponent', () => {
  let component: EstudiantesGrupoComponent;
  let fixture: ComponentFixture<EstudiantesGrupoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstudiantesGrupoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstudiantesGrupoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
