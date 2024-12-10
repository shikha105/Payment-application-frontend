import { Component, Input, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { PaymentService } from '../../services/payment.service';
import { MatCardModule } from '@angular/material/card';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
@Component({
  selector: 'app-view-payment',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    RouterLink,
    RouterLinkActive,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
  ],
  templateUrl: './view-payment.component.html',
  styleUrl: './view-payment.component.css',
})
export class ViewPaymentComponent {
  constructor(
    private paymentService: PaymentService,
    public router: Router,
    private dialog: MatDialog
  ) {}

  payments: any[] = [];

  totalDue = 0.0;
  @Input() isFileUploaded: boolean = false;

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;

    this.datasource.filter = filterValue.trim().toLowerCase();
    this.payments = this.datasource.filteredData;
  }

  displayedColumns: string[] = [
    'payee_first_name',
    'payee_last_name',
    'payee_due_date',
    'due_amount',
    'payee_payment_status',
    'payee_address_line_1',
    'payee_address_line_2',
    'payee_city',
    'payee_country',
    'payee_postal_code',
    'payee_phone_number',
    'payee_email',
    'currency',
    'actions',
  ];

  ngOnInit(): void {
    this.loadPayments();
    this.paymentService.fileUploaded$.subscribe((status) => {
      this.isFileUploaded = status;
    });
  }

  datasource: any;
  loadPayments(search: string | null = null): void {
    this.paymentService.getPayments(search, this.page, this.limit).subscribe(
      (response) => {
        this.payments = response.data;
        this.totalDue = response.total;
        this.datasource = new MatTableDataSource(this.payments);

        this.datasource.filterPredicate = (data: any, filter: string) => {
          const searchTerm = filter.trim().toLowerCase();

          return (
            data.payee_first_name.toLowerCase().includes(searchTerm) ||
            data.payee_last_name.toLowerCase().includes(searchTerm) ||
            data.payee_payment_status.toLowerCase().includes(searchTerm) ||
            data.payee_address_line_1.toLowerCase().includes(searchTerm) ||
            data.payee_country.toLowerCase().includes(searchTerm) ||
            data.payee_city.toLowerCase().includes(searchTerm) ||
            data.payee_address_line_1.toLowerCase().includes(searchTerm) ||
            data.payee_province_or_state.toLowerCase().includes(searchTerm) ||
            data.currency.toLowerCase().includes(searchTerm)
          );
        };
      },
      (error) => {
        if (error.status) {
          console.error('Error Status:', error.status);
          console.error('Error Message:', error.message);
        }
      }
    );
  }

  totalPayments: number = 0;
  page: number = 1;
  limit: number = 10;

  deletePayment(paymentId: string): void {
    this.paymentService.deletePayment(paymentId).subscribe(
      () => {
        this.loadPayments();
      },
      (error) => {
        console.error('Error deleting payment:', error);
      }
    );
  }
  onDelete(paymentId: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: { message: 'Are you sure you want to delete this payment?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentService.deletePayment(paymentId).subscribe(
          () => {
            this.loadPayments();
          },
          (error) => {
            console.error('Error deleting payment:', error);
          }
        );
      }
    });
  }

  downloadEvidence(paymentId: string) {
    this.paymentService
      .downloadEvidence(paymentId)
      .subscribe((response: any) => {
        const contentDisposition = response.headers.get('Content-Disposition');
        let fileName = 'download';
        let fileExtension = 'jpg';

        if (contentDisposition) {
          const matches = contentDisposition.match(/filename="?(.*?)"?$/);

          if (matches && matches[1]) {
            fileName = matches[1].split('.')[0];
            const ext = matches[1].split('.').pop();

            if (
              ext === 'pdf' ||
              ext === 'jpg' ||
              ext === 'jpeg' ||
              ext === 'png'
            ) {
              fileExtension = ext;
            }
          }
        }

        const blob = new Blob([response.body], { type: response.type });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileName}.${fileExtension}`;

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      });
  }
}
