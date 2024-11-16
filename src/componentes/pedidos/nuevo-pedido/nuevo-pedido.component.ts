import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Producto } from '../../../interfaces/Producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Pedido } from '../../../interfaces/Pedido.interface';
import { PedidoService } from '../../../services/pedido.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-pedido',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './nuevo-pedido.component.html',
  styleUrl: './nuevo-pedido.component.css',
})
export class NuevoPedidoComponent {
  ngOnInit(): void {
    this.getListaProductos();
  }

  listaProductos: Producto[] = [];
  listaProductosPedido: Producto[] = [];

  mostrarFormulario: boolean = false;
  productoSeleccionado: any = null;
  producto: any = null;
  estadoCheckbox: boolean[] = [];
  mostrarInput: boolean[] = [];
  ArregloCantidad: number[] = [];

  pedido: Pedido = {
    fecha: '',
    estado: '',
    productos: [],
  };

  toastr = inject(ToastrService);
  pt = inject(ProductoService);
  fb = inject(FormBuilder);
  ps = inject(PedidoService);

  getListaProductos() {
    this.pt.getProductos().subscribe({
      next: (prod) => {
        this.listaProductos = prod;
        this.ArregloCantidad = Array(this.listaProductos.length).fill(0);
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  seleccionarProducto(index: number, checkbox: HTMLInputElement) {
    if (checkbox.checked) {
      this.productoSeleccionado = { ...this.listaProductos[index] };
      this.estadoCheckbox[index] = true;
      this.mostrarInput[index] = true;
    } else {
      if (this.productoSeleccionado != null) {
        this.listaProductosPedido = this.listaProductosPedido.filter(
          (producto) => producto.id !== this.productoSeleccionado.id
        );
      }

      this.ArregloCantidad[index] = 0;
      this.productoSeleccionado = null;
      this.estadoCheckbox[index] = false;
      this.mostrarInput[index] = false;
    }
  }

  sumar(i: number) {
    // if ((this.listaProductos[i].cantidad || 0) > this.ArregloCantidad[i]) // limitar la cantidad de productos al stock
    this.productoSeleccionado = { ...this.listaProductos[i] };
    this.ArregloCantidad[i]++;
    this.cargarArregloProductos(this.ArregloCantidad[i]);
  }
  restar(i: number) {
    if (this.ArregloCantidad[i] > 0) {
      this.productoSeleccionado = { ...this.listaProductos[i] };
      this.ArregloCantidad[i]--;
      this.cargarArregloProductos(this.ArregloCantidad[i]);
    }
  }

  // verificarCantidad(): number {
  //   if (this.productoSeleccionado != null) {
  //     return this.productoSeleccionado.cantidad;
  //   }
  //   return 0;
  // }

  // validarCantidad(cantidadInput: HTMLInputElement) {
  //   const max = this.verificarCantidad();
  //   const valor = +cantidadInput.value;
  //   const min = 1;

  //   if (valor > max) {
  //     cantidadInput.value = max.toString();
  //   }

  //   if (valor <= 0) {
  //     cantidadInput.value = min.toString();
  //   }
  // }

  // validarCantidadInicial(id: number): number | null {
  //   const index = this.listaProductosPedido.findIndex(
  //     (producto) => (producto.id = id)
  //   );

  //   if (index == -1) {
  //     return 1;
  //   } else {
  //     return this.listaProductosPedido[index].cantidad;
  //   }
  // }

  // eliminarDatoFormulario() {
  //   if (this.mostrarFormulario && this.productoSeleccionado != null) {
  //     const index = this.listaProductos.findIndex(
  //       (producto) => producto.id === this.productoSeleccionado.id
  //     );

  //     if (
  //       this.listaProductosPedido.some(
  //         (producto) => producto.id === this.productoSeleccionado.id
  //       )
  //     ) {
  //       this.listaProductosPedido = this.listaProductosPedido.filter(
  //         (producto) => producto.id != this.productoSeleccionado.id
  //       );
  //     }

  //     this.estadoCheckbox[index] = false;
  //     this.mostrarFormulario = !this.mostrarFormulario;
  //   }
  // }

  cargarArregloProductos(cantidad: number) {
    if (this.productoSeleccionado != null) {
      const index = this.listaProductosPedido.findIndex(
        (producto) => producto.id === this.productoSeleccionado.id
      );
      const indice = this.listaProductos.findIndex(
        (producto) => producto.id === this.productoSeleccionado.id
      );

      if (index == -1) {
        this.productoSeleccionado.cantidad = cantidad;
        this.listaProductosPedido.push(this.productoSeleccionado);
      } else {
        this.listaProductosPedido[index].cantidad = cantidad;
      }

      this.ArregloCantidad[indice] = cantidad;
      this.estadoCheckbox[indice] = true;
      //this.mostrarInput[indice] = !this.mostrarInput;
    }
  }

  obtenerFechaActual(): string {
    const fechaActual: Date = new Date();

    const dia: string = String(fechaActual.getDate()).padStart(2, '0');
    const mes: string = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const anio: number = fechaActual.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }

  cargarPedido() {
    if (this.listaProductosPedido.length != 0) {
      this.pedido.fecha = this.obtenerFechaActual();
      this.pedido.productos = [...this.listaProductosPedido];
      this.pedido.estado = 'En espera de confirmacion';

      this.ps.postPedido(this.pedido).subscribe({
        next: () => {
          this.toastr.success('Se ingreso correctamente');
        },
        error: (err) => {
          console.log('Error', err);
        },
      });
    } else {
      this.toastr.error('No se ha cargado ningun producto a la venta');
    }
  }
}
