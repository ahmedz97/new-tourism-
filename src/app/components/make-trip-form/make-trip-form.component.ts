import { Component, OnInit } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import {
  MatFormField,
  MatInputModule,
  MatLabel,
} from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MaketripService } from '../../core/services/maketrip.service';
import { DataService } from '../../core/services/data.service';
import { Subject, takeUntil, tap } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-make-trip-form',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    TranslateModule,
  ],
  templateUrl: './make-trip-form.component.html',
  styleUrl: './make-trip-form.component.scss',
})
export class MakeTripFormComponent implements OnInit {
  private $destory = new Subject<void>();

  constructor(
    private _Router: Router,
    private _DataService: DataService,
    private _MaketripService: MaketripService
  ) {}

  allDestinations: any[] = [];
  MarkTime: string = 'exact';
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

  ngOnInit(): void {
    this.getDestination();
  }

  makeTripForm = new FormGroup({
    city: new FormControl('', Validators.required),
    start_date: new FormControl(''),
    end_date: new FormControl(''),
    approximate_time: new FormControl(''),
  });


  onMakeTripSubmit() {
    if (this.makeTripForm.invalid) return;

    // console.log('fire done onMakeTripSubmit');
    // console.log(this.makeTripForm.value);

    const formValue = this.makeTripForm.value;

    // Prepare query parameters
    const queryParams: any = {};
    if (formValue.city) queryParams.city = formValue.city;
    if (formValue.start_date) {
      // Convert Date to string if it's a Date object (format: YYYY-MM-DD)
      const startDate = formValue.start_date as any;
      queryParams.start_date = startDate instanceof Date 
        ? this.formatDateForQuery(startDate)
        : formValue.start_date;
    }
    if (formValue.end_date) {
      // Convert Date to string if it's a Date object (format: YYYY-MM-DD)
      const endDate = formValue.end_date as any;
      queryParams.end_date = endDate instanceof Date 
        ? this.formatDateForQuery(endDate)
        : formValue.end_date;
    }
    if (formValue.approximate_time) queryParams.approximate_time = formValue.approximate_time;

    this._MaketripService.setMakeTripSteps({
      destination: formValue.city || undefined,
      fromDuration: formValue.start_date || null,
      ToDuration: formValue.end_date || null,
      appro: formValue.approximate_time || null,
    });

    this._Router.navigate(['/makeTrip'], { queryParams });
  }

  onChangeTime(TypeTime: string): void {
    this.MarkTime = TypeTime;
  }

  getDestination() {
    this._DataService
      .getDestination()
      .pipe(
        takeUntil(this.$destory), // close , clear suscripe memory on destroy
        tap((res) => {
          if (res) {
            // console.log('home page -- ', res);
            this.allDestinations = res.data.data.reverse();
          }
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.$destory.next();
    this.$destory.complete();
  }

  private formatDateForQuery(date: Date): string {
    // Format date as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
