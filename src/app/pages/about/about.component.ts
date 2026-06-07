import { Component, OnInit } from '@angular/core';
import { AboutsectionComponent } from '../../components/aboutsection/aboutsection.component';
import { TeamCartComponent } from '../../components/team-cart/team-cart.component';
import { TestimonialCartComponent } from '../../components/testimonial-cart/testimonial-cart.component';
import { PartnerSliderComponent } from '../../components/partner-slider/partner-slider.component';
import { CommonModule } from '@angular/common';
import { BannerComponent } from '../../components/banner/banner.component';
import { WhyBookingWithUsComponent } from '../../components/why-booking-with-us/why-booking-with-us.component';
import { AboutCategoryComponent } from '../../components/about-category/about-category.component';
import { CounterComponent } from '../../components/counter/counter.component';
import { BooknowComponent } from '../../components/booknow/booknow.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    BannerComponent,
    AboutsectionComponent,
    TeamCartComponent,
    TestimonialCartComponent,
    PartnerSliderComponent,
    CommonModule,
    WhyBookingWithUsComponent,
    AboutCategoryComponent,
    MakeTripFormComponent,
    TranslateModule,
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  constructor(private seoService: SeoService) {}
  bannerTitle = 'about us';

  ngOnInit(): void {
    this.seoService.applyPageSeoByRoute('about', {
      title: 'Alfa Omega Tours - About Us',
      description:
        'Learn more about Alfa Omega Tours, your trusted travel partner for premium Egypt tours and exceptional travel experiences.',
    });
  }
}
