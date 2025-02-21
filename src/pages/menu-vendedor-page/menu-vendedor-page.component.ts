import { Component } from '@angular/core';
import { VendedorComponent } from '../../componentes/menus/vendedor/vendedor.component';

@Component({
  selector: 'app-menu-vendedor-page',
  standalone: true,
  imports: [VendedorComponent],
  templateUrl: './menu-vendedor-page.component.html',
  styleUrl: './menu-vendedor-page.component.css',
})
export class MenuVendedorPageComponent {}
