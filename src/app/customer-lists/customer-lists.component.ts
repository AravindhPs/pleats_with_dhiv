import { Component, Input, OnInit } from '@angular/core';
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
  @Input() customerRequest: boolean = false;

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

  openGoogleReview(): void {
    window.open('https://g.page/r/CY2Ajw0rWrkUEBM/review', '_blank');
  }


  loadCustomers(): void {
    this.searchPhone = '';
    this.isLoading = true;
    this.error = null;
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.customers.forEach((customer: Customer, i) => {
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
    this.commonService.sendMessage(JSON.stringify('add'));
  }

  onInputChange(isphone?: string): void {
    if (isphone && isphone != '') {
      this.customers = [];
      if (this.searchPhone.length == 10) {
        this.customers = this.commonService.copyOfCustomers;
        this.customers = this.customers.filter(i => i.phone.toLowerCase().includes(this.searchPhone.toLowerCase()));
      }
    } else {
      this.customers = this.commonService.copyOfCustomers;
      if (this.searchPhone != '') {
        if (this.orderStatus == 'Delivered') {
          this.customers = this.customers.filter(i => i.firstName.toLowerCase().includes(this.searchPhone.toLowerCase()) && i.deliveryStatus == 'yes');
        } else if (this.orderStatus == 'In-Progress') {
          this.customers = this.customers.filter(i => i.firstName.toLowerCase().includes(this.searchPhone.toLowerCase()) && i.deliveryStatus == 'no');
        } else {
          this.customers = this.customers.filter(i => i.firstName.toLowerCase().includes(this.searchPhone.toLowerCase()));
        }
      } else {
        this.filterData();
      }
    }
  }

  onEditCustomer(customer: Customer): void {
   this.commonService.sendMessage(JSON.stringify('edit'));
    this.commonService.newCustomer = customer;
  }

}
