import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../../interfaces/Producto.interface';
import { ProductoService } from '../../../services/producto.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as uuid from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-producto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './nuevo-producto.component.html',
  styleUrl: './nuevo-producto.component.css',
})
export class NuevoProductoComponent implements OnInit {
  constructor(
    private toastr: ToastrService,
    private productosService: ProductoService
  ) {}

  fb = inject(FormBuilder);
  listaProductos: Producto[] = [];
  listaCategorias: string[] = [];

  ngOnInit(): void {
    this.getLista();
    this.habilitarCategoria();
  }

  formulario = this.fb.nonNullable.group({
    id: [uuid.v4()],
    nombre: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0)]],
    cantidad: [0, [Validators.required, Validators.min(1)]],
    categoria: ['', [Validators.required]],
    nuevaCategoria: ['', [Validators.required]],
    diferencia: [0, [Validators.required]],
  });

  addProducto() {
    if (this.formulario.invalid) {
      this.showError('Complete Formulario', 'Error al completar el formulario');
      return;
    }

    const prod = this.formulario.getRawValue();

    if (!this.validarNombreProducto(this.formulario.controls['nombre'].value)) {
      this.agregarLista(prod);
      this.formulario.reset({
        id: uuid.v4(),
        nombre: '',
        precio: 0,
        cantidad: 0,
        categoria: '',
        nuevaCategoria: '',
        diferencia: 0,
      });
    } else {
      this.showError('Error', 'Nombre existente');
    }

    return false;
  }

  agregarLista(prod: Producto) {
    this.productosService.postProductos(prod).subscribe({
      next: () => {
        this.showSuccess(
          'Producto agregado',
          'El producto se ha agregado correctamente'
        );
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  getLista() {
    this.productosService.getProductos().subscribe({
      next: (prod) => {
        this.listaProductos = prod;
        this.cargarCategorias();
      },
      error: (err) => {
        console.log('Error', err);
      },
    });
  }

  validarNombreProducto(nombre: string) {
    return this.listaProductos.find((prod) => prod.nombre === nombre);
  }

  cargarCategorias() {
    this.listaCategorias = Array.from([
      ...new Set(this.listaProductos.map((prod) => prod.categoria)),
    ]);
  }

  buscarCategoria(categoria: string) {
    return (
      this.listaCategorias.some((cate) => cate === categoria) ||
      this.listaCategorias.some(
        (cate) => cate.toLowerCase() === categoria.toLocaleLowerCase()
      )
    );
  }

  showSuccess(titulo: string, mensaje: string) {
    this.toastr.success(`${mensaje}`, `${titulo}`);
  }
  showError(titulo: string, mensaje: string) {
    this.toastr.error(`${mensaje}`, `${titulo}`);
  }
  cargarDatoCaregorias(categoria: string) {
    if (!this.buscarCategoria(categoria) && categoria !== '') {
      this.listaCategorias.push(categoria);
      this.habilitarCategoria();
      this.showSuccess('Categoria agregada', 'Se agrego correctamente');
    } else {
      this.showError('Error', 'La categoria ya existe o esta vacia');
    }
  }

  deshabilitarCategoria() {
    this.formulario.get('categoria')?.disable();
    this.formulario.get('nuevaCategoria')?.enable();
  }

  habilitarCategoria() {
    this.formulario.get('categoria')?.enable();
    this.formulario.get('nuevaCategoria')?.disable();
  }

  estadoCategoria() {
    return this.formulario.get('categoria')?.disabled;
  }
}
