import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookingService } from '../../core/services/booking.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-paypal',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './payment-paypal.component.html',
  styleUrl: './payment-paypal.component.scss',
})
export class PaymentPaypalComponent implements OnInit {
  paymentToken: string = '';
  callbackStatus: 'success' | 'failure' | '' = '';
  isLoading: boolean = false;
  paymentResponse: any = null;

  constructor(
    private route: ActivatedRoute,
    private bookingService: BookingService,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.resolveCallbackStatus();
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token')?.trim() || '';
      if (!token) {
        return;
      }

      this.paymentToken = token;
      this.capturePayment(this.paymentToken);
    });
  }

  private resolveCallbackStatus(): void {
    // success or failure
    const routePath = this.route.snapshot.routeConfig?.path || '';
    console.log('routePath', routePath);
    if (routePath.endsWith('/success')) {
      this.callbackStatus = 'success';
      return;
    }
    if (routePath.endsWith('/failure')) {
      this.callbackStatus = 'failure';
    }
  }

  private capturePayment(token: string): void {
    if (!token) {
      return;
    }

    this.isLoading = true;
    this.bookingService.getPayment(token).subscribe({
      next: (response) => {
        this.paymentResponse = response;
        this.isLoading = false;
        this.callbackStatus = 'success';
        this.toaster.clear();
        this.toaster.success(response?.message || 'Payment processed');
      },
      error: (err) => {
        this.paymentResponse = err?.error;
        this.isLoading = false;
        this.toaster.clear();
        this.callbackStatus = 'failure';
        this.toaster.error(
          err?.error?.message || 'Payment processing failed. Please try again.'
        );
      },
    });
  }
}
