import { inject, Injectable } from '@angular/core';
import { UsuarioService } from './usuario.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  uss = inject(UsuarioService);
  private isAuthenticated = false;
  private userRoles: string[] = [];
  private router = inject(Router);
  private currentUser: string | null = null;

  getUserName(): string | null {
    return localStorage.getItem('currentUser');
  }

  login(username: string, password: string) {
    this.uss.getUsuario(username).subscribe({
      next: (usuario) => {
        if (usuario[0].contrasena === password) {
          this.isAuthenticated = true;
          this.currentUser = usuario[0].nombreUsuario;
          this.userRoles = [usuario[0].tipoUsuario];
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('currentUser', this.currentUser);
          localStorage.setItem('userRoles', JSON.stringify(this.userRoles));
          this.redirectUser(usuario[0].tipoUsuario);
        }
      },
      error: (err) => console.log('Error', err),
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.userRoles = [];
    this.currentUser = null;
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userRoles');
    this.router.navigate(['/login']);
  }

  isAuthenticatedUser(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  getActiveRole(): string | null {
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles)[0] : null;
  }

  hasRole(role: string): boolean {
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles).includes(role) : false;
  }

  autoRedirect() {
    this.redirectUser(this.getActiveRole() || '');
  }

  private redirectUser(role: string) {
    switch (role) {
      case 'administrador':
        this.router.navigate(['/MenuAdministrador']);
        break;
      case 'encargado':
        this.router.navigate(['/MenuEncargado']);
        break;
      case 'supervisor':
        this.router.navigate(['/MenuSupervisor']);
        break;
      case 'vendedor':
        this.router.navigate(['/MenuVendedor']);
        break;
      default:
        this.router.navigate(['/']);
        break;
    }
  }
}
