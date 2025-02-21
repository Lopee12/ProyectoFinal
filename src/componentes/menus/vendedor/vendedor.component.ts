import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  NgxChartsModule,
  Color,
  ScaleType,
  LegendPosition,
} from '@swimlane/ngx-charts';
import { VentaService } from '../../../services/venta.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Venta } from '../../../interfaces/Venta.interface';
import { Usuario } from '../../../interfaces/Usuario.interface';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-vendedor',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './vendedor.component.html',
  styleUrl: './vendedor.component.css',
})
export class VendedorComponent {
  single: any[] = [];
  view: [number, number] = [800, 400];

  colorScheme: Color = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [],
  };

  categoryColors: { [key: string]: string } = {
    'Ropa Casual': '#1f77b4',
    Accesorios: '#aec7e8',
    'Ropa Deportiva': '#ff7f0e',
    Abrigos: '#ffbb78',
    Calzado: '#2ca02c',
    'Ropa Interior': '#98df8a',
    Faldas: '#d62728',
    Pantalones: '#ff9896',
    'Ropa Formal': '#9467bd',
    Otros: '#c5b0d5',
  };

  constructor(
    private auth: AuthService,
    private ventaService: VentaService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    const username = this.auth.getUserName();
    if (username) {
      this.usuarioService
        .getUsuario(username)
        .subscribe((usuarios: Usuario[]) => {
          usuarios.forEach((usuario) => {
            this.ventaService.getListaVentas().subscribe((ventas: Venta[]) => {
              const productoVentas: {
                [key: string]: { cantidad: number; categoria: string };
              } = {};
              ventas
                .filter((venta) => venta.vendedor === usuario.nombreUsuario)
                .forEach((venta) => {
                  venta.productos.forEach((producto) => {
                    if (productoVentas[producto.nombre]) {
                      productoVentas[producto.nombre].cantidad +=
                        producto.cantidad;
                    } else {
                      productoVentas[producto.nombre] = {
                        cantidad: producto.cantidad,
                        categoria: producto.categoria,
                      };
                    }
                  });
                });

              const vendedorData = {
                name: usuario.nombreUsuario,
                series: Object.keys(productoVentas).map((key) => ({
                  name: key,
                  value: productoVentas[key].cantidad,
                  extra: { categoria: productoVentas[key].categoria },
                })),
              };

              vendedorData.series.sort((a, b) => b.value - a.value);

              this.single.push(vendedorData);

              this.colorScheme.domain = this.single.flatMap((vendedorData) =>
                vendedorData.series.map(
                  (item: {
                    name: string;
                    value: number;
                    extra: { categoria: string };
                  }) => this.categoryColors[item.extra.categoria] || '#c5b0d5'
                )
              );
            });
          });
        });
    }
  }
}
