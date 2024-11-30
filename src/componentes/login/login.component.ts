import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Usuario } from '../../interfaces/Usuario.interface';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { LogoComponent } from '../ui/logo/logo.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule, LogoComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  constructor(private logService: AuthService) {}

  ngOnInit() {
    if (this.logService.isAuthenticatedUser()) {
      this.logService.autoRedirect();
    }
  }

  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  listaUsuarios: Usuario[] = [];

  formulario = this.fb.nonNullable.group({
    nombre: ['', [Validators.required]],
    contrasena: ['', [Validators.required]],
  });

  ingresarUsuarioYContrasena() {
    if (this.formulario.invalid) {
      this.toastr.error('Usuario o contraseña incorrectos');
      return;
    }

    const { nombre, contrasena } = this.formulario.getRawValue();
    this.logService.login(nombre, contrasena);
  }
}
