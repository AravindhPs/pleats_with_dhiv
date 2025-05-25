import { Injectable } from '@angular/core';
import { Customer, CustomerService } from './customer.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonServiceService {
  private messageSource = new Subject<string>();
  message$ = this.messageSource.asObservable();
  sendMessage(msg: string) {
    this.messageSource.next(msg);
  }
  months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
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
    dateVisited: this.getFormattedDateTime(),
    expectedDeliveryDate: ''
  };
  copyOfCustomers: Customer[] = [];
  error: string | null = null;
  todayDate: Date = new Date();
  dateToDeliver = '';
  isDatePossible = '';
  constructor(private customerService: CustomerService) { }

  goCustomerList(): void {
    this.sendMessage(JSON.stringify('loadCustomer'));
  }

  getFormattedDateTime(expectedDate?: Date, noTime?: boolean): string {
    const now = expectedDate ? expectedDate : new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1);
    const day = String(now.getDate());

    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format
    const formattedHours = String(hours).padStart(2, '0');

    if (noTime) {
      return `${day}-${this.months[Number(month) - 1]}-${year}`;
    } else {
      return `${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm} `;
    }
  }



  resetNewCustomerValue() {
    this.newCustomer = {
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
      dateVisited: '',
      expectedDeliveryDate: ''
    };
  }

  loadAndResetValue() {
    this.sendMessage(JSON.stringify('loadCustomer'));
    this.resetNewCustomerValue();
  }

  onDeleteCustomer(id: any, firstName: any): void {
    if (confirm(`Are you sure you want to delete customer ${id}?`)) {
      this.sendMessage(JSON.stringify('loader'));
      this.customerService.deleteCustomer(id).subscribe({
        next: () => {
          localStorage.removeItem(firstName);
         this.sendMessage(JSON.stringify('loadCustomer'));
          this.resetNewCustomerValue();
        },
        error: (err) => {
          this.error = 'Failed to delete customer: ' + err.message;
          console.error(err);
        }
      });
    }
  }

   openWhatsapp() {
    const phoneNumber = '+917010195676';
    const url = `https://wa.me/${phoneNumber.replace('+', '')}`;
    window.open(url, '_blank');
  }

  openInstagram() {
    const url = 'https://www.instagram.com/pleatswithdivu/';
    window.open(url, '_blank');
  }

  checkValidations(newCustomer?: Customer): boolean {
    const missingFields: string[] = [];

    if (!newCustomer?.firstName) missingFields.push("First Name");
    if (!newCustomer?.measurements.palluLength) missingFields.push("Pallu Length");
    if (!newCustomer?.measurements.Hip1) missingFields.push("Hip1 Size");
    if (!newCustomer?.measurements.Hip2) missingFields.push("Hip2 Size");
    if (!newCustomer?.measurements.bSize) missingFields.push("B Size");

    if (missingFields.length > 0) {
      alert("Below fields are required to continue further:" + '\n\n' + missingFields.join('\n'));
      return false;
    }

    return true;
  }

  compareDates(selectedDate: string, date: string) {

    const result = {
      isToday: false,
      isPrevious: false,
      isFuture: false
    };
    let w = '';
    if (selectedDate) {
      let day = '', month = '', year = '';
      let convert = new Date(selectedDate).toString();
      if (convert == 'Invalid Date') {
        day = selectedDate.split('-')[0];
        month = selectedDate.split('-')[1];
        year = selectedDate.split('-')[2];
      } else {
        day = new Date(selectedDate).getDate().toString();
        month = (new Date(selectedDate).getMonth() + 1).toString();
        year = new Date(selectedDate).getFullYear().toString();
      }
      w = month + '-' + day + '-' + year;

      const d1 = new Date(w);
      const d2 = new Date(date);
      const normalizedD1 = new Date(d1.getFullYear(), d1.getMonth(), d1.getDate());
      const normalizedD2 = new Date(d2.getFullYear(), d2.getMonth(), d2.getDate());

      const time1 = normalizedD1.getTime();
      const time2 = normalizedD2.getTime();

      if (time1 === time2) {
        result.isToday = true;
      } else if (time1 < time2) {
        result.isPrevious = true;
      } else {
        result.isFuture = true;
      }
    }
    return result;
  }

  onDateSelected(selectedDate: string, type: string) {
    let considerCount = false, considerPreviousCount = false;
    let finalMessage = '';
    let { isToday, isPrevious, isFuture } = this.compareDates(selectedDate, this.todayDate.toString());
    let totalCount = 0, count = 0, presentIndex = 0, pastIndex = 0, previousCount = 0, totalPreviousCount = 0;
    let presentName = '', pastName = '';
    this.copyOfCustomers.forEach((customer) => {
      let expectedDate = customer.expectedDeliveryDate.split(',');
      let datas: any = {}
      expectedDate.forEach((dates, index) => {
        let data = this.checkExpectedHasSelectedDate(dates, selectedDate, index);
        if (data.isDateAvailable) {
          datas = data;
        }
      })
      let data = this.compareDates(datas.date ? datas.date : customer.expectedDeliveryDate, selectedDate);
      if (!datas.date && expectedDate.length > 1 && customer.deliveryStatus == 'no') {
        let data = this.getCountAndStatus(customer, selectedDate, datas.index, true);
        if (data.status !== '') {
          if (data.datas.isFuture) {
            debugger;
            pastIndex++;
            considerPreviousCount = true;
            previousCount = data.count;
            pastName += '\n' + pastIndex + '.' + customer.firstName + ' - ' + previousCount.toString() + ' - ' + data.status + ' in advance which is due by ' + data.date1 + '\n';
          } else {
            presentIndex++;
            considerCount = true;
            count = data.count;
            presentName += '\n' + presentIndex + '.' + customer.firstName + ' - ' + count.toString() + ' - ' + data.status + ' in advance which is due by ' + data.date1 + '\n';;
          }
        }
      } else if (!datas.date && customer.deliveryStatus == 'yes') {
        debugger;
        let data = this.getCountAndStatus(customer, selectedDate, datas.index, true);
        if (data.status !== '') {
          presentIndex++;
          considerCount = true;
          count = data.count;
          presentName += '\n' + presentIndex + '.' + customer.firstName + ' - ' + count.toString() + ' - ' + data.status + ' is delayed from ' + data.date1 + '\n';;
        }
      }
      if (data.isToday || customer.deliveryStatus == 'no') {
        if (isPrevious && !data.isFuture && data.isToday) {
          pastIndex++;
          considerPreviousCount = true;
          let data = this.getCountAndStatus(customer, selectedDate, datas.index, false);
          previousCount = data.count;
          let status = data.status == 'Delivered' || customer.deliveryStatus == 'yes' ? 'Delivered' : 'In-Progress';
          if (data.datas.isPrevious) {
            pastName += '\n' + pastIndex + '.' + customer.firstName + ' - ' + previousCount.toString() + '- has already been delivered on ' + data.date1 + '\n';;
          } else {
            pastName += '\n' + pastIndex + '.' + customer.firstName + ' - ' + previousCount.toString() + ' - ' + status + '\n';
          }
        } else {
          if (customer.deliveryStatus == 'no' && data.isPrevious && !isFuture && isToday) {
            pastIndex++;
            considerPreviousCount = true;
            let data = this.getCountAndStatus(customer, selectedDate, datas.index, false);
            previousCount = data.count;
            pastName += '\n' + pastIndex + '.' + customer.firstName + ' - ' + previousCount.toString() + ' - pending from ' + this.getFormattedDateTime(new Date(customer.expectedDeliveryDate), true) + '\n';
          } else {
            if (data.isToday) {
              presentIndex++;
              considerCount = true;
              let data = this.getCountAndStatus(customer, selectedDate, datas.index, false);
              count = data.count;
              let status = data.status == 'Delivered' || customer.deliveryStatus == 'yes' ? 'Delivered' : 'In-Progress';
              if ((customer.deliveryStatus == 'yes' || status == 'Delivered') && data.datas.isPrevious) {
                presentName += '\n' + presentIndex + '.' + customer.firstName + ' - ' + count.toString() + '- has already been delivered on ' + data.date1 + '\n';;
              }
              else if (customer.deliveryStatus == 'yes' || status == 'Delivered') {
                presentName += '\n' + presentIndex + '.' + customer.firstName + ' - ' + count.toString() + ' - ' + status + '\n';;
              } else {
                presentName += '\n' + presentIndex + '.' + customer.firstName + ' - ' + count.toString() + '\n';
              }
            }
          }
        }

        if (considerCount) {
          totalCount += count;
          considerCount = false;
        }
        if (considerPreviousCount) {
          totalPreviousCount += previousCount;
          considerPreviousCount = false;
        }
      }
    })
    if (isToday && totalCount > 0) {
      if (totalPreviousCount > 0) {
        finalMessage = 'Sarees to be deliver today is - ' + totalCount + '\n\nPending sarees count is ' + totalPreviousCount + '\n\nTotal sarees to be deliver today is ' + Number(totalCount + totalPreviousCount) + '\n' + presentName + '\n -----------------------------------\n' + '\n' + 'Pending sarees \n' + pastName;
      } else {
        finalMessage = 'Total sarees to be deliver today is ' + totalCount + '\n' + presentName;
      }
    } else {
      if (isPrevious && totalPreviousCount > 0) {
        finalMessage = 'Total sarees delivered on this date ' + totalPreviousCount + '\n' + pastName;
      } else if (isPrevious && totalPreviousCount == 0) {
        finalMessage = 'No sarees was delivered on this date';
      } else {
        if (totalCount > 0) {
          finalMessage = 'Total sarees to be deliver on this date is ' + totalCount + '\n' + presentName;
        } else if (totalPreviousCount > 0) {
          finalMessage = 'Sarees to be deliver today is - ' + totalCount + '\n\nPending sarees count is ' + totalPreviousCount + '\n\nTotal sarees to be deliver today is ' + Number(totalCount + totalPreviousCount) + '\n' + presentName + '\n -------------------------------------\n' + '\n' + 'Pending sarees \n' + pastName;
        } else {
          if (isToday && totalCount == 0) {
            finalMessage = 'Nothing to deliver today';
          } else {
            finalMessage = 'Nothing to deliver on this date';
          }
        }
      }
    }

    return type == 'list' ? this.dateToDeliver = finalMessage : this.isDatePossible = finalMessage;
  }

  checkExpectedHasSelectedDate(expectedDate: string, selectedDate: string, index: number) {
    let day = '', month = '', year = '';
    let convert = new Date(expectedDate).toString();
    if (convert == 'Invalid Date') {
      day = expectedDate.split('-')[0];
      month = expectedDate.split('-')[1];
      year = expectedDate.split('-')[2];
    } else {
      day = new Date(expectedDate).getDate().toString();
      month = (new Date(expectedDate).getMonth() + 1).toString();
      year = new Date(expectedDate).getFullYear().toString();
    }
    expectedDate = month + '-' + day + '-' + year;
    let expect = new Date(expectedDate);
    let select = new Date(selectedDate);
    let check = expect.getDate() == select.getDate() && Number(expect.getMonth() + 1) == Number(select.getMonth() + 1) && expect.getFullYear() == select.getFullYear();
    return { isDateAvailable: check, date: expectedDate, index: index };
  }

  getCountAndStatus(customer: Customer, selectedDate: string, index: number, checkToday: boolean) {
    let dateVisit = customer.dateVisited.split(',');
    let lastArrayData = '', status = '', date = '', datas: any = {};
    if (customer.deliveryStatus == 'no' && !checkToday) {
      if (index != undefined && index.toString() != '-1' && dateVisit[index + index + 1] !== undefined) {
        lastArrayData = dateVisit[index + index];
        status = dateVisit[index + index + 1].split('- ')[1];
        date = dateVisit[index + index + 1].split('- ')[0].split(' ')[0].split(',')[0].split('\n\n')[1];
        datas = this.compareDates(date, selectedDate);
      } else {
        lastArrayData = dateVisit[dateVisit.length - 1]
      }
    } else {
      dateVisit.forEach((deliveryCheck, i, obj) => {
        if ((i + 1) % 2 == 0) {
          let takeDate = deliveryCheck.split('\n\n')[1].split(' ')[0];
          let data = this.checkExpectedHasSelectedDate(takeDate, selectedDate, i);
          if (data.isDateAvailable) {
            status = obj[i].split('- ')[1]
            lastArrayData = obj[i - 1];
            date = dateVisit[i].split('- ')[0].split(' ')[0].split(',')[0].split('\n\n')[1];
            let checkWithExpected = this.compareDates(customer.expectedDeliveryDate.split(',')[i - 1], selectedDate);
            if (checkWithExpected.isToday) {
              datas = this.compareDates(date, selectedDate);
            } else if (checkWithExpected.isFuture || checkWithExpected.isPrevious) {
              date = customer.expectedDeliveryDate.split(',')[i - 1];
              datas = this.compareDates(date, customer.expectedDeliveryDate.split(',')[i - 1]);
            }
          }
        }
      })
    }
    let takeLastSareeCount = lastArrayData.split(': ')[1]
    return { count: Number(takeLastSareeCount), status: status, datas: datas, date1: date }
  }
}
