import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { TranslateModule } from '@ngx-translate/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { SeoService } from '../../core/services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import {
  phoneInputHandler,
  phoneValidators,
  PHONE_MAX_LENGTH,
} from '../../core/utils/form.utils';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, BannerComponent, TranslateModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('600ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('500ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class SignupComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    private _AuthService: AuthService,
    private toastr: ToastrService,
    private _Router: Router,
    private seoService: SeoService,
    private translate: TranslateService
  ) {}

  bannerTitle = 'signup.bannerTitle';
  logo!: any;
  siteTitle!: any;
  isLoading = false;
  countryList: any[] = [];

  phoneMaxLength = PHONE_MAX_LENGTH;
  submitted = false;

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    password_confirmation: new FormControl('', [Validators.required]),
    phone: new FormControl('', phoneValidators(true)),
    birthdate: new FormControl('', [Validators.required]),
    nationality: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.seoService.applySettingsSeo({
      title: 'Alfa Omega Tours - Sign Up',
      description:
        'Create your Alfa Omega Tours account to access exclusive travel deals, manage bookings, and enjoy premium travel experiences.',
    });
    this.getSettings();
    this.getCountries();
  }
  getSettings(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        // console.log(res.data);

        const contactLogo = res.data.find(
          (item: any) => item.option_key === 'logo'
        );
        this.logo = contactLogo?.option_value[0];

        const title = res.data.find(
          (item: any) => item.option_key === 'site_title'
        );
        this.siteTitle = title?.option_value[0];

        // console.log(this.logo);
      },
      error: (err) => {
        // console.log(err);
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

  onPhoneInput(event: Event): void {
    phoneInputHandler(event, this.registerForm.get('phone'));
  }

  handleRegisterForm(): void {
    this.submitted = true;
    this.registerForm.markAllAsTouched();

    if (this.registerForm.valid) {
      this.isLoading = true;
      this._AuthService.setRegister(this.registerForm.value).subscribe({
        next: (response) => {
          if (response.status == true) {
            this.isLoading = false;
            this.toastr.success(response.message);
            this._Router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          this.toastr.error(err.error?.message || this.translate.instant('signup.errors.registrationFailed'));
        },
      });
    } else {
      this.toastr.error(this.translate.instant('common.errors.fillRequiredFields'));
    }
  }
}
