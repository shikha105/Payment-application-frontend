import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'add-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatOptionModule,
  ],
  templateUrl: './add-payment.component.html',
  styleUrl: './add-payment.component.css',
})
export class AddPaymentComponent {
  paymentForm = this.fb.group({
    payee_first_name: ['', Validators.required],
    payee_last_name: ['', Validators.required],
    payee_added_date_utc: ['', Validators.required],
    payee_due_date: ['', Validators.required],
    due_amount: ['', [Validators.required, Validators.min(0.01)]],
    payee_payment_status: ['pending', Validators.required],
    payee_address_line_1: ['', Validators.required],
    payee_address_line_2: ['', Validators.required],
    payee_city: ['', Validators.required],
    payee_province_or_state: ['', Validators.required],
    payee_country: ['', Validators.required],
    payee_postal_code: ['', Validators.required],
    payee_phone_number: ['', Validators.required],
    payee_email: ['', [Validators.required, Validators.email]],
    currency: ['', Validators.required],
    tax_percent: ['', Validators.required],
    discount_percent: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    public router: Router,
    private paymentService: PaymentService
  ) {}
  submitPayment(): void {
    if (this.paymentForm.valid) {
      const formData = { ...this.paymentForm.value };

      if (formData.payee_added_date_utc) {
        formData.payee_added_date_utc = formatDate(
          formData.payee_added_date_utc,
          'yyyy-MM-ddTHH:mm:ss.SSSZ',
          'en-US'
        );
      }

      if (formData.payee_due_date) {
        formData.payee_due_date = formatDate(
          formData.payee_due_date,
          'yyyy-MM-dd',
          'en-US'
        );
      }

      this.paymentService.createPayment(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Failed to create payment', error);
        },
      });
    } else {
      console.log('Invalid form');
    }
  }
}
