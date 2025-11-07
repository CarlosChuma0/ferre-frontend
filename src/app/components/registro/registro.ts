import { Component } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { UsuarioService } from '../../services/usuario-service';
import { Usuario } from '../../models/usuario';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './registro.html',
  styleUrls:['./registro.css'],
})
export class Registro {

  nombre = '';
  username = ''; // el back no lo usa; podemos mapearlo a email
  email = '';
  password = '';
  msgRegistro = '';
  loading = false;
  telefono = '';
  dni = '';
  cuit = '';
  direccion = '';
  categoriaFiscal = '';

  constructor(private usuarioService: UsuarioService, private router: Router) { }
  

 registrarUsuario() {
    this.msgRegistro = '';

    if (!this.nombre || !this.email || !this.password || !this.telefono || !this.dni || !this.cuit || !this.direccion || !this.categoriaFiscal) {
      this.msgRegistro = 'Completá todos los campos obligatorios.';
      return;
    }

    // Si tenemos el método de backend, lo usamos:
    const svc: any = this.usuarioService;
    if (typeof svc.registrarCliente$ === 'function') {
      const payload = {
        nombre: this.nombre,
        email: this.email,
        telefono: this.telefono,
        password: this.password,
        dni: this.dni,
        cuit: this.cuit,                 
        direccion: this.direccion,
        categoriaFiscal: this.categoriaFiscal
      };

      this.loading = true;
      svc.registrarCliente$(payload)
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: () => {
            // El service ya guarda userId/username en sessionStorage
            this.router.navigateByUrl('/compra'); 
          },
          error: (err: any) => {
            this.msgRegistro = err?.error?.message || 'No se pudo registrar.';
          }
        });

      return;
    }

    // Fallback local (tu lógica actual en memoria)
    const nuevoUsuario = new Usuario(
      0,
      this.nombre,
      this.username || this.email, // si no hay username, usamos email
      this.email,
      this.password,
      true
    );

    const exito = this.usuarioService.registrarUsuario(nuevoUsuario);
    if (exito) {
      this.msgRegistro = 'Usuario registrado correctamente. Ahora podés iniciar sesión.';
      this.nombre = this.username = this.email = this.password = '';
    } else {
      this.msgRegistro = 'El usuario o email ya existe.';
    }
  }
}
