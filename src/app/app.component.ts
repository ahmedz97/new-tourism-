import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from './core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavComponent,
    FooterComponent,
    NgxSpinnerComponent,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'tricia';
  phoneNumber: string = '';

  constructor(
    public translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private _DataService: DataService
  ) {
    // Set default language
    translate.setDefaultLang('en');

    if (isPlatformBrowser(this.platformId)) {
      const langCode = localStorage.getItem('language') || 'en';
      translate.use(langCode);
    }
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const langCode = localStorage.getItem('language') || 'en';

      // Apply lang and dir to <html>
      const htmlTag = document.documentElement;
      htmlTag.setAttribute('lang', langCode);
      htmlTag.setAttribute('dir', 'ltr'); // Both English and Spanish are LTR

      // Listen for language changes
      this.translate.onLangChange.subscribe((event) => {
        const currentLang = event.lang;
        htmlTag.setAttribute('lang', currentLang);
        htmlTag.setAttribute('dir', 'ltr'); // Both English and Spanish are LTR
      });
    }

    // Get settings to fetch phone number
    this.getSettings();
  }

  getSettings(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        const contactPhone = res.data.find(
          (item: any) => item.option_key === 'CONTACT_PHONE_NUMBER'
        );
        this.phoneNumber = contactPhone?.option_value[0] || '';
      },
      error: (err) => {
        console.error('Error fetching settings:', err);
      },
    });
  }

  getWhatsAppUrl(): string {
    if (!this.phoneNumber) return '#';
    // Remove any non-digit characters except + for international format
    const cleanPhone = this.phoneNumber.replace(/[^\d+]/g, '');
    // If phone doesn't start with +, assume it needs country code
    const phone = cleanPhone.startsWith('+') ? cleanPhone : `+${cleanPhone}`;
    return `https://wa.me/${phone}`;
  }
}
