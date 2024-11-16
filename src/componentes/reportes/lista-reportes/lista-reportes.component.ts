import { Component, inject, OnInit } from '@angular/core';
import { Producto } from '../../../interfaces/Producto.interface';
import { Reporte } from '../../../interfaces/Reporte.interface';
import { ReporteService } from '../../../services/reporte.service';
import { RouterModule } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-reportes',
  standalone: true,
  imports: [RouterModule,DatePipe, ReactiveFormsModule, CommonModule],
  templateUrl: './lista-reportes.component.html',
  styleUrl: './lista-reportes.component.css',
})
export class ListaReportesComponent implements OnInit{

  constructor(private reporteService: ReporteService) {}

  ngOnInit(): void {
    this.mostrarLista();
    this.cargarAnios();
  }


  fb = inject(FormBuilder);
  reportes: Reporte[] = [];
  reportesFiltrados : Reporte [] = [];


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

  anios: number[] = [];

  filtroForm = this.fb.nonNullable.group({

    mes: [''],
    anio: [''],
  });



  mostrarLista() {
    this.reporteService.getListaReportes().subscribe({
      next: (rep) => {
        this.reportes = rep;
        this.reportesFiltrados = rep;
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
      this.reportesFiltrados = this.reportes.filter((reporte) => {
        const fechaReporte = new Date(reporte.fecha);
        return (
          fechaReporte.getMonth() + 1 === parseInt(mes, 10) &&
          fechaReporte.getFullYear() === parseInt(anio, 10)
        );
      });
    } else {
      this.reportesFiltrados = [...this.reportes];
    }
  }

  resetearFiltros() {

    this.filtroForm.reset();
    this.reportesFiltrados = [...this.reportes];

  }
}
