import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaEstudiantesComponent } from './tabla-estudiantes.component';

describe('TablaEstudiantesComponent', () => {
  let component: TablaEstudiantesComponent;
  let fixture: ComponentFixture<TablaEstudiantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaEstudiantesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaEstudiantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
