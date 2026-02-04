import { Component } from '@angular/core';
import { NgxCountAnimationDirective } from 'ngx-count-animation';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CounterComponent } from '../counter/counter.component';

@Component({
  selector: 'app-aboutsection',
  standalone: true,
  imports: [RouterLink, TranslateModule, CounterComponent],
  templateUrl: './aboutsection.component.html',
  styleUrl: './aboutsection.component.scss',
})
export class AboutsectionComponent {}
