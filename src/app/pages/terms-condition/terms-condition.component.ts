import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BannerComponent } from '../../components/banner/banner.component';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [TranslateModule, BannerComponent],
  templateUrl: './terms-condition.component.html',
  styleUrl: './terms-condition.component.scss',
})
export class TermsConditionComponent implements OnInit {
  bannerTitle: string = 'termsCondition.bannerTitle';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.applyPageSeoByRoute('terms-and-conditions', {
      title: 'Alfa Omega Tours - Terms & Conditions',
      description:
        'Read the terms and conditions for booking tours and travel services with Alfa Omega Tours.',
    });
  }
}
