import {
  Component,
  inject,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
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
  imports: [CommonModule, FormsModule, RouterModule, ReactiveFormsModule],
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
    this.cargarAnios();
  }

  
  listaPedidosAceptados: Pedido[] = [];
  listaPedidosFiltrados: Pedido[] = [];
  anios: number[] = [];
  nuevaCantidad: number = 0;
  toastr = inject(ToastrService);
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

  listarPedidosAceptados() {
    this.ts.getPedidosAceptados().subscribe({
      next: (pedidos) => {
        this.listaPedidosAceptados = pedidos;
        this.listaPedidosFiltrados = pedidos;
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

  cargarAnios() {
    const anioActual = new Date().getFullYear();
    for (let i = anioActual; i >= anioActual - 10; i--) {
      this.anios.push(i);
    }
  }

  aplicarFiltro() {
    const { mes, anio } = this.filtroForm.value;

    if (mes && anio) {
      this.listaPedidosFiltrados = this.listaPedidosAceptados.filter((pedido) => {
        // Dividir la fecha "dd/MM/yyyy"
        const [dia, mesPedido, anioPedido] = pedido.fecha.split('/').map(Number);
        return mesPedido === parseInt(mes, 10) && anioPedido === parseInt(anio, 10);
      });
    } else {
      this.listaPedidosFiltrados = [...this.listaPedidosAceptados];
    }
  }

  resetearFiltros() {

    this.filtroForm.reset();
    this.listaPedidosFiltrados = [...this.listaPedidosAceptados];

  }
}
