import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  FormGroup,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-edit-payment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatToolbarModule,
    MatOptionModule,
    CommonModule,
    MatSelectModule,
  ],
  templateUrl: './edit-payment.component.html',
  styleUrl: './edit-payment.component.css',
})
export class EditPaymentComponent implements OnInit {
  paymentForm: FormGroup;
  paymentId: any = '';
  isFileUploaded: boolean = true;
  evidence_id: string = '';
  statusError = false;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.paymentForm = this.fb.group({
      payee_first_name: ['', Validators.required],
      payee_last_name: ['', Validators.required],
      payee_added_date_utc: ['', Validators.required],
      payee_due_date: ['', Validators.required],
      due_amount: ['', [Validators.required, Validators.min(0.01)]],
      payee_payment_status: ['', Validators.required],
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
      evidence_id: [],
    });
  }

  ngOnInit(): void {
    this.paymentId = this.route.snapshot.paramMap.get('id') || '';
    this.loadPaymentDetails();
  }

  loadPaymentDetails(): void {
    this.paymentService
      .getPaymentById(this.paymentId)
      .subscribe((response: any) => {
        const payment = response.data;
        this.paymentForm.patchValue(payment);
      });
  }

  onStatusChange(): void {
    const status = this.paymentForm.get('payee_payment_status')?.value;
    if (status === 'completed' && !this.isFileUploaded) {
      this.statusError = true;
    }
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.paymentService
        .uploadEvidence(this.paymentId, file)
        .subscribe((response) => {
          this.isFileUploaded = true;
          this.paymentService.updateFileUploadedStatus(true);
          this.onStatusChange();
          this.evidence_id = response.evidence_id;
        });
    }
  }

  updatePayment(): void {
    if (this.paymentForm.valid) {
      if (this.isFileUploaded) {
        this.paymentForm.patchValue({
          evidence_id: this.evidence_id,
        });
      }
      this.paymentService
        .updatePayment(this.paymentId, this.paymentForm.value)
        .subscribe(() => {
          this.router.navigate(['/']);
        });
    }
  }
}
