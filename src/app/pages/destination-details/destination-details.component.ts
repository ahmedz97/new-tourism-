import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';
import { SocialComponent } from '../../components/social/social.component';
import { TourCartComponent } from '../../components/tour-cart/tour-cart.component';
import { FaqContentComponent } from '../../components/faq-content/faq-content.component';
import { PartnerSliderComponent } from '../../components/partner-slider/partner-slider.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-destination-details',
  standalone: true,
  imports: [
    RouterLink,
    CarouselModule,
    CommonModule,
    SocialComponent,
    TourCartComponent,
    FaqContentComponent,
    PartnerSliderComponent,
    BannerComponent,
    MakeTripFormComponent,
  ],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.scss',
})
export class DestinationDetailsComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private seoService: SeoService
  ) {}

  getSanitizedHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }

  destinationDetails: any = {};
  destinationSlug: any = '';
  AllDestination: any[] = [];
  tours: any[] = [];
  filteredTours: any[] = [];

  layoutType: 'grid' | 'list' = 'grid';
  bannerTitle: string = '';

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe({
      next: (param) => {
        this.destinationSlug = param.get('slug');
        // console.log('Destination Slug:', this.destinationSlug);

        this._DataService.getDestinationBySlug(this.destinationSlug).subscribe({
          next: (response) => {
            this.destinationDetails = response.data;
            // console.log(this.destinationSlug);

            this.bannerTitle = this.destinationDetails.title;
            // Update SEO
            this.updateDestinationSEO(response.data);
            // console.log(
            //   'destination Details title:',
            //   this.destinationDetails.title
            // );
            // console.log('destination Details:', this.destinationDetails);
          },
          error: (err) => {
            console.error('Error fetching destination details:', err);
          },
        });

        const queryParams: any = {
          destination_slug: this.destinationSlug,
        };

        this.showTours(queryParams);
      },
    });
    this.getDestinations();
  }

  getDestinations() {
    this._DataService.getDestination().subscribe({
      next: (res) => {
        // console.log(res.data.data);
        this.AllDestination = res.data.data;
      },
    });
  }

  // to display tours which related this destination
  showTours(queryParams: any): void {
    this._DataService.getTours(queryParams).subscribe({
      next: (response) => {
        console.log('queryParams', queryParams);
        console.log('response', response.data.data);

        this.tours = response.data.data;
        // console.log('Tours Data:', this.tours, this.tours.length);
        // for (let i = 0; i < this.tours.length; i++) {
        //   const tour = this.tours[i];
        //   const tourDestinationSlugs = (tour.destinations ?? []).map((x: any) =>
        //     x?.slug != null ? String(x.slug).toLowerCase().trim() : ''
        //   );

        //   // check if any destination matches the slug
        //   if (tourDestinationSlugs.includes(desSlug.toLowerCase())) {
        //     this.filteredTours.push(tour);
        //   }
        //   // console.log(tourDestinationSlugs, this.filteredTours, desSlug);
        // }
      },
      error: (err) => {
        console.error('Error fetching tours:', err);
      },
    });
  }

  updateDestinationSEO(destination: any): void {
    // Extract SEO data from API if available
    const seoData: any = {};
    if (destination.seo) {
      if (destination.seo.meta_title)
        seoData.meta_title = destination.seo.meta_title;
      if (destination.seo.meta_description)
        seoData.meta_description = destination.seo.meta_description;
      if (destination.seo.meta_keywords)
        seoData.meta_keywords = destination.seo.meta_keywords;
      if (destination.seo.og_title) seoData.og_title = destination.seo.og_title;
      if (destination.seo.og_description)
        seoData.og_description = destination.seo.og_description;
      if (destination.seo.og_image) seoData.og_image = destination.seo.og_image;
      if (destination.seo.og_type) seoData.og_type = destination.seo.og_type;
      if (destination.seo.twitter_title)
        seoData.twitter_title = destination.seo.twitter_title;
      if (destination.seo.twitter_description)
        seoData.twitter_description = destination.seo.twitter_description;
      if (destination.seo.twitter_card)
        seoData.twitter_card = destination.seo.twitter_card;
      if (destination.seo.twitter_image)
        seoData.twitter_image = destination.seo.twitter_image;
      if (destination.seo.canonical)
        seoData.canonical = destination.seo.canonical;
      if (destination.seo.robots) seoData.robots = destination.seo.robots;
      if (destination.seo.structure_schema)
        seoData.structure_schema = destination.seo.structure_schema;
    }

    const destImage =
      destination.seo?.og_image ||
      destination.image ||
      '/assets/image/alfa omega logo.webp';
    const destDescription =
      destination.seo?.meta_description ||
      destination.seo?.og_description ||
      destination.description ||
      destination.short_description ||
      `Explore ${destination.title} with Alfa Omega Tours. Discover amazing tours and experiences.`;

    const fallbackTitle =
      destination.seo?.meta_title ||
      destination.seo?.og_title ||
      `Alfa Omega Tours - ${destination.title}`;

    this.seoService.updateSeoData(
      seoData,
      fallbackTitle,
      destDescription.substring(0, 160),
      destImage
    );
  }

  galleryOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    smartSpeed: 1500,
    margin: 20,
    responsive: {
      0: { items: 1 },
      400: { items: 2 },
      740: { items: 3 },
      940: { items: 4 },
    },
    nav: false,
  };
}
