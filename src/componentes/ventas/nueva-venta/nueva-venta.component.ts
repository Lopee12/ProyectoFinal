import { Component, inject, OnInit } from '@angular/core';
import { VentaService } from '../../../services/venta.service';
import { Producto } from '../../../interfaces/Producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { Venta } from '../../../interfaces/Venta.interface';
import { RouterModule } from '@angular/router';
import * as uuid from 'uuid';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HeaderTableComponent } from '../../ui/header-table/header-table.component';

@Component({
  selector: 'app-nueva-venta',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HeaderTableComponent,
  ],
  templateUrl: './nueva-venta.component.html',
  styleUrl: './nueva-venta.component.css',
})
export class NuevaVentaComponent implements OnInit {
  ngOnInit(): void {
    this.getListaProductos();
  }

  listaProductos: Producto[] = [];
  listaProductosVenta: number[] = [];
  campoOrden: keyof Producto | null = null;
  esAscendente: boolean = true;
  listaFiltradaProductos: Producto[] = [];
  listaCategorias: string[] = [];
  fb = inject(FormBuilder);

  auth = inject(AuthService);
  toastr = inject(ToastrService);

  filtroForm = this.fb.nonNullable.group({
    categoria: [''],
  });

  setThisVenta(): Venta {
    return {
      id: uuid.v4(),
      fecha: new Date().toLocaleDateString('es-ES'),
      total: 0,
      productos: [],
      vendedor: this.auth.getUserName() || '',
    };
  }
  venta: Venta = this.setThisVenta();
  pt = inject(ProductoService);
  vt = inject(VentaService);

  getListaProductos() {
    this.pt.getProductos().subscribe({
      next: (prod) => {
        this.listaProductos = prod;
        this.listaFiltradaProductos = prod;
        this.extraerCategorias();
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      },
    });
  }

  ordenarPor(campo: keyof Producto) {
    if (this.campoOrden === campo) {
      this.esAscendente = !this.esAscendente;
    } else {
      this.campoOrden = campo;
      this.esAscendente = true;
    }
    this.listaProductos.sort((a, b) => {
      const valorA = a[campo];
      const valorB = b[campo];
      if (valorA === null || valorA === undefined)
        return this.esAscendente ? 1 : -1;
      if (valorB === null || valorB === undefined)
        return this.esAscendente ? -1 : 1;
      if (valorA < valorB) return this.esAscendente ? -1 : 1;
      if (valorA > valorB) return this.esAscendente ? 1 : -1;
      return 0;
    });
  }

  sumar(p: Producto, i: number) {
    if ((p.cantidad ? p.cantidad : 0) > (this.listaProductosVenta[i] | 0)) {
      if (!this.listaProductosVenta[i]) {
        this.listaProductosVenta[i] = 1;
      } else {
        this.listaProductosVenta[i]++;
      }
    }
    this.venta.productos[i] = { ...this.listaProductos[i] };
    this.venta.productos[i].cantidad = this.listaProductosVenta[i];
  }

  restar(p: Producto, i: number) {
    if (this.listaProductosVenta[i] > 0) {
      this.listaProductosVenta[i]--;
      this.venta.productos[i] = { ...this.listaProductos[i] };
      this.venta.productos[i].cantidad = this.listaProductosVenta[i];
    }
  }

  calcularTotal() {
    this.venta.total = 0;
    this.venta.productos.forEach((p) => {
      this.venta.total += p.precio * p.cantidad;
    });
  }

  cargarVenta() {
    this.calcularTotal();
    this.venta.productos = this.listaProductos
      .map((producto, index) => {
        return {
          ...producto,
          cantidad: this.listaProductosVenta[index] || 0,
        };
      })
      .filter((producto) => producto.cantidad > 0);
    if (this.venta.productos.length === 0) {
      this.toastr.error('No hay productos para vender', 'Error');
      return;
    }

    this.vt.postVenta(this.venta).subscribe({
      next: (ven) => {
        this.venta.productos.forEach((productoVenta) => {
          this.pt.getProductoById(productoVenta.id).subscribe({
            next: (producto) => {
              producto.cantidad -= productoVenta.cantidad;
              this.pt.putProducto(producto).subscribe({
                next: (updatedProducto) => {
                  this.listaProductosVenta = [];
                  this.venta = this.setThisVenta();
                  this.getListaProductos();
                },
                error: (err) => {
                  this.toastr.error('Error al actualizar el stock', 'Error');
                },
              });
            },
            error: (err) => {
              this.toastr.error('Error al obtener el producto', 'Error');
            },
          });
        });
        this.toastr.success(
          'Venta generada correctamente y stock actualizado',
          'Exito'
        );
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
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
