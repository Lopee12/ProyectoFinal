import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Usuario } from '../../../interfaces/Usuario.interface';
import { UsuarioService } from '../../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.css',
})
export class NuevoUsuarioComponent implements OnInit {
  fb = inject(FormBuilder);
  ts = inject(UsuarioService);
  toastr = inject(ToastrService);
  listaUsuarios: Usuario[] = [];
  formulario = this.fb.nonNullable.group({
    nombreUsuario: ['', Validators.required],
    contrasena: ['', Validators.required],
    tipoUsuario: ['', Validators.required],
  });

  ngOnInit(): void {
    this.getLista();
  }

  addUsuario() {
    if (this.formulario.invalid) {
      this.toastr.error('Complete el formulario', 'Error');
      return;
    }
    const usuario = this.formulario.getRawValue();
    if (
      !this.validarNombreUsuario(
        this.formulario.controls['nombreUsuario'].value
      )
    ) {
      this.agregarLista(usuario);
      this.formulario.reset({
        nombreUsuario: '',
        contrasena: '',
        tipoUsuario: '',
      });
      this.toastr.success('Usuario agregado correctamente', 'Éxito');
    } else {
      this.toastr.error(
        'El nombre de usuario ya existe. Por favor ingrese otro',
        'Error'
      );
    }
  }

  agregarLista(usuario: Usuario) {
    this.ts.postUsuario(usuario).subscribe({
      next: (usuario: Usuario) => {
        this.toastr.success('Usuario agregado correctamente', 'Éxito');
      },
      error: (e: Error) => {
        this.toastr.error(e.message, 'Error');
      },
    });
  }

  validarNombreUsuario(nombreUsuario: string) {
    return this.listaUsuarios.find(
      (usuario) => usuario.nombreUsuario === nombreUsuario
    );
  }

  getLista() {
    this.ts.getUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        this.listaUsuarios = usuarios;
      },
      error: (e: Error) => {
        this.toastr.error(e.message, 'Error');
      },
    });
  }
}
