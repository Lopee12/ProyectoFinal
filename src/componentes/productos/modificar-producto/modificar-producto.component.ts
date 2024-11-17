import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ProductoService } from '../../../services/producto.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Producto } from '../../../interfaces/Producto.interface';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modificar-producto',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './modificar-producto.component.html',
  styleUrl: './modificar-producto.component.css',
})
export class ModificarProductoComponent implements OnInit {
  constructor(private productosService: ProductoService) {}

  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  ar = inject(ActivatedRoute);
  id: string = 'default';

  ngOnInit(): void {
    this.setearIdProducto();
  }

  formulario = this.fb.nonNullable.group({
    id: [''],
    nombre: ['', [Validators.required]],
    precio: [0, [Validators.required]],
    cantidad: [0, [Validators.required]],
    categoria: ['', [Validators.required]],
    diferencia: [0, [Validators.required]],
  });

  setearIdProducto() {
    this.ar.paramMap.subscribe({
      next: (param) => {
        this.id = param.get('id') ?? 'default';
        console.log(this.id);
        this.setearFormulario(this.id);
      },
      error: (err) => {
        console.log(err.message);
      },
    });
  }

  setearFormulario(id: string) {
    this.productosService.getProductoById(id).subscribe({
      next: (prod) => {
        this.formulario.controls['id'].setValue(prod.id);
        this.formulario.controls['nombre'].setValue(prod.nombre);
        this.formulario.controls['precio'].setValue(prod.precio ?? 0);
        this.formulario.controls['categoria'].setValue(prod.categoria);
        this.formulario.controls['cantidad'].setValue(prod.cantidad ?? 0);
      },
    });
  }

  actualizarProducto() {
    if (this.formulario.invalid) {
      this.toastr.error('Error al actualizar el producto');
      return;
    }
    const prod = this.formulario.getRawValue();
    if (this.productosService.getProductoByNombre(prod.nombre) === null) {
      this.updateProd(prod);
    } else {
      this.toastr.error('Error al actualizar el producto', 'Nombre existente');
    }
  }

  updateProd(prod: Producto) {
    this.productosService.putProducto(prod).subscribe({
      next: () => {
        this.toastr.success('El producto se actualizo correctamente');
      },
      error(err) {
        console.log(err.message);
      },
    });
  }
}
