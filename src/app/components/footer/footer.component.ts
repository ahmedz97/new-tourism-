import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SocialComponent } from '../social/social.component';
import { DataService } from '../../core/services/data.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    SocialComponent,
    TranslateModule,
    CommonModule,
    FormsModule,
    CarouselModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit {
  constructor(private _DataService: DataService) {}

  phoneNumber: any;
  userEmail: any;
  userAddress: any;
  userLocation: any;
  projectTitle: any;
  currentYear: number = new Date().getFullYear();

  // Gallery
  galleryImages: string[] = [];
  allGalleryImages: string[] = [];
  showGalleryModal: boolean = false;
  currentImageIndex: number = 0;
  newsletterEmail: string = '';

  // Gallery Slider Options
  gallerySliderOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    navText: [
      '<i class="fa fa-angle-left"></i>',
      '<i class="fa fa-angle-right"></i>',
    ],
    items: 1,
    autoplay: false,
    smartSpeed: 1000,
    startPosition: 0,
  };

  ngOnInit(): void {
    this.getSettings();
    this.getGalleryImages();
  }

  getSettings(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        console.log(res.data);

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

        const title = res.data.find(
          (item: any) => item.option_key === 'site_title'
        );
        this.projectTitle = title?.option_value[0];
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  getGalleryImages(): void {
    // Get all tours and collect gallery images
    this._DataService.getTours({ page_limit: 100 }).subscribe({
      next: (res) => {
        const tours = res?.data?.data || res?.data || [];
        const allImages: string[] = [];

        tours.forEach((tour: any) => {
          if (tour.gallery && Array.isArray(tour.gallery)) {
            tour.gallery.forEach((image: string) => {
              if (image && !allImages.includes(image)) {
                allImages.push(image);
              }
            });
          }
          // Also include featured image if available
          if (tour.featured_image && !allImages.includes(tour.featured_image)) {
            allImages.push(tour.featured_image);
          }
        });

        this.allGalleryImages = allImages;
        this.galleryImages = allImages;
      },
      error: (err) => {
        console.log('Error loading gallery images:', err);
      },
    });
  }

  openGallery(index: number): void {
    this.currentImageIndex = index;
    // Update start position for the slider
    this.gallerySliderOptions = {
      ...this.gallerySliderOptions,
      startPosition: index,
    };
    this.showGalleryModal = true;
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    document.body.classList.add('gallery-open'); // Add class to hide navbar
  }

  closeGallery(): void {
    this.showGalleryModal = false;
    document.body.style.overflow = ''; // Restore scrolling
    document.body.classList.remove('gallery-open'); // Remove class to show navbar
  }

  subscribeNewsletter(): void {
    if (this.newsletterEmail) {
      // TODO: Implement newsletter subscription API call
      console.log('Newsletter subscription:', this.newsletterEmail);
      // You can add API call here when backend is ready
      // this._DataService.subscribeNewsletter(this.newsletterEmail).subscribe(...)
      alert('Thank you for subscribing!');
      this.newsletterEmail = '';
    }
  }
}
