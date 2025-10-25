import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroIngresos } from './registro-ingresos';

describe('RegistroIngresos', () => {
  let component: RegistroIngresos;
  let fixture: ComponentFixture<RegistroIngresos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroIngresos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroIngresos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
