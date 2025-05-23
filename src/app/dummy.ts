onDateSelected1(selectedDate: string) {
    debugger;
    let status = '', takeSareeCount = '';
    let considerCount = false, considerPreviousCount = false;
    let finalMessage = '';
    let totalCount = 0, count = 0, presentIndex = 0, pastIndex = 0, previousCount = 0, totalPreviousCount = 0;
    let presentName = '', pastName = '';
    this.copyOfCustomers.forEach(customer => {
      let selectDate = this.compareDates(selectedDate, this.todayDate.toString());
      let expectedDate = this.compareDates(customer.expectedDeliveryDate, this.todayDate.toString());
      if ((selectDate.isToday && expectedDate.isToday) || customer.deliveryStatus == 'no') {
        let dateVisit = customer.dateVisited.split(',');
        dateVisit.forEach((deliveryCheck, i, obj) => {
          if ((i + 1) % 2 == 0) {
            let takeDate = deliveryCheck.split('\n\n')[1].split(' ')[0].split('-');
            if (this.isDatematch(takeDate, selectedDate)) {
              status = obj[i].split('- ')[1]
              takeSareeCount = obj[i - 1].split(': ')[1];
              pastName += '\n' + pastIndex + '.' + customer.firstName + ' - ' + takeSareeCount.toString() + ' - ' + status + '\n';
            }
          } else {
            let takeDate = deliveryCheck.split(' ')[0].split('-');
            if (this.isDatematch(takeDate, selectedDate)) {
              status = 'In-Progress'
              takeSareeCount = obj[i].split(': ')[1];
              pastName += '\n' + pastIndex + '.' + customer.firstName + ' - ' + takeSareeCount.toString() + ' - ' + status + '\n';
            }
          }
        })
      }
    })

    return { count: Number(takeSareeCount), status: status }
  }
