import { Component, OnInit } from '@angular/core';
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
  name: string = '';
  isAdmin: boolean = true;
  openAdminPage: boolean = false;
  openCustomerPage: boolean = false;
  customerRequest: boolean = false;

  constructor(private commonService: CommonServiceService) { }

  openPages() {
    if (this.name.toLowerCase() == 'a3d') {
      this.openAdminPage = true;
    } else {
      this.openCustomerPage = true;
    }
  }

  ngOnInit(): void {
    this.commonService.message$.subscribe((res: any) => {
      this.loadCustomer = this.isAdd = this.isUpdate = this.loader = false;
      res = JSON.parse(res);
      if (res.customerRequest) {
        this.isAdmin = false;
        this.openCustomerPage = false;
        this.openAdminPage = true;
        this.loadCustomer = true;
        this.customerRequest = true;
      } else {
        if (res == 'loadCustomer') {
          this.loadCustomer = true;
        } else if (res == 'edit') {
          this.isUpdate = true;
        } else if (res == 'add') {
          this.isAdd = true;
        } else {
          this.loader = true;
        }
      }
    })
  }

  goToCustomerList() {
    if (this.openCustomerPage) {
      this.openCustomerPage = false;
      this.isAdmin = true;
      this.name = '';
    } else {
      this.openAdminPage = false;
      this.isAdmin = true;
      this.name = '';
    }
  }
}
