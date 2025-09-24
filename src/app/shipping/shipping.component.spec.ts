import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ShippingComponent } from './shipping.component';

describe('ShippingComponent', () => {
  let component: ShippingComponent;
  let fixture: ComponentFixture<ShippingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ShippingComponent],
    });
    fixture = TestBed.createComponent(ShippingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
