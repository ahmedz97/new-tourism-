import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { BannerComponent } from "../../components/banner/banner.component";
@Component({
  selector: 'app-terms-condition',
  standalone: true,
  imports: [TranslateModule, BannerComponent],
  templateUrl: './terms-condition.component.html',
  styleUrl: './terms-condition.component.scss'
})
export class TermsConditionComponent {
  bannerTitle: string = 'Terms & Conditions';

}
