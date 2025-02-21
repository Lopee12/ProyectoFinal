import { Routes } from '@angular/router';
import { InicioPageComponent } from '../pages/inicio-page/inicio-page.component';
import { AgregarProductoPageComponent } from '../pages/agregar-producto-page/agregar-producto-page.component';
import { ModificarProductoPageComponent } from '../pages/modificar-producto-page/modificar-producto-page.component';
import { ListaPorductosPageComponent } from '../pages/lista-porductos-page/lista-porductos-page.component';
import { MenuAdminPageComponent } from '../pages/menu-admin-page/menu-admin-page.component';
import { MenuEncargadoPageComponent } from '../pages/menu-encargado-page/menu-encargado-page.component';
import { MenuSupervisorPageComponent } from '../pages/menu-supervisor-page/menu-supervisor-page.component';
import { MenuVendedorPageComponent } from '../pages/menu-vendedor-page/menu-vendedor-page.component';
import { ListaVentasPageComponent } from '../pages/lista-ventas-page/lista-ventas-page.component';
import { NuevaVentaPageComponent } from '../pages/nueva-venta-page/nueva-venta-page.component';
import { NuevoPedidoPageComponent } from '../pages/nuevo-pedido-page/nuevo-pedido-page.component';
import { ListaPedidosPageComponent } from '../pages/lista-pedidos-page/lista-pedidos-page.component';
import { NuevoReportePageComponent } from '../pages/nuevo-reporte-page/nuevo-reporte-page.component';
import { ListaReportesPageComponent } from '../pages/lista-reportes-page/lista-reportes-page.component';
import { ListaUsuarioPageComponent } from '../pages/lista-usuario-page/lista-usuario-page.component';
import { NuevoUsuarioPageComponent } from '../pages/nuevo-usuario-page/nuevo-usuario-page.component';
import { CargarRemitoPageComponent } from '../pages/cargar-remito-page/cargar-remito-page.component';

import { AuthGuard } from '../guard/auth.guard';
import { ROLES } from '../enum/roles';

export const routes: Routes = [
  {
    path: '',
    component: InicioPageComponent,
  },
  {
    path: 'AgregarProducto',
    component: AgregarProductoPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN] },
  },
  {
    path: 'ListaProductos',
    component: ListaPorductosPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN, ROLES.ENCARGADO] },
  },
  {
    path: 'ModificarProducto/:id',
    component: ModificarProductoPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN] },
  },
  {
    path: 'MenuAdministrador',
    component: MenuAdminPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN] },
  },
  {
    path: 'MenuEncargado',
    component: MenuEncargadoPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ENCARGADO] },
  },
  {
    path: 'MenuSupervisor',
    component: MenuSupervisorPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.SUPERVISOR] },
  },
  {
    path: 'MenuVendedor',
    component: MenuVendedorPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.VENDEDOR] },
  },
  {
    path: 'ListaVentas',
    component: ListaVentasPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.VENDEDOR] },
  },
  {
    path: 'NuevaVenta',
    component: NuevaVentaPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.VENDEDOR] },
  },
  {
    path: 'NuevoPedido',
    component: NuevoPedidoPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ENCARGADO] },
  },
  {
    path: 'ListarPedido',
    component: ListaPedidosPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ENCARGADO] },
  },
  {
    path: 'NuevoReporte',
    component: NuevoReportePageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ENCARGADO] },
  },
  {
    path: 'ListaReporte',
    component: ListaReportesPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN, ROLES.ENCARGADO] },
  },
  {
    path: 'ListaUsuarios',
    component: ListaUsuarioPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN] },
  },
  {
    path: 'NuevoUsuario',
    component: NuevoUsuarioPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN] },
  },
  {
    path: 'CargarRemito',
    component: CargarRemitoPageComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ENCARGADO] },
  },
  {
    path: '**',
    redirectTo: '',
  },
];
