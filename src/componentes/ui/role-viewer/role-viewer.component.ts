import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-role-viewer',
  standalone: true,
  imports: [],
  templateUrl: './role-viewer.component.html',
  styleUrl: './role-viewer.component.css',
})
export class RoleViewerComponent implements OnInit {
  username: string | null = '';
  role: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.username = this.authService.getUserName();
    this.role = this.authService.getActiveRole();
  }

  logout() {
    this.authService.logout();
  }
}
