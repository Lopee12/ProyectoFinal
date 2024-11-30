import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

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
      const allowedRoles = route.data['roles'] as string[];
      if (
        !allowedRoles ||
        allowedRoles.length === 0 ||
        allowedRoles.some((role) => this.authService.hasRole(role))
      ) {
        return true;
      }
    }
    window.location.href = '/login';
    return false;
  }
}
