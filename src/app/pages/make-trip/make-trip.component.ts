import { Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormControl,
  FormGroup,
  FormArray,
} from '@angular/forms';
import {
  MaketripService,
  TripPayload,
} from '../../core/services/maketrip.service';
import { BookingService } from '../../core/services/booking.service';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import {
  MatFormFieldControl,
  MatFormFieldModule,
} from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { BannerComponent } from '../../components/banner/banner.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-make-trip',
  standalone: true,
  imports: [
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    BannerComponent,
  ],
  templateUrl: './make-trip.component.html',
  styleUrl: './make-trip.component.scss',
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate(
          '600ms ease-out',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
    ]),
    trigger('slideInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(30px)' }),
        animate(
          '500ms ease-out',
          style({ opacity: 1, transform: 'translateX(0)' })
        ),
      ]),
    ]),
    trigger('scaleIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(20px)' }),
            stagger(100, [
              animate(
                '500ms ease-out',
                style({ opacity: 1, transform: 'translateY(0)' })
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
    trigger('cardHover', [
      state('normal', style({ transform: 'scale(1)' })),
      state('hovered', style({ transform: 'scale(1.05)' })),
      transition('normal => hovered', animate('200ms ease-in')),
      transition('hovered => normal', animate('200ms ease-out')),
    ]),
  ],
})
export class MakeTripComponent implements OnInit, AfterViewInit {
  constructor(
    private _MaketripService: MaketripService,
    private _BookingService: BookingService,
    private toaster: ToastrService,
    private _Router: Router,
    private seoService: SeoService,
    private _ActivatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  currentStep: number = 0;

  bannerTitle: string = 'make Your trip';

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  submitFormGroup!: FormGroup;
  prefilled = false; // لو في داتا من Home

  monthList = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  today: Date = new Date();

  makeTripForm: any = {};
  countriesList: any[] = [];
  destinationList: any[] = [];
  minBudget: number = 0;
  maxBudget: number = 0;
  private prefilledData: TripPayload | null = null;

  ngOnInit() {
    this.seoService.updateSeoData(
      {},
      'Alfa Omega Tours - Make Your Trip',
      'Create your custom travel itinerary with Alfa Omega Tours. Plan your perfect trip tailored to your preferences.',
      '../../../assets/image/alfa omega versions/Artboard 1 copy 3@4x.png'
    );
    this.showCountries();
    this.buildForms();

    // Read query parameters from URL
    this._ActivatedRoute.queryParams.subscribe((params) => {
      if (params && Object.keys(params).length > 0) {
        const queryData: TripPayload = {
          destination: params['city'] || undefined,
          fromDuration: params['start_date'] ? this.toDate(params['start_date']) : null,
          ToDuration: params['end_date'] ? this.toDate(params['end_date']) : null,
          appro: params['approximate_time'] ? Number(params['approximate_time']) : null,
        };

        // Set data in service
        this._MaketripService.setMakeTripSteps(queryData);
        this.prefilledData = queryData;
        this.prefilled = true;
      }
    });

    // Check for existing data from service first
    const existingData = this._MaketripService.getMakeTripSteps();
    if (existingData) {
      this.prefilledData = existingData;
      this.prefilled = true;
    }

    this._MaketripService.getDestination().subscribe({
      next: (response) => {
        this.destinationList = response.data.data.reverse() || [];
        // Apply prefilled data after destinationList is loaded
        if (this.prefilledData) {
          this.applyIncoming(this.prefilledData);
          setTimeout(() => {
            this.navigateToCorrectStep();
          }, 100);
        }
      },
      error: (err) => {
        // console.log(err.error.message);
      },
    });

    this._MaketripService.makeTripSteps$.subscribe((data) => {
      if (!data) {
        this.prefilled = false;
        this.prefilledData = null;
        return;
      }
      this.prefilledData = data;
      this.applyIncoming(data);
      this.prefilled = true;

      // Navigate to correct step after data is applied
      setTimeout(() => {
        this.navigateToCorrectStep();
      }, 100);
    });

    this.onBudgetChange();
  }

  ngAfterViewInit() {
    // Wait for stepper to be ready, then navigate if needed
    setTimeout(() => {
      this.navigateToCorrectStep();
    }, 200);
  }

  goToStep(stepIndex: number) {
    this.currentStep = stepIndex;
    this.cdr.detectChanges();
  }

  nextStep() {
    if (this.currentStep < 2) {
      this.currentStep++;
      this.cdr.detectChanges();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.cdr.detectChanges();
    }
  }

  private navigateToCorrectStep() {
    if (!this.prefilledData || !this.prefilledData.destination) {
      // No destination, start from step 1
      this.currentStep = 0;
      this.cdr.detectChanges();
      return;
    }

    // Check if dates are also provided
    const hasDates = (this.prefilledData.fromDuration && this.prefilledData.ToDuration) || this.prefilledData.appro;
    
    if (hasDates) {
      // Navigate to step 3
      this.currentStep = 2;
    } else {
      // Navigate to step 2 (date selection)
      this.currentStep = 1;
    }
    
    this.cdr.detectChanges();
  }

  isStepCompleted(stepIndex: number): boolean {
    if (stepIndex === 0) {
      return this.prefilled && !!this.firstFormGroup.get('destination')?.value;
    }
    if (stepIndex === 1) {
      return this.prefilled && (!!this.secondFormGroup.get('start_date')?.value || 
                                !!this.secondFormGroup.get('end_date')?.value || 
                                !!this.secondFormGroup.get('month')?.value);
    }
    return false;
  }

  private buildForms() {
    this.firstFormGroup = new FormGroup({
      destination: new FormControl(''),
    });

    this.secondFormGroup = new FormGroup({
      type: new FormControl('exact_time'),
      start_date: new FormControl(null),
      end_date: new FormControl(null),
      month: new FormControl(null),
      days: new FormControl(''),
    });

    this.submitFormGroup = new FormGroup({
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      email: new FormControl(''),
      nationality: new FormControl(''),
      phone_number: new FormControl<string>(''),
      adults: new FormControl(0),
      children: new FormControl(0),
      infants: new FormControl(0),
      additional_notes: new FormControl(''),
      min_person_budget: new FormControl(5000),
      max_person_budget: new FormControl(20000),
      flight_offer: new FormControl(0),
    });
  }

  private toDate(v: any): Date | null {
    if (!v) return null;
    if (v instanceof Date) {
      // If it's already a Date, ensure it's at local midnight to avoid timezone issues
      const year = v.getFullYear();
      const month = v.getMonth();
      const day = v.getDate();
      return new Date(year, month, day);
    }
    
    // Handle string dates (ISO format or date-only)
    if (typeof v === 'string') {
      // If it's a date-only string (YYYY-MM-DD), create date at local midnight
      if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
        const [year, month, day] = v.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      // If it's an ISO string, extract date part and create local date
      const dateMatch = v.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        const [, year, month, day] = dateMatch.map(Number);
        return new Date(year, month - 1, day);
      }
      // Fallback to parsing the string
      const date = new Date(v);
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return new Date(year, month, day);
      }
    }
    
    return null;
  }

  private applyIncoming(data: TripPayload) {
    const destinationSlug = data.destination ?? '';
    const fromDate = this.toDate(data.fromDuration ?? null);
    const toDate = this.toDate(data.ToDuration ?? null);
    const approx = data.appro ?? null;

    // Convert slug to title for the form (form uses title as value)
    let destinationTitle = '';
    if (destinationSlug && this.destinationList.length > 0) {
      const foundDestination = this.destinationList.find(
        (dest) => dest.slug === destinationSlug
      );
      if (foundDestination) {
        destinationTitle = foundDestination.title;
      }
    }

    // Patch the form value
    if (destinationTitle) {
      this.firstFormGroup.patchValue({ destination: destinationTitle });
      this.firstFormGroup.markAsTouched();
      this.firstFormGroup.updateValueAndValidity();
    } else if (destinationSlug) {
      // If destinationList not loaded yet, store slug and will apply later
      this.firstFormGroup.patchValue({ destination: destinationSlug });
    }

    if (approx) {
      this.secondFormGroup.patchValue({
        type: 'approx_time',
        start_date: null,
        end_date: null,
        month: approx,
      });
    } else {
      this.secondFormGroup.patchValue({
        type: 'exact_time',
        start_date: fromDate,
        end_date: toDate,
        month: null,
      });
    }
    this.secondFormGroup.updateValueAndValidity({ emitEvent: false });
  }

  isDateTypeSelected(value: string): boolean {
    return this.secondFormGroup.get('type')?.value === value;
  }

  onToursChange(event: any) {
    this.firstFormGroup.patchValue({ destination: event.target.value });
  }

  toggleDestination(destinationTitle: string, event: MouseEvent): void {
    event.preventDefault();
    const current = this.firstFormGroup.get('destination')?.value;
    this.firstFormGroup.patchValue({
      destination: current === destinationTitle ? '' : destinationTitle,
    });
    this.firstFormGroup.markAsTouched();
    this.firstFormGroup.updateValueAndValidity();
  }

  isDestinationSelected(destinationTitle: string): boolean {
    return this.firstFormGroup.get('destination')?.value === destinationTitle;
  }

  submitForm() {
    if (this.submitFormGroup.status == 'VALID') {
      // Get form values
      const firstFormValue = this.firstFormGroup.value;
      const secondFormValue = this.secondFormGroup.value;
      const submitFormValue = this.submitFormGroup.value;

      // Format dates to YYYY-MM-DD format
      this.makeTripForm = {
        ...firstFormValue,
        start_date: this.formatDateForSubmission(secondFormValue.start_date),
        end_date: this.formatDateForSubmission(secondFormValue.end_date),
        type: secondFormValue.type,
        month: secondFormValue.month,
        days: secondFormValue.days,
        ...submitFormValue,
        phone_number: String(submitFormValue.phone_number ?? '').trim(),
      };

      this._MaketripService.sendDataTrip(this.makeTripForm).subscribe({
        next: (response) => {
          this.toaster.success(response.message);
          this._Router.navigate(['/']); //go to home page
        },
        error: (err) => {
          this.toaster.error(err.error.message);
        },
      });
    }
  }

  private formatDateForSubmission(date: any): string | null {
    if (!date) return null;
    
    // If it's already a Date object
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    
    // If it's a string (ISO format or date-only)
    if (typeof date === 'string') {
      // If it's already in YYYY-MM-DD format, return as is
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      
      // If it's an ISO string, extract date part
      const dateMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
      if (dateMatch) {
        return dateMatch[0]; // Returns YYYY-MM-DD
      }
      
      // Try to parse as Date
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
        const day = String(parsedDate.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    
    return null;
  }

  onBudgetChange() {
    this.minBudget = this.submitFormGroup.get('min_person_budget')?.value;
    this.maxBudget = this.submitFormGroup.get('max_person_budget')?.value;
  }

  increment(type: string) {
    let currentValue = this.submitFormGroup.get(type)?.value || 0;
    if (currentValue < 12) {
      this.submitFormGroup.get(type)?.setValue(currentValue + 1);
    }
  }

  decrement(type: string) {
    let currentValue = this.submitFormGroup.get(type)?.value || 0;
    if (currentValue > 0) {
      this.submitFormGroup.get(type)?.setValue(currentValue - 1);
    }
  }

  showCountries(): void {
    this._BookingService.getCountries().subscribe({
      next: (response) => {
        this.countriesList = response.data;
      },
    });
  }

  resetStepper() {
    this.currentStep = 0;
    this.prefilled = false;
    this.prefilledData = null;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset();
    this.submitFormGroup.reset();
    this._MaketripService.setMakeTripSteps(null as any);
    this.cdr.detectChanges();
  }
}
