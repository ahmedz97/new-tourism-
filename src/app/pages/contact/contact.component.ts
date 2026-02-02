import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { SafeUrlPipe } from '../../core/pipes/safe-url.pipe';
import { PartnerSliderComponent } from '../../components/partner-slider/partner-slider.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';

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
    private seoService: SeoService
  ) {}

  bannerTitle: string = 'contact';

  countryList: any[] = [];
  phoneNumber: any;
  userEmail: any;
  userAddress: any;
  userLocation: any;

  ngOnInit(): void {
    this.seoService.updateSeoData(
      {},
      'Alfa Omega Tours - Contact us',
      'Get in touch with Alfa Omega Tours. Contact us for inquiries, bookings, and exceptional travel experiences.',
      '../../../assets/image/alfa omega versions/Artboard 1 copy 3@4x.png'
    );
    this.getCountries();
    this.getSettings();
  }

  contactForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    phone: new FormControl(''),
    country: new FormControl(''),
    subject: new FormControl(''),
    message: new FormControl(''),
  });

  getContactData(): void {
    // console.log(this.contactForm.value);

    this._DataService.contactData(this.contactForm.value).subscribe({
      next: (response) => {
        // console.log(response);
        this.toaster.success(response.message);
      },
      error: (err) => {
        // console.log(err.error);
        this.toaster.error(err.error.message);
      },
    });
    this.contactForm.reset();
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

        this.userLocation = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.012336661107!2d31.243393299999997!3d29.979056999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584797634120ef%3A0x1fd4ccc0df806304!2s38%20Mahfouz%20Abd%20El-Aaty%2C%20Al%20Isaweyah%2C%20Dar%20El%20Salam%2C%20Cairo%20Governorate%204221331!5e1!3m2!1sen!2seg!4v1770035252740!5m2!1sen!2seg`;
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
<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.012336661107!2d31.
243393299999997!3d29.979056999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.
1!3m3!1m2!1s0x14584797634120ef%3A0x1fd4ccc0df806304!2s38%20Mahfouz%20Abd%20El-
Aaty%2C%20Al%20Isaweyah%2C%20Dar%20El%20Salam%2C%20Cairo%20Governorate%204221331!5e1!3m2!1sen!2seg!4v1770035252740!5m2!1sen!2seg"
  width="600" height="450"
  style="border:0;" allowfullscreen=""
  loading="lazy" referrerpolicy="no-referrer-when-downgrade">
</iframe>
*/
