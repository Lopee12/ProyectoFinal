import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROLES } from '../enum/roles';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticatedUser()) {
      // Define permisos de acceso para cada ruta.
      const allowedRoles = route.data['roles'] as string[];
      if (
        !allowedRoles ||
        allowedRoles.length === 0 ||
        allowedRoles.some((role) => this.authService.hasRole(role))
      ) {
        return true;
      }
    }
    // Redirige al usuario a la página de inicio de sesión si no tiene acceso.
    // Puedes usar window.location.href o router.navigate según tus necesidades.
    window.location.href = '/login';
    return false;
  }
}