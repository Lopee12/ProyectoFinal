import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button-route',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './button-route.component.html',
  styleUrl: './button-route.component.css',
})
export class ButtonRouteComponent {
  @Input() routerLink: string = '/';
  @Input() texto: string = '';
  isHovered: boolean = false;
}
