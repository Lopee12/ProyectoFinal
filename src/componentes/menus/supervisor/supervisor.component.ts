import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Pedido } from '../../../interfaces/Pedido.interface';
import { PedidoService } from '../../../services/pedido.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-supervisor',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './supervisor.component.html',
  styleUrl: './supervisor.component.css',
})
export class SupervisorComponent {
  constructor(private listaPedidosService: PedidoService) {}
  listaPedidos: Pedido[] = [];
  selects: boolean[] = [];
  modifyEstado: boolean[] = [];
  toastr = inject(ToastrService);

  ngOnInit(): void {
    this.mostrarLista();
  }

  mostrarLista() {
    this.listaPedidosService.getPedidosEnEspera().subscribe({
      next: (pedido) => {
        this.listaPedidos = pedido;
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      },
    });
  }

  modficarPedido(ped: Pedido) {
    this.listaPedidosService.putPedido(ped).subscribe({
      next: () => {
        this.toastr.success('Estado actualizado correctamente','Exito');
      },
      error: (err) => {
        this.toastr.error(err.message, 'Error');
      },
    });
  }

  valorEstado(valorEstado: string, index: number): boolean {
    if (valorEstado === 'En espera de confirmacion') return true;
    return false;
  }

  cambiarEstadoAceptacion(index: number) {
    this.listaPedidos[index].estado = 'Aceptado';
    this.modficarPedido(this.listaPedidos[index]);
  }

  cambiarEstadoRechazo(index: number) {
    this.listaPedidos[index].estado = 'Rechazado';
    this.modficarPedido(this.listaPedidos[index]);
  }

  authService = inject(AuthService);
  logout() {
    this.authService.logout();
  }
}
