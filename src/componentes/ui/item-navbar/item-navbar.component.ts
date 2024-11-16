import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-item-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './item-navbar.component.html',
  styleUrls: ['./item-navbar.component.css'],
})
export class ItemNavbarComponent {
  @Input() texto: string = '';
  @Input() link: string = '';
}
