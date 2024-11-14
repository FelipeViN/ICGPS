import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaAdministrativosComponent } from './tabla-administrativos.component';

describe('TablaAdministrativosComponent', () => {
  let component: TablaAdministrativosComponent;
  let fixture: ComponentFixture<TablaAdministrativosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaAdministrativosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaAdministrativosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
