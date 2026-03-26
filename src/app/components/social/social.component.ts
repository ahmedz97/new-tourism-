import { Component, OnInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-social',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social.component.html',
  styleUrl: './social.component.scss',
})
export class SocialComponent implements OnInit {
  constructor(private _DataService: DataService) {}

  socialLinks: any[] = [];
  ngOnInit(): void {
    this.getSettings();
  }
  getSettings(): void {
    this._DataService.getSetting().subscribe({
      next: (res) => {
        // console.log(res.data);

        // social links
        const contactLinks = res.data.find(
          (item: any) => item.option_key === 'social_links'
        );
        this.socialLinks = contactLinks?.option_value || [];
        // console.log(this.socialLinks);
      },
      error: (err) => {
        // console.log(err);
      },
    });
  }

  // helper to get font-awesome icon class based on type
  getIconClass(type: string): string {
    switch (type) {
      case 'facebook':
        return ' fa-brands fa-facebook-f';
      case 'twitter':
        return ' fa-brands fa-x-twitter';
      case 'instagram':
        return ' fa-brands fa-instagram';
      case 'linked-in':
        return ' fa-brands fa-linkedin-in';
      case 'youtube':
        return ' fa-brands fa-youtube';
      case 'pinterest':
        return ' fa-brands fa-pinterest';
      case 'google-plus':
        return ' fa-brands fa-google-plus-g';
      case 'tripadvisor':
        return ' fa fa-';
      default:
        return '';
    }
  }
}
