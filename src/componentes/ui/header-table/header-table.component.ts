import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'th[app-header-table]',
  standalone: true,
  imports: [],
  templateUrl: './header-table.component.html',
})
export class HeaderTableComponent {
  @Input() titulo: string = '';
  @Input() campo: string = '';
  @Input() campoOrden: string | null = null;
  @Input() esAscendente: boolean = true;
  @Output() ordenar = new EventEmitter<string>();

  ordenarPor() {
    this.ordenar.emit(this.campo);
  }
}
