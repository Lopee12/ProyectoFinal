import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import { Venta } from '../../../interfaces/Venta.interface';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-lista-ventas',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-ventas.component.html',
  styleUrl: './lista-ventas.component.css',
})
export class ListaVentasComponent implements OnInit {
  listaVentas: Venta[] = [];
  vs = inject(VentaService);

  ngOnInit(): void {
    this.getLista();
  }

  getLista() {
    this.vs.getListaVentas().subscribe({
      next: (venta) => {
        this.listaVentas = venta;
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }
}
