import { Component, OnInit, HostListener, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { BannerComponent } from "../banner/banner.component";
import { TourCartComponent } from "../tour-cart/tour-cart.component";
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-tour-packages',
  standalone: true,
  imports: [BannerComponent, TourCartComponent, CarouselModule , CommonModule, TranslateModule],
  templateUrl: './tour-packages.component.html',
  styleUrl: './tour-packages.component.scss'
})
export class TourPackagesComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  bannerTitle: string = 'Tour Packages';
  allTours: any[] = [];
  currentItems: number = 1;

  ngOnInit(): void {
    this._DataService.getTours({ category_slug: 'packages' }).subscribe({
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
