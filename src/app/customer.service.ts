import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  measurements: CustomerMeasurement;
  dateVisited:string;
  deliveryStatus:string;
  expectedDeliveryDate:string;
}

export interface CustomerMeasurement {
 palluLength:string;
 Hip1:string;
 Hip2:string;
 bSize:string;
 notes:string;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = environment.apiUrl + '/customers';

  constructor(private http: HttpClient) { }

  private handleError(error: any) {
    console.error('API Error: ', error);
    return throwError(() => new Error('Something bad happened; please try again later. Details: ' + error.message || error.error?.error || error));
  }


  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCustomer(phone: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${phone}`).pipe(
      catchError(this.handleError)
    );
  }

  createCustomer(customer: any): Observable<any> { // Consider a more specific response type
    return this.http.post<any>(this.apiUrl, customer, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  updateCustomer(id: string, customer: Partial<Customer>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, customer, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }
}