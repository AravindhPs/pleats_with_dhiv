import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { Customer, CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-lists',
  templateUrl: './customer-lists.component.html',
  styleUrls: ['./customer-lists.component.css']
})
export class CustomerListsComponent implements OnInit {
  error: string | null = null;
  searchPhone: string = '';
  isLoading = true;
  customers: Customer[] = [];
  selectedDate: Date = new Date();
  orderStatus: string = 'Show Both';

  constructor(public commonService: CommonServiceService, private customerService: CustomerService) {

  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  filterData() {
    if (this.orderStatus == 'Delivered') {
      this.customers = this.commonService.copyOfCustomers.filter(i => i.deliveryStatus == 'yes')
    } else if (this.orderStatus == 'In-Progress') {
      this.customers = this.commonService.copyOfCustomers.filter(i => i.deliveryStatus != 'yes')
    } else {
      this.customers = this.commonService.copyOfCustomers;
    }
  }

  loadCustomers(): void {
    this.searchPhone = '';
    this.isLoading = true;
    this.error = null;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.customers.forEach((customer: Customer, i) => {
          console.log(i + 1 + '.  ' +JSON.stringify(customer));
          customer.measurements = JSON.parse(customer.measurements as any);
        })
        this.customers.sort((a, b) => a.firstName.localeCompare(b.firstName));
        this.commonService.copyOfCustomers = JSON.parse(JSON.stringify(this.customers));
        this.commonService.onDateSelected(this.selectedDate.toDateString(), 'list');
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
        console.error(err);
      }
    });
  }


  activateButton() {
    this.commonService.resetNewCustomerValue();
    this.commonService.sendMessage('add');
  }

  onInputChange(event: Event): void {
    this.customers = this.commonService.copyOfCustomers;
    if (this.searchPhone != '') {
      this.customers = this.customers.filter(i => i.phone.includes(this.searchPhone));
    }
  }

  onEditCustomer(customer: Customer): void {
    this.commonService.sendMessage('edit');
    this.commonService.newCustomer = customer;
  }

}
