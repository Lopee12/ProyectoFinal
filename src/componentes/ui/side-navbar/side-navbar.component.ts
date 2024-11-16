import { Component, OnInit } from '@angular/core';
import { ThemeSwitcherComponent } from '../theme-switcher/theme-switcher.component';
import { RoleViewerComponent } from '../role-viewer/role-viewer.component';
import { ROLES } from '../../../enum/roles';
import { AuthService } from '../../../services/auth.service';
import { RouterLink } from '@angular/router';
import { LogoComponent } from '../logo/logo.component';
import { ItemNavbarComponent } from '../item-navbar/item-navbar.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-side-navbar',
  standalone: true,
  imports: [
    ThemeSwitcherComponent,
    RoleViewerComponent,
    RouterLink,
    LogoComponent,
    ItemNavbarComponent,
  ],
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SideNavbarComponent implements OnInit {
  ROLES = ROLES;
  actualRole: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.actualRole = this.authService.getActiveRole() || '';
  }
}
