import { Routes } from '@angular/router';
import { AddPaymentComponent } from './components/add-payment/add-payment.component';
import { EditPaymentComponent } from './components/edit-payment/edit-payment.component';
import { AppComponent } from './app.component';
import { ViewPaymentComponent } from './components/view-payment/view-payment.component';

export const routes: Routes = [
  { path: '', component: ViewPaymentComponent },
  { path: 'add-payment', component: AddPaymentComponent },
  { path: 'edit-payment/:id', component: EditPaymentComponent },
];
