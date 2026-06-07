import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../core/services/booking.service';
import { ToastrService } from 'ngx-toastr';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { BannerComponent } from '../../components/banner/banner.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatRadioModule,
    ReactiveFormsModule,
    CarouselModule,
    BannerComponent,
    TranslateModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
})
export class CheckoutComponent implements OnInit {
  constructor(
    private _BookingService: BookingService,
    private toaster: ToastrService,
    private _Router: Router,
    private seoService: SeoService
  ) {}

  bannerTitle: string = 'checkout';

  checkoutData: object = {};
  countries: any[] = [];
  tourCart: any[] = [];
  haveData: boolean = false;
  couponApplied: boolean = false;
  couponDiscount: number = 0;
  couponData: any = null;

  ngOnInit(): void {
    this.seoService.applySettingsSeo({
      title: 'Alfa Omega Tours - Checkout',
      description:
        'Complete your booking with Alfa Omega Tours. Secure checkout for your travel reservations.',
    });
    this._BookingService.getCountries().subscribe({
      next: (response) => {
        // console.log(response.data);
        this.countries = response.data;
        this.applyPhoneValidationByCountry();
      },
    });

    // rebuild phone validators when country selection changes
    this.checkoutForm.get('country')?.valueChanges.subscribe(() => {
      this.applyPhoneValidationByCountry();
    });
    this.getListCart();
  }

  // used to show validation border after submit click
  submitted = false;

  // used for phone validation (digits only, open max length)
  phoneMinLength = 3;

  checkoutForm: FormGroup = new FormGroup({
    first_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    last_name: new FormControl('', [
      Validators.required,
      Validators.minLength(2),
    ]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(this.phoneMinLength),
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    country: new FormControl('', [Validators.required]),
    payment_method: new FormControl('', [Validators.required]),
    notes: new FormControl(''),
    currency_id: new FormControl(1),
    coupon_id: new FormControl(''),
  });

  private applyPhoneValidationByCountry(): void {
    const phoneCtrl = this.checkoutForm.get('phone');
    if (!phoneCtrl) return;

    // Global phone rules: numbers only, min length 3, no max length.
    this.phoneMinLength = 3;
    phoneCtrl.setValidators([
      Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(this.phoneMinLength),
    ]);
    phoneCtrl.updateValueAndValidity({ emitEvent: false });
  }

  isFieldInvalid(fieldName: string): boolean {
    const ctrl = this.checkoutForm.get(fieldName);
    if (!ctrl) return false;
    return ctrl.invalid && (ctrl.touched || ctrl.dirty || this.submitted);
  }

  onPhoneInput(event: Event): void {
    const phoneCtrl = this.checkoutForm.get('phone');
    if (!phoneCtrl) return;

    const input = event.target as HTMLInputElement;
    const digitsOnly = (input.value ?? '').replace(/\D/g, '');

    // keep UI value in sync with the sanitized value
    if (input.value !== digitsOnly) input.value = digitsOnly;

    const currentValue = phoneCtrl.value ?? '';
    if (String(currentValue) !== digitsOnly) {
      phoneCtrl.setValue(digitsOnly);
    }
  }

  getCheckoutData(): void {
    this.submitted = true;
    this.checkoutForm.markAllAsTouched();

    // console.log(this.checkoutForm);
    if (this.checkoutForm.invalid) return;

    this.checkoutData = this.checkoutForm.value;
    console.log('checkoutData', this.checkoutData);
    // if form is valid === true
    if (this.checkoutForm.valid) {
      this._BookingService.sendCheckoutData(this.checkoutData).subscribe({
        next: (response) => {
          if (response.status === true) {
            // console.log(response);
            this.toaster.success(response.message);
            this.getListCart();
            
            this.toaster.success(response.data.payment.message);

            // console.log(this.checkoutData);
            // console.log(this.checkoutData.['payment_method']);
            
            // if payment method is cash
            if (this.checkoutForm.get('payment_method')?.value === 'cash') {
              this._Router.navigate(['/']);
            }
            
            // if payment method is paypal
            if (this.checkoutForm.get('payment_method')?.value === 'paypal') {
              window.open(response.data.payment.redirect.location, '_self');
              console.log(response.data.payment.redirect.location);
            }

            this.checkoutForm.reset();
          }
        },
        error: (err) => {
          // console.log(err);
          this.toaster.error(err.error.message);
        },
      });
    }

    // this.checkoutForm.reset();
  }

  getListCart(): void {
    this._BookingService.getCartList().subscribe({
      next: (response) => {
        this.tourCart = response.data;
        if (this.tourCart.length === 0) {
          this.haveData = false;
          // console.log(this.tourCart);
        } else {
          this.haveData = true;
          // console.log(this.tourCart);

          this.tourCart.forEach((item) => {
            let adultPrice = 0;
            let childPrice = 0;
            let infantPrice = 0;

            if (item.tour?.pricing_groups?.length > 0) {
              const matchedGroup = item.tour.pricing_groups.find(
                (group: { from: number; to: number }) =>
                  item.adults >= group.from && item.adults <= group.to
              );

              if (matchedGroup) {
                adultPrice = matchedGroup.price;
                childPrice = matchedGroup.child_price;
              } else {
                adultPrice = item.tour.adult_price;
                childPrice = item.tour.child_price;
                infantPrice = item.tour.infant_price;
              }
            } else {
              adultPrice = item.tour.adult_price;
              childPrice = item.tour.child_price;
              infantPrice = item.tour.infant_price;
            }

            item.adultPrice = adultPrice;
            item.childPrice = childPrice;
            item.infantPrice = infantPrice;
            item.totalPrice =
              item.adults * item.adultPrice +
              item.children * item.childPrice +
              item.infants * item.infantPrice;
          });
        }
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  getTotalPrice(): number {
    return this.tourCart.reduce((sum, cart) => sum + cart.totalPrice, 0);
  }

  applyCoupon(): void {
    const couponCode = this.checkoutForm.get('coupon_id')?.value;

    if (!couponCode || couponCode.trim() === '') {
      this.toaster.error('Please enter a coupon code');
      return;
    }

    this._BookingService.getCoupon(couponCode).subscribe({
      next: (cResponse) => {
        // console.log(cResponse);
        this.couponApplied = true;
        this.couponData = cResponse.data;

        // Calculate discount based on coupon type (percentage or fixed amount)
        const totalPrice = this.getTotalPrice();
        if (this.couponData.type === 'percentage') {
          this.couponDiscount = (totalPrice * this.couponData.value) / 100;
        } else {
          this.couponDiscount = this.couponData.value;
        }

        this.toaster.success(
          cResponse.message || 'Coupon applied successfully!'
        );
      },
      error: (cError) => {
        // console.log(cError);
        this.couponApplied = false;
        this.couponDiscount = 0;
        this.couponData = null;
        this.toaster.error(cError.error.message || 'Invalid coupon code');
      },
    });

    this.checkoutForm.get('coupon_id')?.reset();
  }

  getTotalPriceAfterCouponCode(): number {
    const totalPrice = this.getTotalPrice();

    if (this.couponApplied && this.couponDiscount > 0) {
      const finalPrice = totalPrice - this.couponDiscount;
      return finalPrice > 0 ? finalPrice : 0;
    }

    return totalPrice;
  }

  ordersOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    margin: 20,
    items: 1,
    nav: false,
    smartSpeed: 1500,
  };


}
