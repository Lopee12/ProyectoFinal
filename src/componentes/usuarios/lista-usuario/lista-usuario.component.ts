import { Component, inject, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../interfaces/Usuario.interface';
import { RouterModule } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-usuario',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './lista-usuario.component.html',
  styleUrl: './lista-usuario.component.css'
})
export class ListaUsuarioComponent implements OnInit {

  ngOnInit(): void {
    this.listarUsuarios();
  }

  ts = inject(UsuarioService);
  fb = inject(FormBuilder);

  listaUsuarios : Usuario [] = [];
  listaFiltrada : Usuario [] = [];
  tiposUsuarios : string [] = [];

  filtroForm = this.fb.nonNullable.group({
    tipoUsuario : ['']
  });

  agregarUsuario (usuario : Usuario) {

    this.listaUsuarios.push({...usuario});
  }

  listarUsuarios()
  {
    this.ts.getUsuarios().subscribe({
      next: (usuarios : Usuario[]) => {
        this.listaUsuarios = usuarios;
        this.listaFiltrada = usuarios;
        this.extrarTiposUsuarios();
      },
      error : (e : Error) => {
        console.log(e.message);
      }
    })
  }

  delete(id : string | number | null | undefined){

    this.ts.deletePersona(id).subscribe({
      next : () => {
        alert('Borrado correctamente');
        this.listarUsuarios();
      },
      error : (e : Error) => 
      {
        console.log(e.message);
      }
    })
  }

  extrarTiposUsuarios() {
    this.tiposUsuarios = Array.from(
      new Set(this.listaUsuarios.map((usuario) => usuario.tipoUsuario))
    );
    
  }

  filtrarPorTipoUsuario() {

    const tipoSeleccionado = this.filtroForm.get('tipoUsuario')?.value;
    if(tipoSeleccionado) {
      this.listaFiltrada = this.listaUsuarios.filter(
        (usuario) => usuario.tipoUsuario === tipoSeleccionado
      );
    } else {
      this.listaFiltrada = [...this.listaUsuarios];
    }
  }


  resetearFiltros() {
    
    this.filtroForm.reset();
    this.listaFiltrada = [...this.listaUsuarios];
  }
  
}
