import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablasUsuariosComponent } from './tablas-usuarios.component';

describe('TablasSuauriosComponent', () => {
  let component: TablasUsuariosComponent;
  let fixture: ComponentFixture<TablasUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablasUsuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablasUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
