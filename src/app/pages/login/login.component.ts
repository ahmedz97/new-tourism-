import { HttpClient } from '@angular/common/http';
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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, CommonModule, BannerComponent, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
export class LoginComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    private _AuthService: AuthService,
    private toastr: ToastrService,
    private _Router: Router
  ) {}

  bannerTitle = 'login';
  logo!: any;
  siteTitle!: any;
  isLoading = false;
  countryList: any[] = [];

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.getSettings();
    this.getCountries();
  }

  getSettings(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        console.log(res.data);

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
        console.log(response.data);
        this.countryList = response.data;
      },
    });
  }

  handleLoginForm(): void {
    if (this.loginForm.valid) {
      // console.log(this.loginForm.value);
      this.isLoading = true;
      this._AuthService.setlogin(this.loginForm.value).subscribe({
        next: (response) => {
          if (response.status === true) {
            console.log(response);

            this._AuthService.saveToken(response.data.accessToken);
            this.toastr.success(response.message);
            this._Router.navigate(['']);
          } else {
            this.toastr.error('Login failed');
          }
        },
        error: (err) => {
          this.toastr.error(err?.error?.message ?? 'Login error');
        },
      });
    }
  }

  handleForgetPass(email: any): void {
    console.log(email);
    this._AuthService.setForgetPass(email).subscribe({
      next: (res) => {
        console.log(res);
        this.toastr.success(res.message);
      },
    });
  }
}
