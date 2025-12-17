import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [RouterLink, TranslateModule, CommonModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss',
})
export class BannerComponent {
  @Input() bannerTitle: string = '';
  @Input() categoryName: string = ''; // For display
  @Input() categorySlug: string = ''; // For navigation query param
  @Input() tourName: string = '';
}
