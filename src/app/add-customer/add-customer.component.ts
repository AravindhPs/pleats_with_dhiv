import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Customer, CustomerService } from '../customer.service';
import { CommonServiceService } from '../common-service.service';

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  constructor(private customerService: CustomerService, public commonService: CommonServiceService) {

  }
  error: string | null = null;
  sareeCount = 0;
  selectedDate: string = '';
  today: string = '';
  newCustomer: Customer = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    measurements: {
      palluLength: '',
      Hip1: '',
      Hip2: '',
      bSize: '',
      notes: ''
    },
    deliveryStatus: 'no',
    dateVisited: this.commonService.getFormattedDateTime() + ' - No of sarees : ' + this.sareeCount,
    expectedDeliveryDate: ''
  };

  ngOnInit(): void {
    this.todayDate();
  }

  todayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.today = `${year}-${month}-${day}`;
  }

  assignHip2Value() {
    this.newCustomer.measurements.Hip2 = (Number(this.newCustomer.measurements.Hip1) + 24).toString();
  }

  assignSareeCount() {
    this.newCustomer.dateVisited = this.commonService.getFormattedDateTime() + ' - No of sarees : ' + this.sareeCount
  }

  onSubmitNewCustomer(): void {
    if (this.commonService.checkValidations(this.newCustomer)) {
      this.commonService.sendMessage('loader')
      this.newCustomer.id = this.newCustomer.firstName + '_' + this.newCustomer.phone.substring(0, 5);
      const customerToSend = {
        ...this.newCustomer,
        phone: '+91' + this.newCustomer.phone,
        measurements: JSON.stringify(this.newCustomer.measurements),
      };

      this.customerService.createCustomer(customerToSend).subscribe({
        next: () => {
          localStorage.setItem(this.newCustomer.firstName, JSON.stringify(this.newCustomer))
          this.commonService.loadAndResetValue();
        },
        error: (err) => {
          this.error = 'Failed to create customer: ' + err.message;
          console.error(err);
        },
      });
    }
  }




}
