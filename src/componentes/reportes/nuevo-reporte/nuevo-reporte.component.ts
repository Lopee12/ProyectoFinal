import { Component, inject } from '@angular/core';
import { Producto } from '../../../interfaces/Producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule, DatePipe } from '@angular/common';
import { Reporte } from '../../../interfaces/Reporte.interface';
import { ReporteService } from '../../../services/reporte.service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import * as uuid from 'uuid';

@Component({
  selector: 'app-nuevo-reporte',
  standalone: true,
  imports: [CommonModule, RouterModule, DatePipe],
  templateUrl: './nuevo-reporte.component.html',
  styleUrl: './nuevo-reporte.component.css',
})
export class NuevoReporteComponent {
  dia = new Date();
  productos: Producto[] = [];
  reporte: Reporte = {
    id: uuid.v4(),
    fecha: new Date(),
    productos: new Array<Producto>(),
  };

  constructor(
    private productosService: ProductoService,
    private reporteService: ReporteService
  ) {}

  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.mostrarLista();
  }

  mostrarLista() {
    this.productosService.getProductos().subscribe({
      next: (prod) => {
        this.productos = prod;
      },

      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  listaReporte() {
    this.reporteService.getListaReportes().subscribe({
      next: (rep) => {},
    });
  }

  setSubtotal(id: string, cantidad: string | null) {
    this.productosService.getProductoById(id).subscribe({
      next: (produc: Producto) => {
        produc.diferencia = -(produc.cantidad == null
          ? 0
          : produc.cantidad - (Number(cantidad) ?? 0));
        this.productosService.putProducto(produc).subscribe({
          next: (produc: Producto) => {
            this.mostrarLista();
          },
          error: (err) => {
            console.log('Error', err);
          },
        });
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  enviarDatos() {
    this.reporte.productos = this.productos.filter(
      (producto) => producto.diferencia !== 0
    );

    if (this.reporte.productos.length != 0) {
      this.reporteService.postReportes(this.reporte).subscribe({
        next: (rep: Reporte) => {
          this.toastr.success('Reporte creado correctamente', 'Exito');
          this.productos.forEach((producto) => {
            if (producto.id) {
              producto.cantidad += producto.diferencia;
              producto.diferencia = 0;
              this.productosService.putProducto(producto).subscribe({
                next: (prod: Producto) => {
                  this.mostrarLista();
                },
              });
            }
          });
        },
      });
    } else {
      this.toastr.error(
        'No se ha realizado el ajuste de ningun producto',
        'Error'
      );
    }
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

    this.productos.sort((a, b) => {
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
}
