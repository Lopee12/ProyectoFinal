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
  listaFiltradaProductos: Producto[] = [];
  listaCategorias: string[] = [];

  // Mapa para relacionar el id del producto con la cantidad seleccionada
  productosSeleccionados: { [id: string]: number } = {};

  mostrarFormulario: boolean = false;
  productoSeleccionado: any = null;
  producto: any = null;
  estadoCheckbox: boolean[] = [];
  mostrarInput: boolean[] = [];
  

  pedido: Pedido = {
    fecha: '',
    estado: '',
    productos: [],
  };

  toastr = inject(ToastrService);
  pt = inject(ProductoService);
  fb = inject(FormBuilder);
  ps = inject(PedidoService);

  filtroForm = this.fb.nonNullable.group({
    categoria: [''],
  });

  getListaProductos() {
    this.pt.getProductos().subscribe({
      next: (prod) => {
        this.listaProductos = prod;
        this.listaFiltradaProductos = prod;
        this.extraerCategorias();
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

      this.productoSeleccionado = null;
      this.estadoCheckbox[index] = false;
      this.mostrarInput[index] = false;
    }
  }

  sumar(producto: Producto) {

    const actual = this.productosSeleccionados[producto.id] || 0;
    
    this.productosSeleccionados[producto.id] = actual + 1;
    this.cargarArregloProductos(this.productosSeleccionados[producto.id]);
    
  }

  restar(producto: Producto) {

    const actual = this.productosSeleccionados[producto.id] || 0;
    if (actual > 0) {
      this.productosSeleccionados[producto.id] = actual - 1;
      this.cargarArregloProductos(this.productosSeleccionados[producto.id]);
    }
  }

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

      
      this.estadoCheckbox[indice] = true;
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

    // Se arma el pedido utilizando la lista completa y el mapa de cantidades
    const productosPedidos = this.listaProductos
      .filter(p => (this.productosSeleccionados[p.id] || 0) > 0)
      .map(p => ({
        ...p,
        cantidad: this.productosSeleccionados[p.id]
      }));

    if (productosPedidos.length === 0) {
      this.toastr.error('No hay productos para pedir', 'Error');
      return;
    }

    this.pedido.fecha = this.obtenerFechaActual();
    this.pedido.productos = [...productosPedidos];
    this.pedido.estado = 'En espera de confirmacion';      

    this.ps.postPedido(this.pedido).subscribe({
        next: () => {
          this.productosSeleccionados = {};
          this.toastr.success('Se ingreso correctamente');
        },
        error: (err) => {
          console.log('Error', err);
        },
    });

  }

  extraerCategorias() {
    this.listaCategorias = Array.from(
      new Set(this.listaProductos.map((producto) => producto.categoria))
    );
  }

  filtrarPorCategoria() {
    const categoriaSeleccionada = this.filtroForm.get('categoria')?.value;
    if (categoriaSeleccionada) {
      this.listaFiltradaProductos = this.listaProductos.filter(
        (producto) => producto.categoria === categoriaSeleccionada
      );
    } else {
      this.listaFiltradaProductos = [...this.listaProductos];
    }
  }

  resetearFiltros() {
    this.filtroForm.reset();
    this.listaFiltradaProductos = [...this.listaProductos];
  }
}
