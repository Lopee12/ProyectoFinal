import { Component, inject } from '@angular/core';
import { Pedido } from '../../../interfaces/Pedido.interface';
import { PedidoService } from '../../../services/pedido.service';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lista-pedidos',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './lista-pedidos.component.html',
  styleUrl: './lista-pedidos.component.css'
})
export class ListaPedidosComponent {

  constructor(private listaPedidosService: PedidoService) {}
  listaPedidos: Pedido[] = [];
  pedidosFiltrados: Pedido[] = [];
  anios: number[] = [];

  ngOnInit(): void{ 
      this.mostrarLista();
      this.cargarAnios();
  }

  fb = inject(FormBuilder);
  
  meses = [
      { valor: 1, nombre: 'Enero' },
      { valor: 2, nombre: 'Febrero' },
      { valor: 3, nombre: 'Marzo' },
      { valor: 4, nombre: 'Abril' },
      { valor: 5, nombre: 'Mayo' },
      { valor: 6, nombre: 'Junio' },
      { valor: 7, nombre: 'Julio' },
      { valor: 8, nombre: 'Agosto' },
      { valor: 9, nombre: 'Septiembre' },
      { valor: 10, nombre: 'Octubre' },
      { valor: 11, nombre: 'Noviembre' },
      { valor: 12, nombre: 'Diciembre' },
  ];

  filtroForm = this.fb.nonNullable.group({

    mes: [''],
    anio: [''],
  });

  mostrarLista() {
    this.listaPedidosService.getListaPedidos().subscribe({
      next: (pedido) => {
        this.listaPedidos = pedido;
        this.pedidosFiltrados = pedido;
      },

      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  cargarAnios() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= anioActual - 10; i--) {
      this.anios.push(i);
    }
  }

  aplicarFiltro() {
    const { mes, anio } = this.filtroForm.value;
  
    if (mes && anio) {
      this.pedidosFiltrados = this.listaPedidos.filter((pedido) => {
        // Dividir la fecha "dd/MM/yyyy"
        const [dia, mesPedido, anioPedido] = pedido.fecha.split('/').map(Number);
        return mesPedido === parseInt(mes, 10) && anioPedido === parseInt(anio, 10);
      });
    } else {
      this.pedidosFiltrados = [...this.listaPedidos];
    }
  }

  resetearFiltros() {

    this.filtroForm.reset();
    this.pedidosFiltrados = [...this.listaPedidos];

  }
}
