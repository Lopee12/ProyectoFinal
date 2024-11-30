import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Pedido } from '../../../interfaces/Pedido.interface';
import { PedidoService } from '../../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../../services/producto.service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cargar-remito',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cargar-remito.component.html',
  styleUrl: './cargar-remito.component.css',
})

export class CargarRemitoComponent implements OnInit {
  constructor(
    private productoService: ProductoService,
    private ts: PedidoService
  ) {}
  @ViewChild('inputRecibido') inputRecibido!: ElementRef;

  ngOnInit(): void {
    this.listarPedidosAceptados();
  }

  listaPedidosAceptados: Pedido[] = [];
  nuevaCantidad: number = 0;
  toastr = inject(ToastrService);

  listarPedidosAceptados() {
    this.ts.getPedidosAceptados().subscribe({
      next: (pedidos) => {
        this.listaPedidosAceptados = pedidos;
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  setRecibido(pedido: Pedido, id: string, value: string) {
    pedido.productos.find((producto) => producto.id === id)!.cantidad =
      Number(value);
  }

  cargarProducto(pedido: Pedido) {
    pedido.productos.forEach((produ) => {
      if (produ.id) {
        this.productoService.getProductoById(produ.id).subscribe({
          next: (producto) => {
            if (producto.cantidad !== null && producto.cantidad !== undefined) {
              producto.cantidad += produ.cantidad ? produ.cantidad : 0;
            } else {
              producto.cantidad = produ.cantidad;
            }
            this.productoService.putProducto(producto).subscribe({
              next: (producto) => {
                this.toastr.success("Stock actualizado","Exito");
                pedido.estado = 'Entregado';
                this.ts.putPedido(pedido).subscribe({
                  next: (pedido) => {
                    this.toastr.success("Pedido actualizado","Exito");
                    this.listarPedidosAceptados();
                  },
                  error: (err) => {
                    this.toastr.error("Error al acutalizar pedido","Error");
                  },
                });
              },
              error: (err) => {
                this.toastr.error("Error al acutalizar stock","Error");
              },
            });
          },
          error: (err) => {
            this.toastr.error("Error no se encuentra el producto","Error");
          },
        });
      }
    });
  }
}
