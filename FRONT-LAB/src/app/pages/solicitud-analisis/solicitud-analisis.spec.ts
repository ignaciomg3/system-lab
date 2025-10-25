import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitudAnalisis } from './solicitud-analisis';

describe('SolicitudAnalisis', () => {
  let component: SolicitudAnalisis;
  let fixture: ComponentFixture<SolicitudAnalisis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitudAnalisis]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitudAnalisis);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
