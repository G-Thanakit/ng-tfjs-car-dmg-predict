import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarPredictComponent } from './car-predict.component';

describe('CarPredictComponent', () => {
  let component: CarPredictComponent;
  let fixture: ComponentFixture<CarPredictComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarPredictComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarPredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
