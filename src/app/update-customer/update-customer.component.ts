import { Component, OnInit } from '@angular/core';
import { CommonServiceService } from '../common-service.service';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-update-customer',
  templateUrl: './update-customer.component.html',
  styleUrls: ['./update-customer.component.css']
})
export class UpdateCustomerComponent implements OnInit {
  error: string | null = null;
  sareeCount = '';
  oldSareeCount = '';
  dateVisited = '';
  expecteDate = '';
  isDelivery: boolean = false;
  today: string = '';
  constructor(public commonService: CommonServiceService, private customerService: CustomerService) {

  }

  todayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.today = `${year}-${month}-${day}`;
  }

  assignSareeCount() {
    let count = Number(this.sareeCount);
    if (this.sareeCount !== '' && count !== 0) {
      this.dateVisited = this.commonService.newCustomer.dateVisited + ',\n\n' + this.commonService.getFormattedDateTime() + ' - No of sarees : ' + count
      this.commonService.newCustomer.deliveryStatus = 'no';
    } else {
      this.sareeCount = ''
      this.dateVisited = this.commonService.newCustomer.dateVisited + ',\n\n' + this.commonService.getFormattedDateTime()
      this.commonService.newCustomer.deliveryStatus = 'yes';
    }
  }

  updateDeliveryStatus() {
    if (!this.isDelivery) {
      this.isDelivery = true;
      this.dateVisited = this.commonService.newCustomer.dateVisited + ',\n\n' + this.commonService.getFormattedDateTime() + ' - Delivered';
      this.commonService.newCustomer.deliveryStatus = 'yes';
    } else {
      this.isDelivery = false;
      this.dateVisited = this.commonService.newCustomer.dateVisited + ',\n\n' + this.commonService.getFormattedDateTime();
      this.commonService.newCustomer.deliveryStatus = 'no';
    }
  }

  ngOnInit(): void {
    this.todayDate();
    let dateVisit = this.commonService.newCustomer.dateVisited.split(',');
    let lastArrayData = dateVisit[dateVisit.length - 1];
    let takeLastSareeCount = lastArrayData.split(': ')[1]
    this.sareeCount = takeLastSareeCount;
    this.oldSareeCount = this.sareeCount;
    this.dateVisited = this.commonService.newCustomer.dateVisited + ',\n\n' + this.commonService.getFormattedDateTime()
  }

  onUpdateCustomer(): void {
    if (this.commonService.checkValidations(this.commonService.newCustomer)) {
      const customerToSend = {
        ...this.commonService.newCustomer,
        measurements: JSON.stringify(this.commonService.newCustomer.measurements)
      };
      if (this.oldSareeCount != this.sareeCount && this.sareeCount !== '' || this.isDelivery) {
        customerToSend.dateVisited = this.dateVisited;
      }
      if (this.expecteDate != '') {
        let day = '', month = '', year = '';
        year = this.expecteDate.split('-')[0];
        month = this.expecteDate.split('-')[1];
        day = this.expecteDate.split('-')[2];
        this.expecteDate = day + '-' + month + '-' + year;
        customerToSend.expectedDeliveryDate += ','+this.expecteDate;
      }
      this.commonService.newCustomer.dateVisited = this.dateVisited;
      this.commonService.sendMessage('loader')
      this.customerService.updateCustomer(customerToSend.id as string, customerToSend as any).subscribe({
        next: () => {
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
