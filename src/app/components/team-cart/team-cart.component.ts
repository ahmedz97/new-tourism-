import { Component } from '@angular/core';

@Component({
  selector: 'app-team-cart',
  standalone: true,
  imports: [],
  templateUrl: './team-cart.component.html',
  styleUrl: './team-cart.component.scss',
})
export class TeamCartComponent {
  teamData: any[] = [
    
    {
      name: 'Anita Hasle',
      jobTitle: 'C0-Founder & Chief Visionary Officer',
      src: '../../../assets/image/team/anita.webp',
    },
    {
      name: 'Maher Abdel Wahab ',
      jobTitle: 'Founder & CEO',
      src: '../../../assets/image/team/maher.webp',
    },
    {
      name: 'Marwa Attia',
      jobTitle: 'Tourism Manager',
      src: '../../../assets/image/team/marwa.webp',
      phone: '01228258254',
    },
  ];
}
