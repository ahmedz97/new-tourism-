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
import {
  formatLocalDateYmd,
  isControlInvalid,
  phoneInputHandler,
  phoneValidators,
  PHONE_MAX_LENGTH,
  startOfToday,
} from '../../core/utils/form.utils';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-make-trip',
  standalone: true,
  imports: [
    MatRadioModule,
    MatCheckboxModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    BannerComponent,
    TranslateModule,
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
    private cdr: ChangeDetectorRef,
    private translate: TranslateService
  ) {}

  currentStep: number = 0;

  bannerTitle: string = 'makeTrip.bannerTitle';

  firstFormGroup!: FormGroup;
  secondFormGroup!: FormGroup;
  submitFormGroup!: FormGroup;
  prefilled = false; // لو في داتا من Home

  monthList = [
    'common.months.january',
    'common.months.february',
    'common.months.march',
    'common.months.april',
    'common.months.may',
    'common.months.june',
    'common.months.july',
    'common.months.august',
    'common.months.september',
    'common.months.october',
    'common.months.november',
    'common.months.december',
  ];
  today: Date = startOfToday();
  phoneMaxLength = PHONE_MAX_LENGTH;
  submitted = false;
  selectedDestinations: string[] = [];

  makeTripForm: any = {};
  countriesList: any[] = [];
  destinationList: any[] = [];
  minBudget: number = 0;
  maxBudget: number = 0;
  private prefilledData: TripPayload | null = null;

  ngOnInit() {
    this.seoService.applySettingsSeo({
      title: 'Alfa Omega Tours - Make Your Trip',
      description:
        'Create your custom travel itinerary with Alfa Omega Tours. Plan your perfect trip tailored to your preferences.',
    });
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
      return this.prefilled && !!this.getDestinationString();
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
      destination: new FormControl('', [Validators.required]),
    });

    this.secondFormGroup = new FormGroup({
      type: new FormControl('exact_time'),
      start_date: new FormControl(null),
      end_date: new FormControl(null),
      month: new FormControl(null),
      days: new FormControl(''),
    });

    this.submitFormGroup = new FormGroup({
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      nationality: new FormControl('', [Validators.required]),
      phone_number: new FormControl<string>('', phoneValidators(true)),
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

    // Convert slug/title to destination titles for checkboxes
    let destinationTitles: string[] = [];
    if (destinationSlug && this.destinationList.length > 0) {
      const parts = String(destinationSlug)
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);

      for (const part of parts) {
        const found = this.destinationList.find(
          (dest) => dest.slug === part || dest.title === part
        );
        if (found) {
          destinationTitles.push(found.title);
        } else {
          destinationTitles.push(part);
        }
      }
    }

    if (destinationTitles.length) {
      this.selectedDestinations = destinationTitles;
      this.syncDestinationControl();
    } else if (destinationSlug) {
      this.selectedDestinations = String(destinationSlug)
        .split(',')
        .map((p) => p.trim())
        .filter(Boolean);
      this.syncDestinationControl();
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

  getDestinationString(): string {
    return this.selectedDestinations.filter(Boolean).join(', ');
  }

  private syncDestinationControl(): void {
    const value = this.getDestinationString();
    this.firstFormGroup.patchValue({ destination: value });
    this.firstFormGroup.get('destination')?.markAsTouched();
    this.firstFormGroup.get('destination')?.updateValueAndValidity();
  }

  toggleDestination(destinationTitle: string, event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();

    const idx = this.selectedDestinations.indexOf(destinationTitle);
    if (idx >= 0) {
      this.selectedDestinations = this.selectedDestinations.filter(
        (t) => t !== destinationTitle
      );
    } else {
      this.selectedDestinations = [
        ...this.selectedDestinations,
        destinationTitle,
      ];
    }
    this.syncDestinationControl();
  }

  isDestinationSelected(destinationTitle: string): boolean {
    return this.selectedDestinations.includes(destinationTitle);
  }

  isFieldInvalid(form: FormGroup, fieldName: string): boolean {
    return isControlInvalid(form.get(fieldName), this.submitted);
  }

  onPhoneInput(event: Event): void {
    phoneInputHandler(event, this.submitFormGroup.get('phone_number'));
  }

  submitForm() {
    this.submitted = true;
    this.firstFormGroup.markAllAsTouched();
    this.secondFormGroup.markAllAsTouched();
    this.submitFormGroup.markAllAsTouched();

    const destination = this.getDestinationString();
    if (!destination) {
      this.toaster.error(
        this.translate.instant('makeTrip.errors.destinationRequired')
      );
      this.currentStep = 0;
      return;
    }

    // Ensure destination is always a non-empty string for the API
    this.firstFormGroup.patchValue({ destination: String(destination) });

    if (this.submitFormGroup.invalid) {
      this.toaster.error(
        this.translate.instant('common.errors.fillRequiredFields')
      );
      return;
    }

    const firstFormValue = this.firstFormGroup.value;
    const secondFormValue = this.secondFormGroup.value;
    const submitFormValue = this.submitFormGroup.value;

    this.makeTripForm = {
      ...firstFormValue,
      destination: String(destination),
      start_date: formatLocalDateYmd(secondFormValue.start_date),
      end_date: formatLocalDateYmd(secondFormValue.end_date),
      type: secondFormValue.type,
      month: secondFormValue.month,
      days: secondFormValue.days,
      ...submitFormValue,
      phone_number: String(submitFormValue.phone_number ?? '').trim(),
      flight_offer: submitFormValue.flight_offer ? 1 : 0,
    };

    this._MaketripService.sendDataTrip(this.makeTripForm).subscribe({
      next: (response) => {
        this.toaster.success(response.message);
        this._Router.navigate(['/']);
      },
      error: (err) => {
        this.toaster.error(
          err.error?.message ||
            this.translate.instant('common.errors.somethingWentWrong')
        );
      },
    });
  }

  private formatDateForSubmission(date: any): string | null {
    return formatLocalDateYmd(date);
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
    this.selectedDestinations = [];
    this.submitted = false;
    this.firstFormGroup.reset();
    this.secondFormGroup.reset({ type: 'exact_time' });
    this.submitFormGroup.reset({
      adults: 0,
      children: 0,
      infants: 0,
      min_person_budget: 5000,
      max_person_budget: 20000,
      flight_offer: 0,
    });
    this._MaketripService.setMakeTripSteps(null as any);
    this.cdr.detectChanges();
  }
}
