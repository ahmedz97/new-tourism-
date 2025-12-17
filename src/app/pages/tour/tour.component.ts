import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { TourcartComponent } from '../../components/tourcart/tourcart.component';
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

type FilterKey = 'selectedTripType' | 'selectedDestination';

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
    private router: Router,
    private seoService: SeoService
  ) {}

  bannerTitle: string = 'tour search';

  // pagination
  itemsPerPage: number = 0;
  currentPage: number = 1;
  totalItems: number = 0;

  layoutType: 'grid' | 'list' = 'grid';
  minBudget = 0;
  maxBudget = 5000;

  selectedDestination: number | null = null;
  selectedTripType: number | null = null;
  selectedDuration: number | null = null;
  selectedCategorySlug: string | null = null; // Store slug from URL

  // Accordion panel management
  openPanel: string | null = 'price'; // Price panel open by default

  allCategories: any[] = [];
  allDestinations: any[] = [];
  allDurations: any[] = [];
  allTours: any[] = [];
  filteredTours: any[] = [];
  categoriesWithTours: any[] = []; // Store categories with included tours

  allToursRaw: any[] = []; // النسخة الخام من API بدون فلاتر

  // Collapse states for filter sections (first one open by default)
  isCategoryCollapsed: boolean = false; // First section open
  isPriceCollapsed: boolean = true;
  isDurationCollapsed: boolean = true;
  isDestinationCollapsed: boolean = true;

  ngOnInit(): void {
    this.seoService.updateSeoData(
      {},
      'Alfa Omega Tours - Tours',
      'Explore our wide range of premium tours and travel packages with Alfa Omega Tours. Find your perfect adventure today.',
      '../../../assets/image/alfa omega versions/Artboard 1 copy 3@4x.png'
    );
    this.getDestination();
    this.getCategories(); // This now includes tours data
    this.getDurations();
    this._ActivatedRoute.queryParams.subscribe((param) => {
      // console.log('params', param);

      this.selectedDestination = param['location']
        ? Number(param['location'])
        : null;

      // Handle category slug instead of ID
      if (param['type']) {
        this.selectedCategorySlug = param['type'];
        // Find category ID from slug
        const category = this.allCategories.find(
          (cat) => cat.slug === param['type']
        );
        if (category) {
          this.selectedTripType = category.id;
        } else {
          // If categories not loaded yet, store slug and resolve after categories load
          this.selectedTripType = null;
        }
      } else {
        this.selectedCategorySlug = null;
        this.selectedTripType = null;
      }

      this.selectedDuration = param['duration']
        ? Number(param['duration'])
        : null;
      this.filterTours();
    });
  }

  getDestination() {
    this._DataService.getDestination().subscribe({
      next: (res) => {
        this.allDestinations = res.data.data;
        // console.log('allDestinations', this.allDestinations);
        // Update destination counts after loading
        // this.updateDestinationCounts();
      },
      // error: (err) => console.log(err),
    });
  }

  getCategories() {
    this._DataService.getCategories().subscribe({
      next: (res) => {
        this.allCategories = res.data.data;
        this.categoriesWithTours = res.data.data;

        // Extract all tours from categories and store them
        this.allTours = [];
        const tourCategoryMap = new Map(); // Track which categories each tour belongs to

        this.categoriesWithTours.forEach((category) => {
          if (category.tours && Array.isArray(category.tours)) {
            category.tours.forEach((tour: any) => {
              // Check if tour already exists
              const existingTour = this.allTours.find(
                (existingTour) => existingTour.id === tour.id
              );

              if (!existingTour) {
                // Add category information to tour for easier filtering
                tour.category_ids = [category.id];
                tour.category_titles = [category.title];
                this.allTours.push(tour);
                tourCategoryMap.set(tour.id, [category.id]);
              } else {
                // Tour already exists, add this category to its list
                if (!existingTour.category_ids.includes(category.id)) {
                  existingTour.category_ids.push(category.id);
                  existingTour.category_titles.push(category.title);
                  tourCategoryMap.get(tour.id).push(category.id);
                }
              }
            });
          }
        });

        this.filteredTours = [...this.allTours];
        // console.log('=== CATEGORIES LOADED ===');
        // console.log('All categories:', this.allCategories);
        // console.log('Categories with tours:', this.categoriesWithTours);
        // console.log('All tours from categories:', this.allTours);
        // console.log('Tour category mapping:', tourCategoryMap);
        // console.log('========================');

        // If no tours found in categories, get all tours as fallback
        if (this.allTours.length === 0) {
          // console.log('No tours found in categories, fetching all tours...');
          this.getAllTours();
        } else {
          // Apply filters after loading tours
          this.filterTours();
        }

        // Resolve category slug to ID if it was set before categories loaded
        if (this.selectedCategorySlug && this.selectedTripType === null) {
          const category = this.allCategories.find(
            (cat) => cat.slug === this.selectedCategorySlug
          );
          if (category) {
            this.selectedTripType = category.id;
            this.filterTours();
          }
        }
      },
      // error: (err) => console.log(err),
    });
  }
  getDurations() {
    this._DataService.getToursDuration().subscribe({
      next: (res) => {
        this.allDurations = res.data;
        // console.log(this.allDurations);
      },
      // error: (err) => console.log(err),
    });
  }

  getAllTours() {
    // Fallback method to get all tours if categories don't include them
    this._DataService.getTours().subscribe({
      next: (res) => {
        this.allTours = res.data.data;
        this.filterTours(); // Apply filters after loading
        // console.log('Fallback: All tours loaded:', this.allTours);
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  filterTours() {
    // Use client-side filtering instead of API calls for better performance
    let filtered = [...this.allTours];

    // Filter by selected categories
    if (this.selectedTripType !== null) {
      filtered = filtered.filter((tour) => {
        // Check if tour has category_ids array (added during extraction)
        if (tour.category_ids && Array.isArray(tour.category_ids)) {
          return tour.category_ids.includes(this.selectedTripType!);
        }
        // Check if tour has categories array (from regular API calls)
        if (tour.categories && Array.isArray(tour.categories)) {
          return tour.categories.some(
            (cat: any) => cat.id === this.selectedTripType
          );
        }
        // Check if tour has pivot with category_id (from included tours data)
        if (tour.pivot && tour.pivot.category_id) {
          return tour.pivot.category_id === this.selectedTripType;
        }
        // Check if tour has single category_id (legacy support)
        if (tour.category_id) {
          return tour.category_id === this.selectedTripType;
        }
        return false;
      });
    }

    // Filter by selected destinations
    if (this.selectedDestination !== null) {
      filtered = filtered.filter((tour) => {
        return (
          tour.destinations &&
          tour.destinations.some(
            (dest: any) => dest.id === this.selectedDestination
          )
        );
      });
    }

    // Filter by selected durations
    if (this.selectedDuration !== null) {
      filtered = filtered.filter((tour) => {
        // Check if tour has duration_in_days property
        if (tour.duration_in_days) {
          return tour.duration_in_days === this.selectedDuration;
        }
        // Check if tour has days array
        if (tour.days && Array.isArray(tour.days)) {
          return tour.days.length === this.selectedDuration;
        }
        // Check if tour has duration property
        if (tour.duration) {
          const durationNum = Number(tour.duration);
          return !isNaN(durationNum) && durationNum === this.selectedDuration;
        }
        return false;
      });
    }

    // Filter by price range
    filtered = filtered.filter((tour) => {
      // Try different price properties
      let price = 0;
      if (tour.start_from !== undefined && tour.start_from !== null) {
        price = Number(tour.start_from);
      } else if (tour.adult_price !== undefined && tour.adult_price !== null) {
        price = Number(tour.adult_price);
      } else if (tour.price !== undefined && tour.price !== null) {
        price = Number(tour.price);
      }

      // If price is 0 or NaN, include the tour (assume it's valid or free)
      if (isNaN(price) || price === 0) {
        return true;
      }

      return price >= this.minBudget && price <= this.maxBudget;
    });

    this.filteredTours = filtered;
    this.totalItems = filtered.length;
    this.currentPage = 1; // Reset to first page when filters change
    // console.log('=== FILTERING RESULTS ===');
    // console.log('Selected categories:', this.selectedTripType);
    // console.log('Selected destinations:', this.selectedDestination);
    // console.log('Selected durations:', this.selectedDuration);
    // console.log('Price range:', this.minBudget, '-', this.maxBudget);
    // console.log('Total tours before filtering:', this.allTours.length);
    // console.log('Total tours after filtering:', filtered.length);
    // console.log('Filtered tours:', this.filteredTours);
    // console.log('========================');
  }

  // Get available tours count for a specific category based on current filters
  getCategoryToursCount(categoryId: number): number {
    let filtered = [...this.allTours];

    // Filter by selected destinations
    if (this.selectedDestination !== null) {
      filtered = filtered.filter((tour) => {
        return (
          tour.destinations &&
          tour.destinations.some(
            (dest: any) => dest.id === this.selectedDestination
          )
        );
      });
    }

    // Filter by selected durations
    if (this.selectedDuration !== null) {
      filtered = filtered.filter((tour) => {
        if (tour.duration_in_days) {
          return tour.duration_in_days === this.selectedDuration;
        }
        if (tour.days && Array.isArray(tour.days)) {
          return tour.days.length === this.selectedDuration;
        }
        if (tour.duration) {
          const durationNum = Number(tour.duration);
          return !isNaN(durationNum) && durationNum === this.selectedDuration;
        }
        return false;
      });
    }

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

      // If price is 0 or NaN, include the tour (assume it's valid or free)
      if (isNaN(price) || price === 0) {
        return true;
      }

      return price >= this.minBudget && price <= this.maxBudget;
    });

    // Now count tours that belong to this category
    return filtered.filter((tour) => {
      if (tour.category_ids && Array.isArray(tour.category_ids)) {
        return tour.category_ids.includes(categoryId);
      }
      if (tour.categories && Array.isArray(tour.categories)) {
        return tour.categories.some((cat: any) => cat.id === categoryId);
      }
      if (tour.pivot && tour.pivot.category_id) {
        return tour.pivot.category_id === categoryId;
      }
      if (tour.category_id) {
        return tour.category_id === categoryId;
      }
      return false;
    }).length;
  }

  // Get available tours count for a specific destination based on current filters
  getDestinationToursCount(destinationId: number): number {
    let filtered = [...this.allTours];

    // Filter by selected categories
    if (this.selectedTripType !== null) {
      filtered = filtered.filter((tour) => {
        if (tour.category_ids && Array.isArray(tour.category_ids)) {
          return tour.category_ids.includes(this.selectedTripType!);
        }
        if (tour.categories && Array.isArray(tour.categories)) {
          return tour.categories.some(
            (cat: any) => cat.id === this.selectedTripType
          );
        }
        if (tour.pivot && tour.pivot.category_id) {
          return tour.pivot.category_id === this.selectedTripType;
        }
        if (tour.category_id) {
          return tour.category_id === this.selectedTripType;
        }
        return false;
      });
    }

    // Filter by selected durations
    if (this.selectedDuration !== null) {
      filtered = filtered.filter((tour) => {
        if (tour.duration_in_days) {
          return tour.duration_in_days === this.selectedDuration;
        }
        if (tour.days && Array.isArray(tour.days)) {
          return tour.days.length === this.selectedDuration;
        }
        if (tour.duration) {
          const durationNum = Number(tour.duration);
          return !isNaN(durationNum) && durationNum === this.selectedDuration;
        }
        return false;
      });
    }

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

      // If price is 0 or NaN, include the tour (assume it's valid or free)
      if (isNaN(price) || price === 0) {
        return true;
      }

      return price >= this.minBudget && price <= this.maxBudget;
    });

    // Now count tours that belong to this destination
    return filtered.filter((tour) => {
      return (
        tour.destinations &&
        tour.destinations.some((dest: any) => dest.id === destinationId)
      );
    }).length;
  }

  // Get available tours count for a specific duration based on current filters
  getDurationToursCount(durationId: number): number {
    let filtered = [...this.allTours];

    // Filter by selected categories
    if (this.selectedTripType !== null) {
      filtered = filtered.filter((tour) => {
        if (tour.category_ids && Array.isArray(tour.category_ids)) {
          return tour.category_ids.includes(this.selectedTripType!);
        }
        if (tour.categories && Array.isArray(tour.categories)) {
          return tour.categories.some(
            (cat: any) => cat.id === this.selectedTripType
          );
        }
        if (tour.pivot && tour.pivot.category_id) {
          return tour.pivot.category_id === this.selectedTripType;
        }
        if (tour.category_id) {
          return tour.category_id === this.selectedTripType;
        }
        return false;
      });
    }

    // Filter by selected destinations
    if (this.selectedDestination !== null) {
      filtered = filtered.filter((tour) => {
        return (
          tour.destinations &&
          tour.destinations.some(
            (dest: any) => dest.id === this.selectedDestination
          )
        );
      });
    }

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

      // If price is 0 or NaN, include the tour (assume it's valid or free)
      if (isNaN(price) || price === 0) {
        return true;
      }

      return price >= this.minBudget && price <= this.maxBudget;
    });

    // Now count tours that match this duration
    return filtered.filter((tour) => {
      if (tour.duration_in_days) {
        return tour.duration_in_days === durationId;
      }
      if (tour.days && Array.isArray(tour.days)) {
        return tour.days.length === durationId;
      }
      if (tour.duration) {
        const durationNum = Number(tour.duration);
        return !isNaN(durationNum) && durationNum === durationId;
      }
      return false;
    }).length;
  }

  onRadioChange(
    key: 'selectedTripType' | 'selectedDuration' | 'selectedDestination',
    value: number | null
  ) {
    // For radio, set the value directly (single selection)
    if (key === 'selectedTripType') {
      this.selectedTripType = value;
      // Update URL with slug if category is selected
      if (value !== null) {
        const category = this.allCategories.find((cat) => cat.id === value);
        if (category) {
          this.selectedCategorySlug = category.slug;
          this.updateUrlWithSlug(category.slug);
        } else {
          this.selectedCategorySlug = null;
          this.updateUrlWithSlug(null);
        }
      } else {
        this.selectedCategorySlug = null;
        this.updateUrlWithSlug(null);
      }
    } else if (key === 'selectedDuration') {
      this.selectedDuration = value;
    } else if (key === 'selectedDestination') {
      this.selectedDestination = value;
    }

    // If this is a category and no tours are found, try to get tours for this category
    if (key === 'selectedTripType' && value !== null) {
      const categoryHasTours = this.allTours.some(
        (tour) => tour.category_ids && tour.category_ids.includes(value)
      );
      if (!categoryHasTours) {
        // console.log(`No tours found for category ${value}, fetching...`);
        this.getToursForCategory(value);
      }
    }

    this.filterTours();
  }

  // Update URL with slug instead of ID
  updateUrlWithSlug(slug: string | null) {
    const queryParams: any = { ...this._ActivatedRoute.snapshot.queryParams };

    if (slug) {
      queryParams['type'] = slug;
    } else {
      delete queryParams['type'];
    }

    this.router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: queryParams,
      queryParamsHandling: 'merge',
    });
  }

  setLayout(type: 'grid' | 'list') {
    this.layoutType = type;
  }

  onPriceRangeChange() {
    this.filterTours();
  }

  // Method to clear all filters
  clearAllFilters() {
    this.selectedTripType = null;
    this.selectedDestination = null;
    this.selectedDuration = null;
    this.selectedCategorySlug = null;
    this.minBudget = 0;
    this.maxBudget = 5000;

    // Clear URL parameters
    this.router.navigate([], {
      relativeTo: this._ActivatedRoute,
      queryParams: {},
    });

    this.filterTours();
    // console.log('All filters cleared');
  }

  // Accordion panel management methods
  onPanelOpened(panelName: string) {
    // Close other panels when one opens (accordion behavior)
    this.openPanel = panelName;
  }

  onPanelClosed(panelName: string) {
    if (this.openPanel === panelName) {
      // Only set to null if price panel is closed, otherwise keep price open
      if (panelName === 'price') {
        this.openPanel = null;
      }
    }
  }

  // Method to get tours for a specific category if not found in included data
  getToursForCategory(categoryId: number) {
    const query = { category_id: categoryId };
    this._DataService.getTours(query).subscribe({
      next: (res) => {
        const categoryTours = res.data.data;
        // Add these tours to our existing tours if they don't already exist
        categoryTours.forEach((tour: any) => {
          if (
            !this.allTours.find((existingTour) => existingTour.id === tour.id)
          ) {
            tour.category_ids = [categoryId];
            tour.category_titles = [
              this.allCategories.find((cat) => cat.id === categoryId)?.title ||
                '',
            ];
            this.allTours.push(tour);
          }
        });
        this.filterTours();
        // console.log(`Tours loaded for category ${categoryId}:`, categoryTours);
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  // Toggle collapse state for filter sections (accordion behavior)
  toggleCollapse(section: 'category' | 'price' | 'duration' | 'destination') {
    // Close all sections first
    this.isCategoryCollapsed = true;
    this.isPriceCollapsed = true;
    this.isDurationCollapsed = true;
    this.isDestinationCollapsed = true;

    // Then toggle the clicked section
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

  getTourPage(page: number): void {
    this._DataService.getTourPagination(page).subscribe({
      next: (res) => {
        this.allTours = res.data.data;
        this.totalItems = res.data.total;
        this.currentPage = page;
        // console.log(this.itemsPerPage, this.totalItems, this.currentPage);
        // console.log(res.data);

        this.allTours.forEach((tour) => {
          tour.destinationsTitle = tour.destinations
            ?.map((x: any) => x.title)
            .join(', ');
        });
        this.filteredTours = [...this.allTours];
      },
      error: (err) => console.error(err),
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    // console.log(page);
    this.filterTours();
  }

  onSortChange(event: Event) {
    const sortBy = (event.target as HTMLSelectElement).value;

    switch (sortBy) {
      case 'recent':
        this.sortByRecent();
        break;
      // to do best seller , you must have property to check number of seller si 'sales_count'
      // i use display_order [true or false]
      case 'bestseller':
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

  sortByBestSeller() {
    this.filteredTours = [...this.allTours].sort(
      (a, b) => b.display_order - a.display_order
    );
    // console.log(this.filteredTours);
  }

  sortByRecent() {
    this.filteredTours = [...this.allTours].sort((a, b) => b.id - a.id);
    // console.log(this.filteredTours);
  }

  sortByPriceAsc() {
    this.filteredTours = [...this.allTours].sort(
      (a, b) => a.start_from - b.start_from
    );
    // console.log(this.filteredTours);
  }

  sortByPriceDesc() {
    this.filteredTours = [...this.allTours].sort(
      (a, b) => b.start_from - a.start_from
    );
    // console.log(this.filteredTours);
  }
}
