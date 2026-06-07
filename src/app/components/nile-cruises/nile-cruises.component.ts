import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BannerComponent } from "../banner/banner.component";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { DataService } from '../../core/services/data.service';
import { TourCartComponent } from "../tour-cart/tour-cart.component";
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-nile-cruises',
  standalone: true,
  imports: [BannerComponent, CommonModule, TranslateModule, CarouselModule, TourCartComponent],
  templateUrl: './nile-cruises.component.html',
  styleUrl: './nile-cruises.component.scss'
})
export class NileCruisesComponent implements OnInit {
  bannerTitle: string = 'Nile Cruises';
  allTours: any[] = [];
  currentItems: number = 1;

  constructor(
    private _DataService: DataService,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.seoService.applySettingsSeo({
      title: 'Alfa Omega Tours - Nile Cruises',
      description:
        'Discover luxury Nile cruises with Alfa Omega Tours. Sail between Luxor and Aswan on unforgettable Egypt river journeys.',
    });

    this._DataService.getTours({ category_slug: 'nile-cruises' }).subscribe({
      next: (res: any) => {
        console.log('res', res);
        this.allTours = res.data.data;
      },
      error: (err) => {
        console.error('Error fetching tours:', err);
      },
    });

    if (isPlatformBrowser(this.platformId)) {
      this.updateCurrentItems();
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateCurrentItems();
    }
  }

  updateCurrentItems(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const width = window.innerWidth;
    if (width >= 1200) {
      this.currentItems = 4;
    } else if (width >= 992) {
      this.currentItems = 3.5;
    } else if (width >= 767) {
      this.currentItems = 3;
    } else if (width >= 586) {
      this.currentItems = 2.5;
    } else {
      this.currentItems = 1;
    }
  }

  get shouldUseGrid(): boolean {
    return this.allTours.length < Math.ceil(this.currentItems);
  }

  tourOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    autoplay: true,
    dots: true,
    smartSpeed: 2500,
    margin: 5,
    responsive: {
      0: { items: 1 },
      586: { items: 2.5 },
      767: { items: 3 },
      992: { items: 3.5 },
      1200: { items: 4 },
    },
    nav: false,
  };
}
