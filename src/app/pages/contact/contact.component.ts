import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';
import { PartnerSliderComponent } from '../../components/partner-slider/partner-slider.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import {
  isControlInvalid,
  phoneInputHandler,
  phoneValidators,
  PHONE_MAX_LENGTH,
} from '../../core/utils/form.utils';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SafeUrlPipe,
    PartnerSliderComponent,
    BannerComponent,
    MakeTripFormComponent,
    TranslateModule,
  ],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export class ContactComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    private toaster: ToastrService,
    private seoService: SeoService,
    private translate: TranslateService
  ) {}

  bannerTitle: string = 'contact.bannerTitle';

  countryList: any[] = [];
  phoneNumber: any;
  userEmail: any;
  userAddress: any;
  userLocation: any;
  submitted = false;
  phoneMaxLength = PHONE_MAX_LENGTH;

  ngOnInit(): void {
    this.seoService.applyPageSeoByRoute('contact', {
      title: 'Alfa Omega Tours - Contact Us',
      description:
        'Get in touch with Alfa Omega Tours. Contact us for inquiries, bookings, and exceptional travel experiences in Egypt.',
    });
    this.getCountries();
    this.getSettings();
  }

  contactForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', phoneValidators(true)),
    country: new FormControl('', [Validators.required]),
    subject: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  isFieldInvalid(fieldName: string): boolean {
    return isControlInvalid(this.contactForm.get(fieldName), this.submitted);
  }

  onPhoneInput(event: Event): void {
    phoneInputHandler(event, this.contactForm.get('phone'));
  }

  getContactData(): void {
    this.submitted = true;
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      this.toaster.error(this.translate.instant('common.errors.fillRequiredFields'));
      return;
    }

    this._DataService.contactData(this.contactForm.value).subscribe({
      next: (response) => {
        this.toaster.success(response.message);
        this.contactForm.reset();
        this.submitted = false;
      },
      error: (err) => {
        this.toaster.error(
          err.error?.message || this.translate.instant('contact.errors.sendFailed')
        );
      },
    });
  }

  getCountries() {
    this._DataService.getCountries().subscribe({
      next: (response) => {
        // console.log(response.data);
        this.countryList = response.data;
      },
    });
  }

  getSettings(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        console.log('settings', res.data);

        const contactPhone = res.data.find(
          (item: any) => item.option_key === 'CONTACT_PHONE_NUMBER'
        );
        this.phoneNumber = contactPhone?.option_value[0];

        const contactEmail = res.data.find(
          (item: any) => item.option_key === 'email_address'
        );
        this.userEmail = contactEmail?.option_value[0];

        const contactaddress = res.data.find(
          (item: any) => item.option_key === 'address'
        );
        this.userAddress = contactaddress?.option_value[0];

        const contactMap = res.data.find(
          (item: any) => item.option_key === 'company_location_url'
        );
        this.userLocation = contactMap?.option_value[0];

        this.userLocation = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13813.902075600254!2d31.337823000000004!3d30.051901299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f1430a6bd61%3A0x99ea32135b3d106a!2sAlfaomega%20Tours!5e0!3m2!1sen!2seg!4v1770291801435!5m2!1sen!2seg`;
        console.log('userLocation', this.userLocation);
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }
}

// iframe map
/*
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13813.902075600254!2d31.337823000000004!3d30.051901299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583f1430a6bd61%3A0x99ea32135b3d106a!2sAlfaomega%20Tours!5e0!3m2!1sen!2seg!4v1770291801435!5m2!1sen!2seg" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
*/
