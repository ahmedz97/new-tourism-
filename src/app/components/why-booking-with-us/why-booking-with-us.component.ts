import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-why-booking-with-us',
  standalone: true,
  imports: [TranslateModule, CarouselModule],
  templateUrl: './why-booking-with-us.component.html',
  styleUrl: './why-booking-with-us.component.scss',
})
export class WhyBookingWithUsComponent {
  bookingItems = [
    {
      icon: 'fa-chess',
      title: 'whyBooking.trustedOperatorTitle',
      titleIsTranslation: true,
      description: 'whyBooking.trustedOperatorDescription',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-sliders',
      title: 'whyBooking.customizedPackagesTitle',
      titleIsTranslation: true,
      description: 'whyBooking.customizedPackagesDescription',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-user-tie',
      title: 'whyBooking.professionalGuidesTitle',
      titleIsTranslation: true,
      description: 'whyBooking.professionalGuidesDescription',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-couch',
      title: 'whyBooking.comfortableArrangementsTitle',
      titleIsTranslation: true,
      description: 'whyBooking.comfortableArrangementsDescription',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-wallet',
      title: 'whyBooking.affordablePackagesTitle',
      titleIsTranslation: true,
      description: 'whyBooking.affordablePackagesDescription',
      descriptionIsTranslation: true,
    },
    {
      icon: 'fa-life-ring',
      title: 'whyBooking.excellentSupportTitle',
      titleIsTranslation: true,
      description: 'whyBooking.excellentSupportDescription',
      descriptionIsTranslation: true,
    },
  ];

  bookingOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: false,
    nav: false,
    smartSpeed: 2500,
    margin: 20,
    responsive: {
      0: { items: 1 },
      400: { items: 1.5 },
      576: { items: 2 },
      768: { items: 2.5 },
      992: { items: 3 },
      1200: { items: 3.5 },
    },
    center: true,
  };
}
