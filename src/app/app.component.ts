import { Component, OnInit } from '@angular/core';
import { Customer, CustomerMeasurement, CustomerService } from './customer.service'; // Adjust path
import { CommonServiceService } from './common-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'pleats_with_dhiv';
  loader: boolean = false;
  isAdd: boolean = false;
  isUpdate: boolean = false;
  loadCustomer: boolean = true;
  
  constructor(private commonService: CommonServiceService) { }

  ngOnInit(): void {
    this.commonService.message$.subscribe(res=>{
      this.loadCustomer = this.isAdd = this.isUpdate = this.loader = false;
      if(res == 'loadCustomer'){
        this.loadCustomer = true;
      } else if (res == 'edit'){
        this.isUpdate = true;
      } else if (res == 'add'){
        this.isAdd = true;
      } else {
        this.loader = true;
      }
    })
  }

  goToCustomerList(){
    this.commonService.sendMessage('loadCustomer');
  }
}
