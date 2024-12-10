import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private baseUrl = 'http://localhost:4200/payments/payments/';
  private baseUrlFiles = 'http://localhost:4200/files/payments/';

  constructor(private http: HttpClient) {}

  getPayments(
    search: string | null = null,
    page: number = 1,
    limit: number = 10
  ): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<any>(this.baseUrl, { params });
  }

  createPayment(payment: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, payment, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  updatePayment(paymentId: string, payment: any): Observable<any> {
    const url = `${this.baseUrl}${paymentId}`;

    return this.http.put<any>(url, payment, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  deletePayment(paymentId: string): Observable<any> {
    const url = `${this.baseUrl}${paymentId}`;
    return this.http.delete<any>(url);
  }

  getPaymentById(paymentId: string): Observable<any> {
    const url = `${this.baseUrl}${paymentId}`;
    return this.http.get<any>(url);
  }

  uploadEvidence(paymentId: string, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    const url = `${this.baseUrlFiles}${paymentId}/upload_evidence/`;
    return this.http.post<any>(url, formData);
  }

  downloadEvidence(paymentId: string): Observable<any> {
    const url = `${this.baseUrlFiles}${paymentId}/download_evidence/`;
    return this.http.get(url, { responseType: 'blob', observe: 'response' });
  }

  private fileUploadedSubject = new BehaviorSubject<boolean>(false);
  fileUploaded$ = this.fileUploadedSubject.asObservable();

  updateFileUploadedStatus(status: boolean): void {
    this.fileUploadedSubject.next(status);
  }
}
