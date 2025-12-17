import { Component, OnInit } from '@angular/core';
import { FaqContentComponent } from '../../components/faq-content/faq-content.component';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [
    FaqContentComponent,
    CommonModule,
    BannerComponent,
    MakeTripFormComponent,
  ],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent implements OnInit {
  bannerTitle: string = 'FAQ';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateSeoData(
      {},
      'Alfa Omega Tours - FAQ',
      'Find answers to frequently asked questions about Alfa Omega Tours. Get information about bookings, tours, and travel services.',
      '/assets/images/alfa omega logo.webp'
    );
  }
}
