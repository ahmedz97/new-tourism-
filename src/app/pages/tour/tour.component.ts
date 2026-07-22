import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSliderModule } from '@angular/material/slider';
import { MatExpansionModule } from '@angular/material/expansion';
import { DataService } from '../../core/services/data.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { TourCartComponent } from '../../components/tour-cart/tour-cart.component';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { BannerComponent } from '../../components/banner/banner.component';
import { MakeTripFormComponent } from '../../components/make-trip-form/make-trip-form.component';
import { TranslateModule } from '@ngx-translate/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-tour',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatSliderModule,
    MatExpansionModule,
    NgxPaginationModule,
    TourCartComponent,
    PaginationComponent,
    BannerComponent,
    MakeTripFormComponent,
    TranslateModule,
  ],
  templateUrl: './tour.component.html',
  styleUrl: './tour.component.scss',
})
export class TourComponent implements OnInit {
  constructor(
    private _DataService: DataService,
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private seoService: SeoService
  ) {}

  bannerTitle: string = 'tour.bannerTitle';

  // Pagination variables
  itemsPerPage: number = 15;
  currentPage: number = 1;
  totalItems: number = 0;
  allToursCount: number = 0;

  // Layout
  layoutType: 'grid' | 'list' = 'grid';

  // Filter variables - IDs (for internal use)
  selectedDestination: number | null = null;
  selectedTripType: number | null = null;
  selectedDuration: number | null = null;

  // Filter variables - Slugs (for URL and API)
  selectedDestinationSlug: string | null = '';
  selectedCategorySlug: string | null = '';
  selectedDurationSlug: string | null = '';

  // Price range
  minBudget = 0;
  maxBudget = 5000;

  // Data variables
  allCategories: any[] = [];
  allDestinations: any[] = [];
  allDurations: any[] = [];
  allTours: any[] = [];
  filteredTours: any[] = [];

  // UI variables - Accordion states
  isCategoryCollapsed: boolean = false; // Open by default
  isPriceCollapsed: boolean = true;
  isDurationCollapsed: boolean = true;
  isDestinationCollapsed: boolean = true;

  ngOnInit(): void {
    this.seoService.applySettingsSeo({
      title: 'Alfa Omega Tours - Tours',
      description:
        'Explore our wide range of premium Egypt tours and travel packages with Alfa Omega Tours. Find your perfect adventure today.',
    });

    // 2. Fetch base data
    // this.getAllTours();
    this.getDestination();
    this.getCategories();
    this.getDurations();

    // 3. Subscribe to queryParams to read filters from URL
    this._ActivatedRoute.queryParams.subscribe((param) => {
      console.log('params', param);

      // Read query params from URL and set component properties
      // Support both 'destination' and 'location' for backward compatibility
      const destinationSlug = param['destination'] || param['location'];
      if (destinationSlug) {
        this.selectedDestinationSlug = destinationSlug;
        // Resolve to ID if destinations are already loaded
        if (this.allDestinations.length > 0) {
          const destination = this.allDestinations.find(
            (dest) => dest.slug === this.selectedDestinationSlug
          );
          if (destination) {
            this.selectedDestination = destination.id;
          }
        }
      } else {
        this.selectedDestinationSlug = null;
        this.selectedDestination = null;
      }

      if (param['type']) {
        this.selectedCategorySlug = param['type'];
        // Resolve to ID if categories are already loaded
        if (this.allCategories.length > 0) {
          const category = this.allCategories.find(
            (cat) => cat.slug === this.selectedCategorySlug
          );
          if (category) {
            this.selectedTripType = category.id;
          }
        }
      } else {
        this.selectedCategorySlug = null;
        this.selectedTripType = null;
      }

      if (param['duration']) {
        this.selectedDurationSlug = param['duration'];
        // Resolve to ID if durations are already loaded
        if (this.allDurations.length > 0) {
          const duration = this.allDurations.find(
            (dur) => dur.slug === this.selectedDurationSlug
          );
          if (duration) {
            this.selectedDuration = duration.id;
          }
        }
      } else {
        this.selectedDurationSlug = null;
        this.selectedDuration = null;
      }

      // Read price range from query params if available
      if (param['minPrice']) {
        this.minBudget = Number(param['minPrice']) || 0;
      }
      if (param['maxPrice']) {
        this.maxBudget = Number(param['maxPrice']) || 5000;
      }

      // Fetch tours with filters - getAllTours will use the component properties
      this.getAllTours();
    });
  }

  // Fetch destinations
  getDestination() {
    this._DataService.getDestination().subscribe({
      next: (res) => {
        this.allDestinations = res.data.data;

        // If there's a slug from URL but destination wasn't loaded yet
        if (this.selectedDestinationSlug && this.selectedDestination === null) {
          const destination = this.allDestinations.find(
            (dest) => dest.slug === this.selectedDestinationSlug
          );
          if (destination) {
            this.selectedDestination = destination.id;
            this.getAllTours(); // Reload tours
          }
        }
      },
      error: (err) => {
        console.error('Error fetching destinations:', err);
      },
    });
  }

  // Fetch categories
  getCategories() {
    this._DataService.getCategories().subscribe({
      next: (res) => {
        this.allCategories = res.data.data;

        // Resolve slug to ID if it was set before categories loaded
        if (this.selectedCategorySlug && this.selectedTripType === null) {
          const category = this.allCategories.find(
            (cat) => cat.slug === this.selectedCategorySlug
          );
          if (category) {
            this.selectedTripType = category.id;
            this.getAllTours();
          }
        }
      },
      error: (err) => {
        console.error('Error fetching categories:', err);
      },
    });
  }

  // Fetch durations
  getDurations() {
    this._DataService.getToursDuration().subscribe({
      next: (res) => {
        this.allDurations = res.data;

        // Resolve slug to ID if it was set before durations loaded
        if (this.selectedDurationSlug && this.selectedDuration === null) {
          const duration = this.allDurations.find(
            (dur) => dur.slug === this.selectedDurationSlug
          );
          if (duration) {
            this.selectedDuration = duration.id;
            this.getAllTours();
          }
        }
      },
      error: (err) => {
        console.error('Error fetching durations:', err);
      },
    });
  }

  // Fetch tours with server-side filtering
  getAllTours(page: number = 1) {
    // Build query parameters with slugs
    const queryParams: any = {
      category_slug: this.selectedCategorySlug || '',
      destination_slug: this.selectedDestinationSlug || '',
      duration_slug: this.selectedDurationSlug || '',
    };

    // Call API
    this._DataService.getTours(queryParams, page).subscribe({
      next: (res) => {
        // Handle response
        if (res.data && res.data.data) {
          this.allTours = res.data.data;

          // Calculate totalItems from API response
          if (res.data.total !== undefined) {
            this.totalItems = Number(res.data.total);
          } else if (res.data.last_page && res.data.per_page) {
            // Calculate from last_page and per_page
            this.totalItems =
              Number(res.data.last_page) * Number(res.data.per_page);
          } else {
            // Fallback: if we have 15 items, there might be more
            this.totalItems =
              res.data.data.length >= 15
                ? res.data.data.length + 1
                : res.data.data.length;
          }

          this.allToursCount = this.totalItems;
        }

        // Process tours: add destinationsTitle
        this.allTours.forEach((tour) => {
          tour.destinationsTitle = tour.destinations
            ?.map((x: any) => x.title)
            .join(', ');
        });

        this.filteredTours = [...this.allTours];
        this.currentPage = page;
      },
      error: (err) => {
        console.error('Error fetching tours:', err);
        this.allTours = [];
        this.filteredTours = [];
        this.totalItems = 0;
      },
    });
  }

  // Handle radio button changes (Category, Duration, Destination)
  onRadioChange(
    key: 'selectedTripType' | 'selectedDuration' | 'selectedDestination',
    value: number | null
  ) {
    // 1. Update the value
    this[key] = value;

    // 2. Convert ID to Slug
    if (key === 'selectedTripType') {
      if (value !== null) {
        const category = this.allCategories.find((cat) => cat.id === value);
        this.selectedCategorySlug = category?.slug || null;
      } else {
        this.selectedCategorySlug = null;
      }
    } else if (key === 'selectedDuration') {
      if (value !== null) {
        const duration = this.allDurations.find((dur) => dur.id === value);
        this.selectedDurationSlug = duration?.slug || null;
      } else {
        this.selectedDurationSlug = null;
      }
    } else if (key === 'selectedDestination') {
      if (value !== null) {
        const destination = this.allDestinations.find(
          (dest) => dest.id === value
        );
        this.selectedDestinationSlug = destination?.slug || null;
      } else {
        this.selectedDestinationSlug = null;
      }
    }

    // 3. Reload tours
    this.getAllTours();

    // 4. Update URL
    this.updateURL();
  }

  // Update URL with query parameters
  updateURL() {
    const queryParams: any = {};

    // Add only selected filters
    if (this.selectedDestinationSlug) {
      queryParams['destination'] = this.selectedDestinationSlug;
    }

    if (this.selectedCategorySlug) {
      queryParams['type'] = this.selectedCategorySlug;
    }

    if (this.selectedDurationSlug) {
      queryParams['duration'] = this.selectedDurationSlug;
    }

    // Update URL
    this._Router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: queryParams,
      queryParamsHandling: '', // Replace all params
      replaceUrl: true, // Don't add to history
    });
  }

  // Handle pagination
  onPageChange(page: number): void {
    // Fetch tours for new page with current filters
    this.getAllTours(page);
  }

  // Handle sorting (client-side)
  onSortChange(event: Event) {
    const sortBy = (event.target as HTMLSelectElement).value;

    switch (sortBy) {
      case 'recent':
        this.sortByRecent();
        break;
      case 'seller':
        this.sortByBestSeller();
        break;
      case 'priceLowToHigh':
        this.sortByPriceAsc();
        break;
      case 'priceHighToLow':
        this.sortByPriceDesc();
        break;
      default:
        break;
    }
  }

  sortByRecent() {
    this.filteredTours = [...this.filteredTours].sort((a, b) => b.id - a.id);
  }

  sortByBestSeller() {
    this.filteredTours = [...this.filteredTours].sort(
      (a, b) => (b.display_order || 0) - (a.display_order || 0)
    );
  }

  sortByPriceAsc() {
    this.filteredTours = [...this.filteredTours].sort(
      (a, b) => (a.start_from || 0) - (b.start_from || 0)
    );
  }

  sortByPriceDesc() {
    this.filteredTours = [...this.filteredTours].sort(
      (a, b) => (b.start_from || 0) - (a.start_from || 0)
    );
  }

  // Handle price filter change
  filterTours() {
    // Price filtering is currently client-side only
    // This method is called when price slider changes
    // For now, we'll do client-side filtering on the already loaded tours
    let filtered = [...this.allTours];

    // Filter by price range
    filtered = filtered.filter((tour) => {
      let price = 0;
      if (tour.start_from !== undefined && tour.start_from !== null) {
        price = Number(tour.start_from);
      } else if (tour.adult_price !== undefined && tour.adult_price !== null) {
        price = Number(tour.adult_price);
      } else if (tour.price !== undefined && tour.price !== null) {
        price = Number(tour.price);
      }

      // If price is 0 or NaN, include the tour
      if (isNaN(price) || price === 0) {
        return true;
      }

      return price >= this.minBudget && price <= this.maxBudget;
    });

    this.filteredTours = filtered;
  }

  // Clear all filters
  clearAllFilters() {
    // Reset all filters
    this.selectedTripType = null;
    this.selectedDestination = null;
    this.selectedDuration = null;
    this.selectedCategorySlug = null;
    this.selectedDestinationSlug = null;
    this.selectedDurationSlug = null;
    this.minBudget = 0;
    this.maxBudget = 5000;

    // Reload tours
    this.getAllTours();

    // Update URL
    this.updateURL();
  }

  clearCategoryFilters() {
    this.selectedTripType = null;
    this.selectedCategorySlug = null;
    this.getAllTours();
    this.updateURL();
  }

  clearPriceFilters() {
    this.minBudget = 0;
    this.maxBudget = 5000;
    this.getAllTours();
    this.updateURL();
  }

  clearDurationFilters() {
    this.selectedDuration = null;
    this.selectedDurationSlug = null;
    this.getAllTours();
    this.updateURL();
  }

  clearDestinationFilters() {
    this.selectedDestination = null;
    this.selectedDestinationSlug = null;
    this.getAllTours();
    this.updateURL();
  }

  // Set layout type
  setLayout(type: 'grid' | 'list') {
    this.layoutType = type;
  }

  // Toggle collapse state for filter sections
  toggleCollapse(
    section: 'category' | 'price' | 'duration' | 'destination'
  ) {
    // Close all sections first
    this.isCategoryCollapsed = true;
    this.isPriceCollapsed = true;
    this.isDurationCollapsed = true;
    this.isDestinationCollapsed = true;

    // Open the selected section
    switch (section) {
      case 'category':
        this.isCategoryCollapsed = !this.isCategoryCollapsed;
        break;
      case 'price':
        this.isPriceCollapsed = !this.isPriceCollapsed;
        break;
      case 'duration':
        this.isDurationCollapsed = !this.isDurationCollapsed;
        break;
      case 'destination':
        this.isDestinationCollapsed = !this.isDestinationCollapsed;
        break;
    }
  }
}
