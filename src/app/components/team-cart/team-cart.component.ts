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
      name: 'Maher',
      jobTitle: 'CEO',
      src: '../../../assets/image/man1.jpg',
    },
    {
      name: 'Marwa',
      jobTitle: 'Operation Manager',
      src: '../../../assets/image/woman.jpg',
    },
    {
      name: 'Maher',
      jobTitle: 'CEO',
      src: '../../../assets/image/man2.jpg',
    },
  ];
}
