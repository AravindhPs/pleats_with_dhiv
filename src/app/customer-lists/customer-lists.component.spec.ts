import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerListsComponent } from './customer-lists.component';

describe('CustomerListsComponent', () => {
  let component: CustomerListsComponent;
  let fixture: ComponentFixture<CustomerListsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerListsComponent]
    });
    fixture = TestBed.createComponent(CustomerListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
