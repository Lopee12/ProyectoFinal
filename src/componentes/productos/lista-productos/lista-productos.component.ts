import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../../../interfaces/Producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ROLES } from '../../../enum/roles';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css',
})
export class ListaProductosComponent implements OnInit {
  ROLES = ROLES;
  role: string | null = '';
  listaProductos: Producto[] = [];
  listaFiltradaProductos: Producto[] = [];
  listaCategorias: string[] = [];
  fb = inject(FormBuilder);

  filtroForm = this.fb.nonNullable.group({
    categoria: [''],
  });

  constructor(
    private productosService: ProductoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getActiveRole();
    this.mostrarLista();
  }

  mostrarLista() {
    this.productosService.getProductos().subscribe({
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

  eliminarProducto(producto: Producto) {
    this.productosService.deleteProductos(producto.id).subscribe({
      next: (produc: Producto) => {
        this.mostrarLista();
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  campoOrden: keyof Producto | null = null;
  esAscendente: boolean = true;

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
