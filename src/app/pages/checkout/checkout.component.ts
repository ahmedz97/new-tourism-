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
    this.seoService.updateSeoData(
      {},
      'Alfa Omega Tours - Checkout',
      'Complete your booking with Alfa Omega Tours. Secure checkout for your travel reservations.',
      '../../../assets/image/alfa omega versions/Artboard 1 copy 3@4x.png'
    );
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

  // must start with 0 and must be 10 digits
  phonePattern = '^01[0-2][0-9]{8}$';

  // used to show validation border after submit click
  submitted = false;

  // used for input maxlength (phone digits only)
  phoneMaxLength = 15;
  phoneMinLength = 7;

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
      Validators.maxLength(this.phoneMaxLength),
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

    const selectedCountryName = this.checkoutForm.get('country')?.value;
    const selectedCountry =
      this.countries?.find((c: any) => c?.name === selectedCountryName) ?? null;

    // Base rules: digits only + length bounds
    let nextMin = 7;
    let nextMax = 15;
    const validators = [Validators.required, Validators.pattern(/^[0-9]+$/)];

    if (selectedCountry) {
      // If API includes phone regex, use it.
      const phoneRegexStr =
        selectedCountry.phone_regex ??
        selectedCountry.phoneRegex ??
        selectedCountry.phone_pattern ??
        selectedCountry.phonePattern;

      if (typeof phoneRegexStr === 'string' && phoneRegexStr.trim() !== '') {
        try {
          validators.push(Validators.pattern(new RegExp(phoneRegexStr)));
        } catch {
          // ignore invalid regex from backend
        }
      }

      // Common length fields (fallback to generic bounds if not provided)
      const minLen =
        selectedCountry.phone_min_length ??
        selectedCountry.phoneMinLength ??
        selectedCountry.phone_min_length_digits ??
        selectedCountry.phoneMinLen;
      const maxLen =
        selectedCountry.phone_length ??
        selectedCountry.phoneMaxLength ??
        selectedCountry.phone_max_length ??
        selectedCountry.phoneMaxLen;

      const minNum = minLen != null ? Number(minLen) : NaN;
      const maxNum = maxLen != null ? Number(maxLen) : NaN;
      if (!Number.isNaN(minNum) && minNum > 0) nextMin = minNum;
      if (!Number.isNaN(maxNum) && maxNum > 0) nextMax = maxNum;

      // Egypt special-case: if calling code indicates +20 use your local Egypt rule.
      const callingCodeRaw =
        selectedCountry.calling_code ??
        selectedCountry.callingCode ??
        selectedCountry.dial_code ??
        selectedCountry.dialCode ??
        selectedCountry.phone_code ??
        selectedCountry.phoneCode;
      const callingCode = String(callingCodeRaw ?? '').replace('+', '');

      if (callingCode.includes('20')) {
        nextMin = 10;
        nextMax = 10;
        validators.push(Validators.pattern(this.phonePattern));
      }
    }

    this.phoneMinLength = nextMin;
    this.phoneMaxLength = nextMax;

    validators.push(Validators.minLength(this.phoneMinLength));
    validators.push(Validators.maxLength(this.phoneMaxLength));

    phoneCtrl.setValidators(validators);
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
    const limited = digitsOnly.slice(0, this.phoneMaxLength);

    // keep UI value in sync with the sanitized value
    if (input.value !== limited) input.value = limited;

    const currentValue = phoneCtrl.value ?? '';
    if (String(currentValue) !== limited) {
      phoneCtrl.setValue(limited);
    }
  }

  getCheckoutData(): void {
    this.submitted = true;
    this.checkoutForm.markAllAsTouched();

    if (this.checkoutForm.invalid) return;

    this.checkoutData = this.checkoutForm.value;
    // if form is valid === true
    if (this.checkoutForm.valid) {
      this._BookingService.sendCheckoutData(this.checkoutData).subscribe({
        next: (response) => {
          if (response.status === true) {
            console.log(response);
            this.toaster.success(response.message);
            this.getListCart();
            this.checkoutForm.reset();
            this.toaster.success(response.data.payment.message);

            window.open(response.data.payment.redirect.location, '_self');
          }
          // this._Router.navigate(['/']);
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
