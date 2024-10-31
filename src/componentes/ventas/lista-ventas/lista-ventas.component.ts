import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import { venta } from '../../../interfaces/Venta.interface';

@Component({
  selector: 'app-lista-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-ventas.component.html',
  styleUrl: './lista-ventas.component.css'
})
export class ListaVentasComponent implements OnInit{
  
  listaVentas: venta[] = [];
  vs = inject(VentaService);

  ngOnInit(): void {
    this.getLista();
  }

  getLista(){
    this.vs.getListaVentas().subscribe({
      next:(venta) =>{
        this.listaVentas = venta;
        console.log(this.listaVentas);
      },
      error:(err) =>{
        console.log("Error",err);
      }
    })
  }


  

}
